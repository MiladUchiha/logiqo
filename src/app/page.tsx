'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'

export default function HomePage() {
  const router = useRouter()
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/signin')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[var(--color-text-secondary)]">Loading ConstructFlow...</p>
      </div>
    </div>
  )
}