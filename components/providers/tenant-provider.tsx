'use client'

import * as React from 'react'
import type { Tenant, TenantContextValue } from '@/lib/tenant/types'
import {
  clearTenantFromStorage,
  getInitialTenant,
  saveTenantToStorage,
} from '@/lib/tenant/storage'

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
  const [tenant, setTenantState] = React.useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const initial = getInitialTenant()
    setTenantState(initial)
    void syncTenantCookie(initial.id)
    setIsLoading(false)
  }, [])

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
