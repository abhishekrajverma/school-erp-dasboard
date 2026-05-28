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
import { dashboardStats } from '@/lib/data'

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
      {/* Decorative gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  )
}

export function StatsCards() {
  const stats = [
    {
      title: 'Total Students',
      value: dashboardStats.totalStudents,
      change: '+12% from last month',
      changeType: 'positive' as const,
      icon: GraduationCap,
    },
    {
      title: 'Total Teachers',
      value: dashboardStats.totalTeachers,
      change: '+3 new hires',
      changeType: 'positive' as const,
      icon: Users,
    },
    {
      title: 'Pending Fees',
      value: dashboardStats.pendingFees,
      change: '-8% from last month',
      changeType: 'positive' as const,
      icon: CreditCard,
      prefix: '₹',
    },
    {
      title: 'Monthly Revenue',
      value: dashboardStats.monthlyRevenue,
      change: '+15% from last month',
      changeType: 'positive' as const,
      icon: TrendingUp,
      prefix: '₹',
    },
    {
      title: 'Attendance Rate',
      value: dashboardStats.attendancePercentage,
      change: '+2.3% from last week',
      changeType: 'positive' as const,
      icon: Calendar,
      suffix: '%',
    },
    {
      title: 'Salary Paid',
      value: dashboardStats.salaryPaid,
      change: 'On schedule',
      changeType: 'neutral' as const,
      icon: Wallet,
      prefix: '₹',
    },
    {
      title: 'Active Routes',
      value: dashboardStats.transportRoutes,
      change: '2 under maintenance',
      changeType: 'neutral' as const,
      icon: Bus,
    },
    {
      title: 'New Admissions',
      value: dashboardStats.newAdmissions,
      change: '+24% from last month',
      changeType: 'positive' as const,
      icon: UserPlus,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  )
}
