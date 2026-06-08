'use client'

import * as React from 'react'
import type { Tenant, TenantContextValue } from '@/lib/tenant/types'
import {
  clearTenantFromStorage,
  getInitialTenant,
  saveTenantToStorage,
} from '@/lib/tenant/storage'
import { useAuth } from '@/components/providers/auth-provider'
import { DEFAULT_DEMO_TENANT } from '@/lib/tenant/constants'

const TenantContext = React.createContext<TenantContextValue | null>(null)

async function syncTenantCookie(tenantId: string) {
  await fetch('/api/tenant', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ tenantId }),
  }).catch(() => undefined)
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [tenant, setTenantState] = React.useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const initial = getInitialTenant()
    setTenantState(initial)
    void syncTenantCookie(initial.id)
    setIsLoading(false)
  }, [])

  React.useEffect(() => {
    if (!user?.tenantId || user.role === 'company') return

    setTenantState((current) => {
      if (current?.id === user.tenantId) return current
      const next: Tenant = {
        id: user.tenantId!,
        slug: current?.slug ?? DEFAULT_DEMO_TENANT.slug,
        name: current?.name ?? DEFAULT_DEMO_TENANT.name,
      }
      saveTenantToStorage(next)
      void syncTenantCookie(next.id)
      return next
    })
  }, [user?.tenantId, user?.role])

  const setTenant = React.useCallback((next: Tenant) => {
    saveTenantToStorage(next)
    setTenantState(next)
    void syncTenantCookie(next.id)
  }, [])

  const clearTenant = React.useCallback(() => {
    clearTenantFromStorage()
    setTenantState(null)
  }, [])

  const value = React.useMemo<TenantContextValue>(
    () => ({
      tenant,
      tenantId: tenant?.id ?? null,
      isLoading,
      setTenant,
      clearTenant,
    }),
    [tenant, isLoading, setTenant, clearTenant],
  )

  return (
    <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
  )
}

export function useTenant(): TenantContextValue {
  const context = React.useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider')
  }
  return context
}
