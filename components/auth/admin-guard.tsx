'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getRoleHomePath } from '@/lib/auth/types'
import { useAuth } from '@/components/providers/auth-provider'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) {
      router.replace('/login')
      return
    }
    if (user.role !== 'admin') {
      router.replace(getRoleHomePath(user.role))
    }
  }, [isLoading, isAuthenticated, user, router])

  if (isLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
