'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/layout'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ChartsSection } from '@/components/dashboard/charts'
import { WidgetsSection } from '@/components/dashboard/widgets'
import { Badge } from '@/components/ui/badge'
import { useTenant } from '@/components/providers/tenant-provider'

export default function DashboardPage() {
  const { tenant } = useTenant()
  const schoolName = tenant?.name ?? 'Your School'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here&apos;s what&apos;s happening at {schoolName} today.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <section>
          <StatsCards />
        </section>

        {/* Charts Section */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-semibold mb-4"
          >
            Analytics & Reports
          </motion.h2>
          <ChartsSection />
        </section>

        {/* Widgets Section */}
        <section>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-semibold mb-4"
          >
            Quick Overview
          </motion.h2>
          <WidgetsSection />
        </section>
      </div>
    </DashboardLayout>
  )
}
