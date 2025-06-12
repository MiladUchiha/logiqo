'use client'

import React, { forwardRef } from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
  variant?: 'input' | 'textarea' | 'file'
  inputSize?: 'small' | 'medium' | 'large'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  icon,
  variant = 'input',
  inputSize = 'medium',
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    variant === 'textarea' ? styles.textarea : styles.input,
    styles[inputSize],
    error && styles.error,
    success && styles.success,
    icon && styles.withIcon,
    className
  ].filter(Boolean).join(' ')

  const renderInput = () => {
    if (variant === 'textarea') {
      return (
        <textarea
          className={inputClasses}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      )
    }

    if (variant === 'file') {
      return (
        <>
          <input
            type="file"
            className={styles.fileInput}
            ref={ref}
            {...props}
          />
          <label htmlFor={props.id} className={styles.fileInputLabel}>
            {icon}
            <span>Choose file or drag and drop</span>
          </label>
        </>
      )
    }

    return (
      <input
        className={inputClasses}
        ref={ref}
        {...props}
      />
    )
  }

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={props.id} className={styles.label}>
          {label}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {icon && variant !== 'file' && (
          <span className={styles.icon}>{icon}</span>
        )}
        {renderInput()}
      </div>
      
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input