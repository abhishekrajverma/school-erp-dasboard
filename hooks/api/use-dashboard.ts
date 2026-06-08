'use client'

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/lib/api/dashboard'
import { queryKeys } from '@/hooks/api/query-keys'
import { useAuth } from '@/components/providers/auth-provider'
import { useQueryFinancialYear } from '@/hooks/use-query-financial-year'

export function useDashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const financialYear = useQueryFinancialYear()

  return useQuery({
    queryKey: [...queryKeys.dashboard.overview(), financialYear],
    queryFn: () => dashboardApi.get(),
    staleTime: 60 * 1000,
    enabled: !authLoading && isAuthenticated,
  })
}
