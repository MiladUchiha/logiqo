'use client'

import React from 'react'
import { Calendar, DollarSign, Users } from 'lucide-react'
import styles from './ProjectCard.module.css'

interface Project {
  id: string
  name: string
  description: string | null
  status: 'planning' | 'active' | 'on_hold' | 'completed'
  start_date: string | null
  end_date: string | null
  budget: number | null
  progress?: number
  team_count?: number
  tasks_completed?: number
  tasks_total?: number
}

interface ProjectCardProps {
  project: Project
  onClick?: () => void
  loading?: boolean
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onClick, 
  loading = false 
}) => {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'planning': return styles.statusPlanning
      case 'active': return styles.statusActive
      case 'on_hold': return styles.statusOnHold
      case 'completed': return styles.statusCompleted
      default: return styles.statusPlanning
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'planning': return 'Planning'
      case 'active': return 'Active'
      case 'on_hold': return 'On Hold'
      case 'completed': return 'Completed'
      default: return 'Planning'
    }
  }

  const formatBudget = (budget: number | null) => {
    if (!budget) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const progress = project.progress || 
    (project.tasks_completed && project.tasks_total 
      ? Math.round((project.tasks_completed / project.tasks_total) * 100)
      : 0)

  return (
    <div 
      className={`${styles.projectCard} ${loading ? styles.loading : ''}`}
      onClick={onClick}
    >
      <div className={styles.projectHeader}>
        <div className={styles.projectInfo}>
          <h3 className={styles.projectTitle}>{project.name}</h3>
          <p className={styles.projectDescription}>
            {project.description || 'No description available'}
          </p>
        </div>
        
        <div className={`${styles.projectStatus} ${getStatusClass(project.status)}`}>
          {getStatusLabel(project.status)}
        </div>
      </div>

      <div className={styles.projectMetrics}>
        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {formatBudget(project.budget)}
          </div>
          <div className={styles.metricLabel}>Budget</div>
        </div>
        
        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {formatDate(project.end_date)}
          </div>
          <div className={styles.metricLabel}>Due Date</div>
        </div>
        
        <div className={styles.metric}>
          <div className={styles.metricValue}>
            {project.team_count || 0}
          </div>
          <div className={styles.metricLabel}>Team</div>
        </div>
      </div>

      <div className={styles.projectProgress}>
        <div className={styles.progressLabel}>
          <span className={styles.progressText}>Progress</span>
          <span className={styles.progressPercentage}>{progress}%</span>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className={styles.projectTeam}>
        <span className={styles.teamLabel}>Team</span>
        <div className={styles.teamAvatars}>
          <div className={styles.avatar}>JD</div>
          <div className={styles.avatar}>SM</div>
          <div className={styles.avatar}>AL</div>
          {(project.team_count || 0) > 3 && (
            <div className={`${styles.avatar} ${styles.moreAvatars}`}>
              +{(project.team_count || 0) - 3}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectCard