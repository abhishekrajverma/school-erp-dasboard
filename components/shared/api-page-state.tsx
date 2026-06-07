'use client'

import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

export function ApiPageLoading({ rows = 4 }: { rows?: number }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    </DashboardLayout>
  )
}

export function ApiPageError({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">{message}</p>
        {onRetry ? <Button onClick={onRetry}>Retry</Button> : null}
      </div>
    </DashboardLayout>
  )
}
