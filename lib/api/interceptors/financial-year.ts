import { FINANCIAL_YEAR_HEADER } from '@/lib/financial-year/constants'
import { loadActiveFinancialYear } from '@/lib/financial-year/storage'
import { loadTenantFromStorage } from '@/lib/tenant/storage'
import { DEFAULT_DEMO_TENANT } from '@/lib/tenant/constants'
import type { ProxyHeaderScope } from '@/lib/api/proxy-policy'

export function applyFinancialYearHeaders(
  headers: Headers,
  scope: ProxyHeaderScope = 'school',
): void {
  if (scope !== 'school' || typeof window === 'undefined') return
  const tenant = loadTenantFromStorage()
  const tenantId = tenant?.id ?? DEFAULT_DEMO_TENANT.id
  const financialYear = loadActiveFinancialYear(tenantId)
  if (financialYear) {
    headers.set(FINANCIAL_YEAR_HEADER, financialYear)
  }
}

export { FINANCIAL_YEAR_HEADER }
