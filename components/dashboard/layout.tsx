'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'
import { useIsMobile } from '@/hooks/use-mobile'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const isMobile = useIsMobile()

  // Auto-collapse sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }, [isMobile])

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() => setSidebarCollapsed((prev) => !prev)}
      />
      <motion.main
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="min-h-[calc(100vh-4rem)] overflow-x-hidden p-6"
      >
        {children}
      </motion.main>
    </div>
  )
}
