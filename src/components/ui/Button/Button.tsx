'use client'

import React from 'react'
import styles from './Button.module.css'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  )
}

export default Button