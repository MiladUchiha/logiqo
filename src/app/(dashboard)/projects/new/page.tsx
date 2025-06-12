'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Calendar, DollarSign, Users, ArrowLeft } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useProjectStore } from '@/store/projectStore'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Card from '@/components/ui/Card/Card'
import styles from './new-project.module.css'

export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { createProject } = useProjectStore()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    start_date: '',
    end_date: '',
    budget: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')

    try {
      const projectData = {
        name: formData.name,
        description: formData.description || null,
        status: formData.status,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        owner_id: user.id
      }

      const project = await createProject(projectData)
      router.push(`/projects/${project.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className={styles.newProject}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Button
            variant="secondary"
            icon={<ArrowLeft size={16} />}
            onClick={() => router.back()}
          >
            Back
          </Button>
          
          <div className={styles.headerInfo}>
            <h1 className={styles.title}>Create New Project</h1>
            <p className={styles.subtitle}>
              Set up a new construction project with AI-powered management
            </p>
          </div>
        </div>

        <div className={styles.content}>
          <Card variant="glass" padding="large">
            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <Building2 size={20} />
                    Project Details
                  </h3>
                  
                  <Input
                    label="Project Name"
                    name="name"
                    type="text"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                      name="description"
                      className={styles.textarea}
                      placeholder="Describe your construction project..."
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Status</label>
                    <select
                      name="status"
                      className={styles.select}
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="on_hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>
                    <Calendar size={20} />
                    Timeline & Budget
                  </h3>
                  
                  <Input
                    label="Start Date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="End Date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />

                  <Input
                    label="Budget"
                    name="budget"
                    type="number"
                    placeholder="0.00"
                    value={formData.budget}
                    onChange={handleInputChange}
                    icon={<DollarSign size={16} />}
                  />
                </div>
              </div>

              <div className={styles.formActions}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="accent"
                  loading={loading}
                  icon={<Building2 size={16} />}
                >
                  Create Project
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}