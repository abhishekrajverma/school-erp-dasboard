import type { Tenant } from './types'
import { DEFAULT_DEMO_TENANT, TENANT_STORAGE_KEY } from './constants'

export function loadTenantFromStorage(): Tenant | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(TENANT_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Tenant
    if (!parsed?.id || !parsed?.slug) return null
    return parsed
  } catch {
    return null
  }
}

export function saveTenantToStorage(tenant: Tenant): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant))
}

export function clearTenantFromStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TENANT_STORAGE_KEY)
}

export function getInitialTenant(): Tenant {
  return loadTenantFromStorage() ?? { ...DEFAULT_DEMO_TENANT }
}
