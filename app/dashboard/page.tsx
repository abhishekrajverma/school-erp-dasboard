'use client'

import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/layout'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { ChartsSection } from '@/components/dashboard/charts'
import { WidgetsSection } from '@/components/dashboard/widgets'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useTenant } from '@/components/providers/tenant-provider'
import { ApiErrorState } from '@/components/shared/api-page-state'
import { useDashboard } from '@/hooks/api/use-dashboard'

export default function DashboardPage() {
  const { tenant } = useTenant()
  const schoolName = tenant?.name ?? 'Your School'
  const { data, isLoading, isError, error, refetch, isFetching } = useDashboard()

  return (
    <DashboardLayout>
      {isError ? (
        <ApiErrorState
          error={error}
          resourceName="dashboard"
          onRetry={() => refetch()}
          isRetrying={isFetching}
        />
      ) : (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
              <Badge variant="outline" className="text-xs">
                {isLoading && !data ? 'Loading…' : 'Live'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening at {schoolName} today.
            </p>
          </motion.div>

          <section>
            {isLoading && !data ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 rounded-xl" />
                ))}
              </div>
            ) : (
              <StatsCards />
            )}
          </section>

          <section>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 text-lg font-semibold"
            >
              Analytics & Reports
            </motion.h2>
            <ChartsSection />
          </section>

          <section>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-lg font-semibold"
            >
              Quick Overview
            </motion.h2>
            <WidgetsSection />
          </section>
        </div>
      )}
    </DashboardLayout>
  )
}
