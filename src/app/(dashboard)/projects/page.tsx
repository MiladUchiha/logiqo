'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Building2, 
  Search, 
  Filter,
  Grid3X3,
  List,
  Calendar,
  DollarSign,
  Users
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Card from '@/components/ui/Card/Card'
import ProjectCard from '@/components/dashboard/ProjectCard/ProjectCard'
import styles from './projects.module.css'

export default function ProjectsPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { projects, loading, fetchProjects, setCurrentProject } = useProjectStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('created_at')

  useEffect(() => {
    if (!user) {
      router.push('/signin')
      return
    }
    fetchProjects()
  }, [user, router, fetchProjects])

  const handleProjectClick = (project: any) => {
    setCurrentProject(project)
    router.push(`/projects/${project.id}`)
  }

  const handleCreateProject = () => {
    router.push('/projects/new')
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.address?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'status':
        return a.status.localeCompare(b.status)
      case 'budget':
        return (b.budget || 0) - (a.budget || 0)
      case 'created_at':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const getProjectStats = () => {
    const total = projects.length
    const active = projects.filter(p => p.status === 'active').length
    const planning = projects.filter(p => p.status === 'planning').length
    const completed = projects.filter(p => p.status === 'completed').length
    const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
    
    return { total, active, planning, completed, totalBudget }
  }

  const stats = getProjectStats()

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading projects...</p>
      </div>
    )
  }

  return (
    <div className={styles.projectsPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerInfo}>
              <h1 className={styles.title}>Projects</h1>
              <p className={styles.subtitle}>
                Manage all your construction projects in one place
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

          {/* Stats */}
          <div className={styles.statsGrid}>
            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <Building2 className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.total}</div>
                  <div className={styles.statLabel}>Total Projects</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <Calendar className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.active}</div>
                  <div className={styles.statLabel}>Active</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <Users className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>{stats.planning}</div>
                  <div className={styles.statLabel}>Planning</div>
                </div>
              </div>
            </Card>

            <Card variant="glass" padding="medium">
              <div className={styles.statCard}>
                <DollarSign className={styles.statIcon} />
                <div className={styles.statContent}>
                  <div className={styles.statValue}>
                    ${(stats.totalBudget / 1000000).toFixed(1)}M
                  </div>
                  <div className={styles.statLabel}>Total Budget</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className={styles.controls}>
          <div className={styles.searchAndFilter}>
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={16} />}
            />
            
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className={styles.sortSelect}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Latest</option>
              <option value="name">Name</option>
              <option value="status">Status</option>
              <option value="budget">Budget</option>
            </select>
          </div>

          <div className={styles.viewControls}>
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {sortedProjects.length === 0 ? (
          <Card variant="glass" padding="large" className={styles.emptyState}>
            <Building2 size={48} className={styles.emptyIcon} />
            <h3>No projects found</h3>
            <p>
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Create your first construction project to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button
                variant="accent"
                icon={<Plus size={16} />}
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            )}
          </Card>
        ) : (
          <div className={`${styles.projectsContainer} ${styles[viewMode]}`}>
            {sortedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}