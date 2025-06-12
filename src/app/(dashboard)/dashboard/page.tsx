'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Building2, ArrowRight, TrendingUp } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import DocumentChat from '@/components/dashboard/DocumentChat/DocumentChat'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuthStore()
  const { projects, loading: projectsLoading, fetchProjects, setCurrentProject } = useProjectStore()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin')
      return
    }

    if (user) {
      fetchProjects().catch(error => {
        console.error('Failed to fetch projects:', error)
      })
    }
  }, [user, authLoading, fetchProjects, router])

  const handleProjectClick = (project: any) => {
    setCurrentProject(project)
    router.push(`/projects/${project.id}`)
  }

  const handleCreateProject = () => {
    router.push('/projects/new')
  }

  if (authLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const activeProjects = projects.filter(p => p.status === 'active').length
  const totalDocuments = projects.reduce((total, project) => total + (project.metadata?.documentCount || 0), 0)
  const totalTeamMembers = projects.reduce((total, project) => total + (project.metadata?.teamCount || 1), 0)
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((total, project) => total + (project.metadata?.progress || 0), 0) / projects.length)
    : 0

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Clean Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </h1>
              <p className={styles.subtitle}>
                {projects.length} active projects • {totalDocuments} documents
              </p>
            </div>
            
            <Button
              variant="accent"
              icon={<Plus size={16} />}
              onClick={handleCreateProject}
            >
              New Project
            </Button>
          </div>
        </div>

        {/* Minimal Stats */}
        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{activeProjects}</div>
              <div className={styles.statLabel}>Active</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{avgProgress}%</div>
              <div className={styles.statLabel}>Progress</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{totalTeamMembers}</div>
              <div className={styles.statLabel}>Team</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className={styles.mainGrid}>
          {/* Projects Section */}
          <div className={styles.projectsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              {projects.length > 3 && (
                <button 
                  className={styles.viewAllButton}
                  onClick={() => router.push('/projects')}
                >
                  View all <ArrowRight size={14} />
                </button>
              )}
            </div>
            
            <div className={styles.projectsList}>
              {projectsLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className={styles.projectItemSkeleton}>
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} style={{ width: '60%' }} />
                  </div>
                ))
              ) : projects.length > 0 ? (
                projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className={styles.projectItem}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className={styles.projectInfo}>
                      <div className={styles.projectName}>{project.name}</div>
                      <div className={styles.projectMeta}>
                        {project.address || project.description || 'No description'}
                      </div>
                    </div>
                    <div className={styles.projectStatus}>
                      <div 
                        className={styles.statusDot}
                        style={{ 
                          backgroundColor: project.status === 'active' ? '#10B981' : 
                                         project.status === 'planning' ? '#3B82F6' : 
                                         project.status === 'completed' ? '#6366F1' : '#F59E0B'
                        }}
                      />
                      <span className={styles.statusText}>
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <Building2 size={32} className={styles.emptyIcon} />
                  <div className={styles.emptyText}>
                    <h3>No projects yet</h3>
                    <p>Create your first project to get started</p>
                  </div>
                  <Button
                    variant="accent"
                    icon={<Plus size={16} />}
                    onClick={handleCreateProject}
                  >
                    Create Project
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* AI Assistant */}
          <div className={styles.aiSection}>
            <DocumentChat />
          </div>
        </div>
      </div>
    </div>
  )
}