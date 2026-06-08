import { TENANT_HEADER, TENANT_SLUG_HEADER } from '@/lib/tenant/constants'
import { loadTenantFromStorage } from '@/lib/tenant/storage'
import type { ProxyHeaderScope } from '@/lib/api/proxy-policy'

export function applyTenantHeaders(headers: Headers, scope: ProxyHeaderScope = 'school'): void {
  if (scope !== 'school' || typeof window === 'undefined') return
  const tenant = loadTenantFromStorage()
  if (!tenant) return
  headers.set(TENANT_HEADER, tenant.id)
  headers.set(TENANT_SLUG_HEADER, tenant.slug)
}

export { TENANT_HEADER, TENANT_SLUG_HEADER }
