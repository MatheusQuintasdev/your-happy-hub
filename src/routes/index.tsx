import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/components/landing/Hero'
import Features from '@/components/landing/Features'
import Pricing from '@/components/landing/Pricing'
import DashboardPreview from '@/components/landing/DashboardPreview'
import Navbar from '@/components/landing/Navbar'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <DashboardPreview />
      <Features />
      <Pricing />
    </div>
  ),
})

