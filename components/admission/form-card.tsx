'use client'

import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FormCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function FormCard({
  title,
  description,
  children,
  className,
  icon,
}: FormCardProps) {
  return (
    <Card className={cn('border-border/80 shadow-sm', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
          <div className="space-y-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription className="text-sm">{description}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

interface FormGridProps {
  children: React.ReactNode
  className?: string
}

export function FormGrid({ children, className }: FormGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>{children}</div>
  )
}
