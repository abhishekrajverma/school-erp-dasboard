import { normalizeFinancialYear, currentFinancialYear } from './format'
import { FINANCIAL_YEAR_STORAGE_PREFIX, FINANCIAL_YEAR_UPDATED_EVENT } from './constants'

function activeKey(tenantId: string): string {
  return `${FINANCIAL_YEAR_STORAGE_PREFIX}:${tenantId}`
}

export function loadActiveFinancialYear(tenantId: string, fallback?: string): string {
  if (typeof window === 'undefined') {
    return normalizeFinancialYear(fallback ?? currentFinancialYear())
  }

  try {
    const raw = localStorage.getItem(activeKey(tenantId))
    if (!raw) return normalizeFinancialYear(fallback ?? currentFinancialYear())
    return normalizeFinancialYear(raw)
  } catch {
    return normalizeFinancialYear(fallback ?? currentFinancialYear())
  }
}

export function saveActiveFinancialYear(tenantId: string, financialYear: string): void {
  if (typeof window === 'undefined') return
  const normalized = normalizeFinancialYear(financialYear)
  localStorage.setItem(activeKey(tenantId), normalized)
  window.dispatchEvent(new CustomEvent(FINANCIAL_YEAR_UPDATED_EVENT))
}
