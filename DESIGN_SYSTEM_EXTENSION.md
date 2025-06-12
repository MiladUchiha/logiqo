# Design System Extension for Construction PM Tool

## Maintaining Your Design Excellence

Your existing landing page demonstrates exceptional design principles that we'll extend throughout the construction PM tool. Here's how we'll maintain consistency while adding new functionality.

## Color System Extension

### Existing Palette (Maintained)
```css
:root {
  /* Your core colors - keeping these exact */
  --color-background: #30383C;
  --color-surface: #434E53;
  --color-surface-elevated: #465057;
  --color-border: #5F6F77;
  --color-border-subtle: #394247;
  --color-text-primary: #F5FCFF;
  --color-text-secondary: #D5E1E7;
  --color-text-tertiary: #B1C5CE;
  --color-accent: #66E8FA;
  --color-accent-hover: #9BF7FF;
}
```

### Construction-Specific Extensions
```css
:root {
  /* Status colors for construction workflows */
  --color-status-planning: #3B82F6;
  --color-status-active: #10B981;
  --color-status-review: #F59E0B;
  --color-status-complete: #6366F1;
  --color-status-delayed: #EF4444;
  --color-status-on-hold: #6B7280;
  
  /* Priority indicators */
  --color-priority-low: #10B981;
  --color-priority-medium: #F59E0B;
  --color-priority-high: #EF4444;
  --color-priority-critical: #DC2626;
  
  /* Construction-specific accents */
  --color-safety: #EF4444;
  --color-quality: #10B981;
  --color-budget: #3B82F6;
  --color-schedule: #8B5CF6;
  
  /* Document type indicators */
  --color-blueprint: #06B6D4;
  --color-contract: #8B5CF6;
  --color-permit: #10B981;
  --color-photo: #F59E0B;
}
```

## Component Extensions

### 1. Project Cards (Extending Your SystemTools Pattern)
```typescript
// ProjectCard.module.css
.projectCard {
  /* Inherit from your toolCard styling */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-xl);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(25px);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.projectCard:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
}

.projectHeader {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.projectIcon {
  width: 24px;
  height: 24px;
  color: var(--color-accent);
}

.projectTitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.projectStatus {
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.statusActive {
  background: rgba(16, 185, 129, 0.2);
  color: var(--color-status-active);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.statusPlanning {
  background: rgba(59, 130, 246, 0.2);
  color: var(--color-status-planning);
  border: 1px solid rgba(59, 130, 246, 0.3);
}
```

### 2. Document Chat Interface (Extending Your AI Capabilities)
```typescript
// DocumentChat.module.css
.chatContainer {
  /* Similar structure to your AICapabilities */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.1) 100%);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(25px);
  height: 600px;
  display: flex;
  flex-direction: column;
}

.chatHeader {
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.chatIcon {
  width: 20px;
  height: 20px;
  color: var(--color-accent);
}

.chatTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.messagesContainer {
  flex: 1;
  padding: var(--space-lg);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.message {
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
  max-width: 80%;
  animation: slideInUp 0.3s ease-out;
}

.messageUser {
  align-self: flex-end;
  background: var(--color-accent);
  color: var(--color-background);
}

.messageAI {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-text-primary);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.chatInput {
  padding: var(--space-lg) var(--space-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  gap: var(--space-md);
}

.inputField {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  color: var(--color-text-primary);
  font-size: 14px;
}

.sendButton {
  background: var(--color-accent);
  color: var(--color-background);
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-md) var(--space-lg);
  font-weight: 600;
  transition: all var(--transition-fast);
}

.sendButton:hover {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}
```

### 3. Task Board (New Component with Your Styling)
```typescript
// TaskBoard.module.css
.taskBoard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  padding: var(--space-xl);
}

.taskColumn {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: var(--space-lg);
  min-height: 500px;
}

.columnHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.columnTitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.taskCount {
  background: rgba(255, 255, 255, 0.15);
  color: var(--color-text-secondary);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 600;
}

.taskCard {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-md);
  cursor: pointer;
  transition: all var(--transition-normal);
}

.taskCard:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.taskPriority {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: var(--space-sm);
}

.priorityHigh {
  background: var(--color-priority-high);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.priorityMedium {
  background: var(--color-priority-medium);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
}

.priorityLow {
  background: var(--color-priority-low);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}
```

## Animation Patterns (Extending Your GSAP Usage)

### 1. Page Transitions
```typescript
// pageTransitions.ts
export const pageTransitions = {
  // Maintain your existing smooth transitions
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "power2.out" }
  },
  
  // New construction-specific transitions
  slideInFromRight: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: "power2.out" }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3, ease: "back.out(1.7)" }
  }
};
```

### 2. Interactive Animations
```typescript
// interactiveAnimations.ts
export const useTaskCardAnimation = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleHover = useCallback(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: -4,
        scale: 1.02,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  }, []);
  
  const handleLeave = useCallback(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        y: 0,
        scale: 1,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  }, []);
  
  return { cardRef, handleHover, handleLeave };
};
```

### 3. Loading States (Matching Your Style)
```typescript
// LoadingStates.module.css
.loadingContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
}

.loadingSpinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loadingText {
  margin-left: var(--space-md);
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.skeletonCard {
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}
```

## Mobile Adaptations

### 1. Touch-Optimized Components
```css
/* Mobile-specific adjustments */
@media (max-width: 768px) {
  .taskCard {
    padding: var(--space-lg);
    margin-bottom: var(--space-lg);
    /* Larger touch targets */
    min-height: 80px;
  }
  
  .chatInput {
    padding: var(--space-md);
    /* Larger input for mobile */
  }
  
  .inputField {
    font-size: 16px; /* Prevent zoom on iOS */
    padding: var(--space-lg);
  }
  
  .sendButton {
    padding: var(--space-lg);
    min-width: 60px;
  }
}
```

### 2. Gesture Support
```typescript
// gestureSupport.ts
export const useSwipeGesture = (onSwipeLeft: () => void, onSwipeRight: () => void) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (elementRef.current) {
      const hammer = new Hammer(elementRef.current);
      
      hammer.on('swipeleft', onSwipeLeft);
      hammer.on('swiperight', onSwipeRight);
      
      return () => hammer.destroy();
    }
  }, [onSwipeLeft, onSwipeRight]);
  
  return elementRef;
};
```

## Accessibility Enhancements

### 1. Focus Management
```css
/* Enhanced focus states matching your design */
.focusable:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}

.taskCard:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 4px;
}
```

### 2. Screen Reader Support
```typescript
// Accessibility helpers
export const AccessibilityAnnouncer = ({ message }: { message: string }) => (
  <div 
    role="status" 
    aria-live="polite" 
    className="sr-only"
  >
    {message}
  </div>
);

export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState('');
  
  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);
  
  return { announcement, announce };
};
```

This design system extension maintains your sophisticated aesthetic while adding the functionality needed for construction project management. Every new component follows your established patterns for consistency and user experience excellence.