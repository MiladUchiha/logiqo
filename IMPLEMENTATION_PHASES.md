# Implementation Phases - Construction PM Tool

## Phase 1: Foundation & MVP (Weeks 1-6)
*Goal: Core functionality with AI document chat*

### Week 1-2: Project Setup & Authentication
```typescript
// Extend your existing Next.js setup
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── onboarding/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   └── documents/
│   │   └── api/
│   │       ├── auth/
│   │       ├── projects/
│   │       └── ai/
```

#### Tasks:
- [ ] Supabase integration with your existing design system
- [ ] User authentication (email/password, Google SSO)
- [ ] Role-based access control (PM, Foreman, Subcontractor, Client)
- [ ] Onboarding flow using your card/modal patterns
- [ ] Dark theme implementation matching your color system

#### Design Components:
```typescript
// Extend your existing components
const AuthCard = styled(Card)`
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  /* Use your existing card styling */
`;

const LoginForm = () => (
  <AuthCard>
    <Input placeholder="Email" />
    <Input type="password" placeholder="Password" />
    <Button variant="primary">Sign In</Button>
  </AuthCard>
);
```

### Week 3-4: Dashboard Foundation
Using your existing dashboard patterns:

```typescript
// Dashboard layout similar to your landing page structure
const DashboardLayout = () => (
  <div className="min-h-screen bg-[var(--color-background)]">
    <Navbar /> {/* Extend your existing navbar */}
    <main className="pt-16">
      <DashboardHeader />
      <DashboardGrid />
    </main>
  </div>
);

// Dashboard cards using your SystemTools card pattern
const ProjectCard = ({ project }: { project: Project }) => (
  <div className={styles.toolCard}>
    <div className={styles.toolHeader}>
      <Building className={styles.toolIcon} />
      <h3 className={styles.toolTitle}>{project.name}</h3>
    </div>
    <p className={styles.toolDescription}>{project.description}</p>
    <div className={styles.mockInterface}>
      {/* Project status visualization */}
    </div>
  </div>
);
```

### Week 5-6: Document Management & AI Chat MVP

#### Document Upload Component
```typescript
// Extend your file upload patterns
const DocumentUploader = () => {
  const [isDragging, setIsDragging] = useState(false);
  
  return (
    <div 
      className={`${styles.uploadZone} ${isDragging ? styles.dragging : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
    >
      <Upload className={styles.uploadIcon} />
      <h3>Drop construction documents here</h3>
      <p>PDF, DWG, JPG, PNG files up to 50MB</p>
    </div>
  );
};
```

#### AI Chat Interface
```typescript
// Similar to your AICapabilities component structure
const DocumentChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <MessageSquare className={styles.chatIcon} />
        <h3>Ask about your documents</h3>
      </div>
      
      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </div>
      
      <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};
```

## Phase 2: Core Project Management (Weeks 7-12)
*Goal: Complete project management functionality*

### Week 7-8: Project Structure & Team Management

#### Project Creation Wizard
```typescript
// Multi-step wizard using your modal patterns
const ProjectWizard = () => {
  const [step, setStep] = useState(1);
  
  const steps = [
    { title: "Project Details", component: ProjectDetailsStep },
    { title: "Team Setup", component: TeamSetupStep },
    { title: "Document Upload", component: DocumentUploadStep },
    { title: "Initial Planning", component: PlanningStep }
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.wizardContainer}>
        <WizardProgress currentStep={step} totalSteps={steps.length} />
        <StepComponent step={steps[step - 1]} />
        <WizardNavigation onNext={nextStep} onPrev={prevStep} />
      </div>
    </Modal>
  );
};
```

### Week 9-10: Task Management & Basic Scheduling

#### Task Board Component
```typescript
// Kanban-style board with your card styling
const TaskBoard = ({ projectId }: { projectId: string }) => {
  const columns = ['To Do', 'In Progress', 'Review', 'Complete'];
  
  return (
    <div className={styles.taskBoard}>
      {columns.map((column) => (
        <TaskColumn key={column} title={column} projectId={projectId} />
      ))}
    </div>
  );
};

const TaskCard = ({ task }: { task: Task }) => (
  <div className={styles.taskCard}>
    <div className={styles.taskHeader}>
      <span className={styles.taskPriority}>{task.priority}</span>
      <TaskMenu taskId={task.id} />
    </div>
    <h4 className={styles.taskTitle}>{task.title}</h4>
    <p className={styles.taskDescription}>{task.description}</p>
    <div className={styles.taskFooter}>
      <UserAvatar user={task.assignee} />
      <span className={styles.taskDueDate}>{task.dueDate}</span>
    </div>
  </div>
);
```

### Week 11-12: Mobile Optimization & PWA

#### Progressive Web App Setup
```typescript
// PWA configuration
const pwaConfig = {
  name: "ConstructFlow",
  short_name: "ConstructFlow",
  description: "AI-Powered Construction Project Management",
  theme_color: "#66E8FA", // Your accent color
  background_color: "#30383C", // Your background color
  display: "standalone",
  orientation: "portrait",
  scope: "/",
  start_url: "/dashboard"
};
```

#### Mobile Camera Integration
```typescript
// Camera component for progress photos
const ProgressPhotoCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const capturePhoto = async () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (videoRef.current && context) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob(resolve as BlobCallback, 'image/jpeg', 0.8);
      });
      
      await uploadProgressPhoto(blob);
    }
  };
  
  return (
    <div className={styles.cameraContainer}>
      <video ref={videoRef} autoPlay playsInline />
      <button onClick={capturePhoto} className={styles.captureButton}>
        <Camera size={24} />
      </button>
    </div>
  );
};
```

## Phase 3: Advanced Features (Weeks 13-18)
*Goal: AI-powered insights and advanced project management*

### Week 13-14: Advanced Scheduling (Gantt Charts)

#### Gantt Chart Implementation
```typescript
// Interactive Gantt chart component
const GanttChart = ({ tasks, onTaskUpdate }: GanttProps) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // GSAP animations for timeline interactions
    gsap.registerPlugin(Draggable);
    
    Draggable.create(`.${styles.taskBar}`, {
      type: "x",
      bounds: timelineRef.current,
      onDrag: handleTaskDrag,
      onDragEnd: handleTaskDragEnd
    });
  }, [tasks]);
  
  return (
    <div className={styles.ganttContainer}>
      <GanttHeader />
      <div ref={timelineRef} className={styles.timeline}>
        {tasks.map((task) => (
          <TaskBar key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};
```

### Week 15-16: Budget Management & Cost Tracking

#### Budget Dashboard
```typescript
// Budget tracking with your chart styling
const BudgetDashboard = ({ projectId }: { projectId: string }) => {
  const { data: budgetData } = useBudgetData(projectId);
  
  return (
    <div className={styles.budgetDashboard}>
      <BudgetOverview data={budgetData} />
      <CostBreakdown categories={budgetData.categories} />
      <ExpenseTimeline expenses={budgetData.expenses} />
      <ChangeOrderTracker orders={budgetData.changeOrders} />
    </div>
  );
};
```

### Week 17-18: Quality Control & Safety Management

#### Digital Inspection System
```typescript
// Inspection checklist with photo documentation
const InspectionChecklist = ({ templateId }: { templateId: string }) => {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  
  return (
    <div className={styles.inspectionContainer}>
      <InspectionHeader />
      
      {checklist.map((item) => (
        <ChecklistItem 
          key={item.id} 
          item={item} 
          onUpdate={updateItem}
          onPhotoAdd={addPhoto}
        />
      ))}
      
      <PhotoGallery photos={photos} />
      <InspectionActions onSubmit={submitInspection} />
    </div>
  );
};
```

## Phase 4: AI Enhancement & Analytics (Weeks 19-24)
*Goal: Advanced AI features and predictive analytics*

### Week 19-20: Predictive Analytics

#### Risk Assessment Dashboard
```typescript
// AI-powered risk monitoring
const RiskDashboard = ({ projectId }: { projectId: string }) => {
  const { data: risks } = useRiskAnalysis(projectId);
  
  return (
    <div className={styles.riskDashboard}>
      <RiskOverview risks={risks} />
      <PredictiveAlerts alerts={risks.alerts} />
      <MitigationRecommendations recommendations={risks.recommendations} />
    </div>
  );
};

// AI agent for risk assessment
class RiskAnalysisAgent {
  async analyzeProject(projectData: ProjectData): Promise<RiskAssessment> {
    const prompt = `
      Analyze this construction project for potential risks:
      
      Project: ${projectData.name}
      Timeline: ${projectData.timeline}
      Budget: ${projectData.budget}
      Weather: ${projectData.weather}
      Team: ${projectData.team}
      
      Identify risks and provide mitigation strategies.
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });
    
    return this.parseRiskAssessment(response.choices[0].message.content);
  }
}
```

### Week 21-22: Advanced AI Features

#### Smart Recommendations Engine
```typescript
// AI-powered project optimization
const SmartRecommendations = ({ projectId }: { projectId: string }) => {
  const { data: recommendations } = useAIRecommendations(projectId);
  
  return (
    <div className={styles.recommendationsPanel}>
      <h3>AI Recommendations</h3>
      
      {recommendations.map((rec) => (
        <RecommendationCard 
          key={rec.id} 
          recommendation={rec}
          onAccept={acceptRecommendation}
          onDismiss={dismissRecommendation}
        />
      ))}
    </div>
  );
};
```

### Week 23-24: Reporting & Analytics

#### Executive Dashboard
```typescript
// High-level project portfolio view
const ExecutiveDashboard = () => {
  const { data: portfolio } = useProjectPortfolio();
  
  return (
    <div className={styles.executiveDashboard}>
      <PortfolioOverview projects={portfolio.projects} />
      <PerformanceMetrics metrics={portfolio.metrics} />
      <TrendAnalysis trends={portfolio.trends} />
      <ActionableInsights insights={portfolio.insights} />
    </div>
  );
};
```

## Design System Integration

### Component Library Structure
```typescript
// Extend your existing component patterns
export const ConstructionComponents = {
  // Core UI (extend your existing)
  Button: YourExistingButton,
  Card: YourExistingCard,
  Modal: YourExistingModal,
  
  // Construction-specific
  ProjectCard: ProjectCard,
  TaskBoard: TaskBoard,
  DocumentViewer: DocumentViewer,
  GanttChart: GanttChart,
  BudgetTracker: BudgetTracker,
  InspectionForm: InspectionForm,
  AIChat: AIChat,
  
  // Mobile-specific
  CameraCapture: CameraCapture,
  OfflineIndicator: OfflineIndicator,
  SyncStatus: SyncStatus
};
```

### Animation Consistency
```typescript
// Maintain your GSAP animation patterns
const constructionAnimations = {
  pageTransition: {
    duration: 0.3,
    ease: "power2.out"
  },
  cardHover: {
    scale: 1.02,
    y: -4,
    duration: 0.2
  },
  taskDrag: {
    scale: 1.05,
    zIndex: 1000,
    duration: 0.1
  }
};
```

This implementation plan maintains your design excellence while building a comprehensive construction management tool with AI at its core. Each phase builds upon the previous one, ensuring a solid foundation while progressively adding advanced features.