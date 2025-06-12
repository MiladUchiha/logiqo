'use client'

import React from 'react'
import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'surface' | 'glass'
  padding?: 'none' | 'small' | 'medium' | 'large'
  interactive?: boolean
  loading?: boolean
  status?: 'active' | 'planning' | 'review' | 'complete' | 'delayed'
  className?: string
  onClick?: () => void
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'medium',
  interactive = false,
  loading = false,
  status,
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    styles.card,
    variant !== 'default' && styles[variant],
    padding !== 'medium' && styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
    interactive && styles.interactive,
    loading && styles.loading,
    status && styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`],
    className
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

// Sub-components for structured content
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`${styles.header} ${className}`}>
    {children}
  </div>
)

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`${styles.content} ${className}`}>
    {children}
  </div>
)

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => (
  <div className={`${styles.footer} ${className}`}>
    {children}
  </div>
)

export default Card