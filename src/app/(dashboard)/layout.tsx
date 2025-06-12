'use client'

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/Navbar/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}