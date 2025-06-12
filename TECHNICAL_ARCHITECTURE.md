# Technical Architecture - Construction PM Tool

## System Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (Next.js)     │◄──►│   (Supabase)    │◄──►│   (OpenAI)      │
│                 │    │                 │    │                 │
│ • React 19      │    │ • PostgreSQL    │    │ • GPT-4         │
│ • TypeScript    │    │ • Edge Functions│    │ • Embeddings    │
│ • Tailwind CSS  │    │ • Real-time     │    │ • Vision API    │
│ • GSAP          │    │ • File Storage  │    │ • Whisper       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Architecture

### Core Technologies
- **Next.js 15**: App Router, Server Components, Streaming
- **React 19**: Concurrent features, Suspense, Error Boundaries
- **TypeScript**: Strict type checking, interface definitions
- **Tailwind CSS**: Utility-first styling with custom design system
- **GSAP**: High-performance animations and micro-interactions

### State Management
```typescript
// Zustand for client state
interface AppState {
  user: User | null;
  currentProject: Project | null;
  documents: Document[];
  tasks: Task[];
  notifications: Notification[];
}

// React Query for server state
const useProjects = () => useQuery({
  queryKey: ['projects'],
  queryFn: fetchProjects,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Component Architecture
```
components/
├── ui/                    # Reusable UI components
│   ├── Button/
│   ├── Input/
│   ├── Modal/
│   └── Card/
├── features/              # Feature-specific components
│   ├── auth/
│   ├── projects/
│   ├── documents/
│   ├── tasks/
│   └── ai-chat/
├── layouts/               # Page layouts
│   ├── DashboardLayout/
│   ├── ProjectLayout/
│   └── AuthLayout/
└── providers/             # Context providers
    ├── AuthProvider/
    ├── ThemeProvider/
    └── QueryProvider/
```

## Backend Architecture (Supabase)

### Database Schema
```sql
-- Users and Authentication
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'project_manager',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status project_status DEFAULT 'planning',
  start_date DATE,
  end_date DATE,
  budget DECIMAL(12,2),
  owner_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project Members
CREATE TABLE project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role member_role DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES documents(id),
  uploaded_by UUID REFERENCES users(id),
  metadata JSONB DEFAULT '{}',
  embedding VECTOR(1536), -- OpenAI embedding dimension
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  dependencies UUID[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Chat Sessions
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  context JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role message_role NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Project members can access project data
CREATE POLICY "Project members can view projects" ON projects
  FOR SELECT USING (
    id IN (
      SELECT project_id FROM project_members 
      WHERE user_id = auth.uid()
    )
  );

-- Document access based on project membership
CREATE POLICY "Project members can view documents" ON documents
  FOR SELECT USING (
    project_id IN (
      SELECT project_id FROM project_members 
      WHERE user_id = auth.uid()
    )
  );
```

### Edge Functions
```typescript
// Document Processing Function
export default async function handler(req: Request) {
  const { documentId } = await req.json();
  
  // Extract text from document
  const text = await extractTextFromDocument(documentId);
  
  // Generate embeddings
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  
  // Store in database
  await supabase
    .from('documents')
    .update({ 
      embedding: embedding.data[0].embedding,
      metadata: { processed: true }
    })
    .eq('id', documentId);
    
  return new Response(JSON.stringify({ success: true }));
}
```

## AI Integration

### Document Chat System
```typescript
class DocumentChatService {
  async processQuery(query: string, projectId: string) {
    // 1. Generate query embedding
    const queryEmbedding = await this.generateEmbedding(query);
    
    // 2. Find relevant documents using vector similarity
    const relevantDocs = await this.findSimilarDocuments(
      queryEmbedding, 
      projectId
    );
    
    // 3. Create context from relevant documents
    const context = this.buildContext(relevantDocs);
    
    // 4. Generate response using GPT-4
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a construction project assistant. Use the following context to answer questions about the project: ${context}`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.1,
    });
    
    return response.choices[0].message.content;
  }
}
```

### Predictive Analytics
```typescript
class PredictiveAnalyticsService {
  async predictProjectDelay(projectId: string) {
    const projectData = await this.getProjectData(projectId);
    
    const prompt = `
      Analyze this construction project data and predict potential delays:
      
      Project: ${projectData.name}
      Current Status: ${projectData.status}
      Tasks: ${JSON.stringify(projectData.tasks)}
      Weather: ${projectData.weather}
      Budget Status: ${projectData.budgetStatus}
      
      Provide a risk assessment and recommendations.
    `;
    
    const analysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });
    
    return this.parseAnalysis(analysis.choices[0].message.content);
  }
}
```

## Mobile Architecture (PWA)

### Service Worker
```typescript
// sw.js - Service Worker for offline functionality
const CACHE_NAME = 'construction-pm-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/projects',
  '/documents',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});
```

### Camera Integration
```typescript
// Camera component for photo documentation
const CameraCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' } // Use back camera
    });
    
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  };
  
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          uploadPhoto(blob);
        }
      }, 'image/jpeg', 0.8);
    }
  };
  
  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button onClick={capturePhoto}>Capture</button>
    </div>
  );
};
```

## Performance Optimization

### Code Splitting
```typescript
// Lazy load heavy components
const GanttChart = lazy(() => import('./components/GanttChart'));
const DocumentViewer = lazy(() => import('./components/DocumentViewer'));
const AIChat = lazy(() => import('./components/AIChat'));

// Route-based code splitting
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

### Image Optimization
```typescript
// Next.js Image component with optimization
import Image from 'next/image';

const DocumentThumbnail: React.FC<{ src: string }> = ({ src }) => (
  <Image
    src={src}
    alt="Document thumbnail"
    width={200}
    height={150}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
    loading="lazy"
  />
);
```

### Caching Strategy
```typescript
// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Security Considerations

### Authentication & Authorization
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- Multi-factor authentication (MFA)
- Session management and timeout

### Data Protection
- Encryption at rest and in transit
- Secure file upload with virus scanning
- Input validation and sanitization
- SQL injection prevention (Supabase handles this)

### API Security
- Rate limiting on API endpoints
- CORS configuration
- API key management
- Request/response logging

This architecture provides a solid foundation for building a scalable, secure, and performant construction project management tool with AI capabilities.