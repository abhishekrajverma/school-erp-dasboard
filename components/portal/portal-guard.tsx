'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { getRoleHomePath } from '@/lib/auth/types'
import type { UserRole } from '@/lib/portal-users'
import { useAuth } from '@/components/providers/auth-provider'

export function PortalGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[]
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useAuth()

  React.useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated || !user) {
      router.replace('/login')
      return
    }
    if (!allowedRoles.includes(user.role)) {
      router.replace(getRoleHomePath(user.role))
    }
  }, [allowedRoles, isLoading, isAuthenticated, user, router])

  if (isLoading || !user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
