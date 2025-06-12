'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import Hero from '@/components/Hero/Hero'
import SystemTools from '@/components/SystemTools/SystemTools'
import AICapabilities from '@/components/AICapabilities/AICapabilities'
import InterfaceShowcase from '@/components/InterfaceShowcase/InterfaceShowcase'
import Awards from '@/components/Awards/Awards'
import MarketingNavbar from '@/components/MarketingNavbar/MarketingNavbar'

export default function HomePage() {
  const router = useRouter()
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--color-text-secondary)]">Loading ConstructFlow...</p>
        </div>
      </div>
    )
  }

  // Show marketing site for non-authenticated users
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <MarketingNavbar />
      <Hero />
      <SystemTools />
      <AICapabilities />
      <InterfaceShowcase />
      <Awards />
    </div>
  )
}