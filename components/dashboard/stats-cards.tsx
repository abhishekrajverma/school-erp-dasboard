'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  GraduationCap,
  CreditCard,
  TrendingUp,
  Calendar,
  Wallet,
  Bus,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useDashboard } from '@/hooks/api/use-dashboard'
import { Skeleton } from '@/components/ui/skeleton'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  index: number
  prefix?: string
  suffix?: string
}

function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  index,
  prefix = '',
  suffix = '',
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold tracking-tight">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              {changeType === 'positive' ? (
                <ArrowUpRight className="h-3 w-3 text-green-500" />
              ) : changeType === 'negative' ? (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              ) : null}
              <span
                className={cn(
                  'text-xs font-medium',
                  changeType === 'positive' && 'text-green-500',
                  changeType === 'negative' && 'text-red-500',
                  changeType === 'neutral' && 'text-muted-foreground'
                )}
              >
                {change}
              </span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  )
}

function StatCardSkeleton({ index }: { index: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Skeleton className="h-4 w-24 mb-3" style={{ animationDelay: `${index * 50}ms` }} />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function StatsCards() {
  const { data, isLoading } = useDashboard()
  const stats = data?.stats ?? {
    totalStudents: 0,
    totalTeachers: 0,
    pendingFees: 0,
    monthlyRevenue: 0,
    attendancePercentage: 0,
    salaryPaid: 0,
    transportRoutes: 0,
    newAdmissions: 0,
  }

  if (isLoading && !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <StatCardSkeleton key={i} index={i} />
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      change: 'Live from EduSync',
      changeType: 'neutral' as const,
      icon: GraduationCap,
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      change: 'Live from EduSync',
      changeType: 'neutral' as const,
      icon: Users,
    },
    {
      title: 'Pending Fees',
      value: stats.pendingFees,
      change: data?.feeSummary
        ? `${data.feeSummary.collectionRate}% collection rate`
        : undefined,
      changeType: 'neutral' as const,
      icon: CreditCard,
      prefix: '₹',
    },
    {
      title: 'Monthly Revenue',
      value: stats.monthlyRevenue,
      change: data?.feeSummary
        ? `₹${data.feeSummary.thisMonth.collected.toLocaleString()} collected this month`
        : undefined,
      changeType: 'neutral' as const,
      icon: TrendingUp,
      prefix: '₹',
    },
    {
      title: 'Attendance Rate',
      value: stats.attendancePercentage || data?.attendanceSummary?.thisWeek?.avgAttendance || 0,
      change: data?.attendanceSummary
        ? `${data.attendanceSummary.thisWeek.improvement > 0 ? '+' : ''}${data.attendanceSummary.thisWeek.improvement}% vs last week`
        : undefined,
      changeType: 'positive' as const,
      icon: Calendar,
      suffix: '%',
    },
    {
      title: 'Salary Paid',
      value: stats.salaryPaid,
      change: 'On schedule',
      changeType: 'neutral' as const,
      icon: Wallet,
      prefix: '₹',
    },
    {
      title: 'Active Routes',
      value: stats.transportRoutes,
      change: 'Transport module',
      changeType: 'neutral' as const,
      icon: Bus,
    },
    {
      title: 'New Admissions',
      value: stats.newAdmissions,
      change: 'This session',
      changeType: 'neutral' as const,
      icon: UserPlus,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  )
}
