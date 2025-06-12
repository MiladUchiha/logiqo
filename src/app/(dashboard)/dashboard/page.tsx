'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Building2, FileText, Users, BarChart3 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import ProjectCard from '@/components/dashboard/ProjectCard/ProjectCard'
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
      fetchProjects()
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

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        {/* Dashboard Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>
                Welcome back, {user.user_metadata?.full_name || 'User'}
              </h1>
              <p className={styles.subtitle}>
                Manage your construction projects with AI-powered insights
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

        {/* Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          {/* Quick Stats */}
          <div className={styles.statsGrid}>
            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Building2 size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{projects.length}</div>
                  <div className={styles.statLabel}>Active Projects</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FileText size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>24</div>
                  <div className={styles.statLabel}>Documents</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>12</div>
                  <div className={styles.statLabel}>Team Members</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <BarChart3 size={24} />
                </div>
                <div className={styles.statContent}>
                  <div className={styles.statValue}>85%</div>
                  <div className={styles.statLabel}>Avg Progress</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Projects Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Recent Projects</h2>
                <Button variant="secondary" size="small">
                  View All
                </Button>
              </div>
              
              <div className={styles.projectsGrid}>
                {projectsLoading ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <ProjectCard
                      key={index}
                      project={{
                        id: '',
                        name: 'Loading...',
                        description: null,
                        status: 'planning',
                        start_date: null,
                        end_date: null,
                        budget: null,
                        owner_id: ''
                      }}
                      loading={true}
                    />
                  ))
                ) : projects.length > 0 ? (
                  projects.slice(0, 3).map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  ))
                ) : (
                  <Card variant="glass" padding="large" className={styles.emptyState}>
                    <Building2 size={48} className={styles.emptyIcon} />
                    <h3 className={styles.emptyTitle}>No projects yet</h3>
                    <p className={styles.emptyDescription}>
                      Create your first construction project to get started with AI-powered management.
                    </p>
                    <Button
                      variant="accent"
                      icon={<Plus size={16} />}
                      onClick={handleCreateProject}
                    >
                      Create Project
                    </Button>
                  </Card>
                )}
              </div>
            </div>

            {/* AI Chat Section */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>AI Assistant</h2>
              </div>
              
              <DocumentChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}