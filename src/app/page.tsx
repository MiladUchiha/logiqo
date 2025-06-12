'use client'
import React from 'react'
import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import AICapabilities from '@/components/AICapabilities/AICapabilities'
import SystemTools from '@/components/SystemTools/SystemTools'
import InterfaceShowcase from '@/components/InterfaceShowcase/InterfaceShowcase'
import { Awards } from '@/components/Awards/Awards'



const page = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <AICapabilities />
      <InterfaceShowcase />
      <SystemTools />
      <Awards />
    </div>
  )
}

export default page