'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Mail, Lock, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import styles from './AuthForm.module.css'

interface AuthFormProps {
  mode: 'signin' | 'signup'
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const router = useRouter()
  const { signIn, signUp } = useAuthStore()
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'project_manager'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const roles = [
    { value: 'project_manager', label: 'Project Manager' },
    { value: 'foreman', label: 'Foreman' },
    { value: 'subcontractor', label: 'Subcontractor' },
    { value: 'client', label: 'Client' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signin') {
        await signIn(formData.email, formData.password)
        router.push('/dashboard')
      } else {
        await signUp(formData.email, formData.password, formData.fullName, formData.role)
        setSuccess('Account created successfully! Please check your email to verify your account.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <div className={styles.logo}>
            <Building2 className={styles.logoIcon} />
            <h1 className={styles.logoText}>ConstructFlow</h1>
          </div>
          
          <h2 className={styles.title}>
            {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
          </h2>
          <p className={styles.subtitle}>
            {mode === 'signin' 
              ? 'Sign in to your construction management dashboard'
              : 'Create your account to start managing projects with AI'
            }
          </p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {mode === 'signup' && (
            <>
              <Input
                label="Full Name"
                name="fullName"
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                icon={<User size={16} />}
                required
              />

              <div>
                <label className={styles.label}>Role</label>
                <div className={styles.roleSelector}>
                  {roles.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      className={`${styles.roleOption} ${
                        formData.role === role.value ? styles.selected : ''
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, role: role.value }))}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            icon={<Mail size={16} />}
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            icon={<Lock size={16} />}
            required
          />

          <Button
            type="submit"
            variant="accent"
            size="large"
            loading={loading}
            fullWidth
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className={styles.toggleLink}>
          <span className={styles.toggleText}>
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <a
            href={mode === 'signin' ? '/auth/signup' : '/auth/signin'}
            className={styles.toggleButton}
          >
            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
          </a>
        </div>
      </div>
    </div>
  )
}

export default AuthForm