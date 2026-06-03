import { TENANT_HEADER, TENANT_SLUG_HEADER } from '@/lib/tenant/constants'
import { loadTenantFromStorage } from '@/lib/tenant/storage'

export function applyTenantHeaders(headers: Headers): void {
  if (typeof window === 'undefined') return
  const tenant = loadTenantFromStorage()
  if (!tenant) return
  headers.set(TENANT_HEADER, tenant.id)
  headers.set(TENANT_SLUG_HEADER, tenant.slug)
}

export { TENANT_HEADER, TENANT_SLUG_HEADER }
