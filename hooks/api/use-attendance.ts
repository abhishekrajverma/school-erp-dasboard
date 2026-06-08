'use client'

import { useQuery } from '@tanstack/react-query'
import { attendanceApi } from '@/lib/api/attendance'
import { queryKeys } from '@/hooks/api/query-keys'
import type { ListQueryParams } from '@/lib/api/types/common'

import { useAuthQueryEnabled } from './use-auth-query'
import { useQueryFinancialYear } from '@/hooks/use-query-financial-year'

export function useAttendance(params?: ListQueryParams) {
  const enabled = useAuthQueryEnabled()
  const financialYear = useQueryFinancialYear()
  return useQuery({
    queryKey: queryKeys.attendance.list({ ...(params ?? {}), financialYear }),
    queryFn: () => attendanceApi.list(params),
    enabled,
  })
}
