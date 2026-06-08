'use client'

import { useFinancialYear } from '@/components/providers/financial-year-provider'
import { currentFinancialYear } from '@/lib/financial-year'

/** Active FY for React Query keys and list filters */
export function useQueryFinancialYear(): string {
  try {
    const { activeFinancialYear } = useFinancialYear()
    return activeFinancialYear
  } catch {
    return currentFinancialYear()
  }
}
