'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  breadcrumbs?: { label: string; href?: string }[]
}

export function PageHeader({ title, description, children, breadcrumbs }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="space-y-1">
        {breadcrumbs && (
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="mx-1">/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-foreground">{crumb.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </motion.div>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  prefix?: string
  suffix?: string
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  prefix = '',
  suffix = '',
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold tracking-tight">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix}
          </p>
          {change && (
            <p
              className={cn(
                'text-xs font-medium',
                changeType === 'positive' && 'text-success',
                changeType === 'negative' && 'text-destructive',
                changeType === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

interface LoadingSkeletonProps {
  rows?: number
  columns?: number
}

export function LoadingSkeleton({ rows = 5, columns = 4 }: LoadingSkeletonProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="border-b border-border bg-muted/50 p-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-border">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4">
            {Array.from({ length: columns }).map((_, j) => (
              <div key={j} className="h-4 bg-muted rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[]
  activeTab: string
  onChange: (tab: string) => void
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200',
            activeTab === tab.id
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs rounded-full',
                activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-medium">{title}</h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({ label, error, required, children, className }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
