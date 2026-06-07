'use client'

import { useQuery } from '@tanstack/react-query'
import { attendanceApi } from '@/lib/api/attendance'
import { queryKeys } from '@/hooks/api/query-keys'
import type { ListQueryParams } from '@/lib/api/types/common'

import { useAuthQueryEnabled } from './use-auth-query'

export function useAttendance(params?: ListQueryParams) {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.attendance.list(params),
    queryFn: () => attendanceApi.list(params),
    enabled,
  })
}
