'use client'

import { useQuery } from '@tanstack/react-query'
import { feesApi } from '@/lib/api/fees'
import { queryKeys } from '@/hooks/api/query-keys'
import type { ListQueryParams } from '@/lib/api/types/common'

import { useAuthQueryEnabled } from './use-auth-query'

export function useFees(params?: ListQueryParams) {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.fees.list(params),
    queryFn: () => feesApi.list(params),
    enabled,
  })
}
