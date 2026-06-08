import {
  currentFinancialYear,
  defaultFinancialYearsList,
  formatFinancialYearsList,
  normalizeFinancialYear,
} from './format'
import { FINANCIAL_YEAR_CONFIG_PREFIX } from './constants'

export type FinancialYearConfig = {
  /** Comma-separated list of allowed years, e.g. 2023-24,2024-25,2025-26 */
  financialYearsList: string
  defaultFinancialYear: string
  /** When true, FY selector is hidden in the dashboard header */
  hideFinancialYearUi: boolean
}

export const DEFAULT_FINANCIAL_YEAR_CONFIG: FinancialYearConfig = {
  financialYearsList: formatFinancialYearsList(defaultFinancialYearsList()),
  defaultFinancialYear: currentFinancialYear(),
  hideFinancialYearUi: false,
}

function configKey(tenantId: string): string {
  return `${FINANCIAL_YEAR_CONFIG_PREFIX}:${tenantId}`
}

export function loadFinancialYearConfig(tenantId: string): FinancialYearConfig {
  if (typeof window === 'undefined') return { ...DEFAULT_FINANCIAL_YEAR_CONFIG }

  try {
    const raw = localStorage.getItem(configKey(tenantId))
    if (!raw) return { ...DEFAULT_FINANCIAL_YEAR_CONFIG }
    const parsed = { ...DEFAULT_FINANCIAL_YEAR_CONFIG, ...(JSON.parse(raw) as Partial<FinancialYearConfig>) }
    return {
      ...parsed,
      defaultFinancialYear: normalizeFinancialYear(
        parsed.defaultFinancialYear || DEFAULT_FINANCIAL_YEAR_CONFIG.defaultFinancialYear,
      ),
    }
  } catch {
    return { ...DEFAULT_FINANCIAL_YEAR_CONFIG }
  }
}

export function saveFinancialYearConfig(tenantId: string, config: FinancialYearConfig): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(configKey(tenantId), JSON.stringify(config))
}
