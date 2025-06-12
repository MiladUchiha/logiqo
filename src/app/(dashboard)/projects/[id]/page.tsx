'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Building2, 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  Settings,
  Upload,
  MessageSquare,
  BarChart3
} from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import DocumentChat from '@/components/dashboard/DocumentChat/DocumentChat'
import styles from './project.module.css'

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuthStore()
  const { 
    currentProject, 
    projects, 
    documents, 
    tasks,
    setCurrentProject,
    fetchProjectDocuments,
    fetchProjectTasks 
  } = useProjectStore()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)

  const projectId = params.id as string

  useEffect(() => {
    if (!user) {
      router.push('/signin')
      return
    }

    // Find project in store or fetch it
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setCurrentProject(project)
      fetchProjectDocuments(projectId)
      fetchProjectTasks(projectId)
    } else {
      // Project not found, redirect to dashboard
      router.push('/dashboard')
    }
    
    setLoading(false)
  }, [projectId, projects, user, router, setCurrentProject, fetchProjectDocuments, fetchProjectTasks])

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading project...</p>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className={styles.errorContainer}>
        <h2>Project not found</h2>
        <Button onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return '#3B82F6'
      case 'active': return '#10B981'
      case 'on_hold': return '#F59E0B'
      case 'completed': return '#6366F1'
      default: return '#6B7280'
    }
  }

  const formatBudget = (budget: number | null) => {
    if (!budget) return 'Not set'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(budget)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: Users },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  ]

  return (
    <div className={styles.projectPage}>
      <div className={styles.container}>
        {/* Project Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.projectInfo}>
              <h1 className={styles.projectTitle}>{currentProject.name}</h1>
              <p className={styles.projectDescription}>
                {currentProject.description || 'No description provided'}
              </p>
            </div>
            
            <div className={styles.headerActions}>
              <div 
                className={styles.statusBadge}
                style={{ backgroundColor: `${getStatusColor(currentProject.status)}20`, color: getStatusColor(currentProject.status) }}
              >
                {currentProject.status.replace('_', ' ').toUpperCase()}
              </div>
              
              <Button
                variant="secondary"
                icon={<Settings size={16} />}
              >
                Settings
              </Button>
            </div>
          </div>

          {/* Project Stats */}
          <div className={styles.statsGrid}>
            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <DollarSign className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{formatBudget(currentProject.budget)}</div>
                  <div className={styles.statLabel}>Budget</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <Calendar className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{formatDate(currentProject.start_date)}</div>
                  <div className={styles.statLabel}>Start Date</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <Calendar className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{formatDate(currentProject.end_date)}</div>
                  <div className={styles.statLabel}>End Date</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <FileText className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{documents.length}</div>
                  <div className={styles.statLabel}>Documents</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewContent}>
              <div className={styles.overviewGrid}>
                <Card variant="glass" padding="large">
                  <h3 className={styles.cardTitle}>Project Progress</h3>
                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: '65%' }}
                      />
                    </div>
                    <span className={styles.progressText}>65% Complete</span>
                  </div>
                  
                  <div className={styles.milestones}>
                    <div className={styles.milestone}>
                      <div className={styles.milestoneIcon}>✓</div>
                      <span>Planning Phase</span>
                    </div>
                    <div className={styles.milestone}>
                      <div className={styles.milestoneIcon}>✓</div>
                      <span>Foundation</span>
                    </div>
                    <div className={styles.milestone}>
                      <div className={styles.milestoneIcon}>○</div>
                      <span>Framing</span>
                    </div>
                  </div>
                </Card>

                <Card variant="glass" padding="large">
                  <h3 className={styles.cardTitle}>Recent Activity</h3>
                  <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <FileText size={16} />
                      </div>
                      <div className={styles.activityContent}>
                        <p>Blueprint v2.1 uploaded</p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                    <div className={styles.activityItem}>
                      <div className={styles.activityIcon}>
                        <Users size={16} />
                      </div>
                      <div className={styles.activityContent}>
                        <p>Team meeting scheduled</p>
                        <span>1 day ago</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className={styles.documentsContent}>
              <div className={styles.documentsHeader}>
                <h3>Project Documents</h3>
                <Button
                  variant="accent"
                  icon={<Upload size={16} />}
                >
                  Upload Document
                </Button>
              </div>
              
              {documents.length === 0 ? (
                <Card variant="glass" padding="large" className={styles.emptyState}>
                  <FileText size={48} className={styles.emptyIcon} />
                  <h4>No documents yet</h4>
                  <p>Upload your first construction document to get started</p>
                  <Button
                    variant="accent"
                    icon={<Upload size={16} />}
                  >
                    Upload Document
                  </Button>
                </Card>
              ) : (
                <div className={styles.documentsGrid}>
                  {documents.map((doc) => (
                    <Card key={doc.id} variant="glass" padding="medium" interactive>
                      <div className={styles.documentCard}>
                        <FileText className={styles.documentIcon} />
                        <div className={styles.documentInfo}>
                          <h4>{doc.name}</h4>
                          <p>Version {doc.version}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className={styles.tasksContent}>
              <div className={styles.tasksHeader}>
                <h3>Project Tasks</h3>
                <Button
                  variant="accent"
                  icon={<Users size={16} />}
                >
                  Add Task
                </Button>
              </div>
              
              {tasks.length === 0 ? (
                <Card variant="glass" padding="large" className={styles.emptyState}>
                  <Users size={48} className={styles.emptyIcon} />
                  <h4>No tasks yet</h4>
                  <p>Create your first task to start organizing work</p>
                  <Button
                    variant="accent"
                    icon={<Users size={16} />}
                  >
                    Add Task
                  </Button>
                </Card>
              ) : (
                <div className={styles.tasksGrid}>
                  {tasks.map((task) => (
                    <Card key={task.id} variant="glass" padding="medium" interactive>
                      <div className={styles.taskCard}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <div className={styles.taskMeta}>
                          <span className={styles.taskStatus}>{task.status}</span>
                          <span className={styles.taskPriority}>{task.priority}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className={styles.chatContent}>
              <DocumentChat projectId={projectId} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}