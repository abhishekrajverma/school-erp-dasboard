'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { parentPortalApi } from '@/lib/api/parent-portal'
import { feesApi } from '@/lib/api/fees'
import { queryKeys } from '@/hooks/api/query-keys'
import type { RecordFeePaymentRequest } from '@/lib/api/types/portals'
import { useAuthQueryEnabled } from './use-auth-query'

export function useParentProfile() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.parentPortal.me(),
    queryFn: () => parentPortalApi.me(),
    enabled,
  })
}

export function useParentChildren() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.parentPortal.children(),
    queryFn: () => parentPortalApi.children(),
    enabled,
  })
}

export function useParentChildFees(childId: string) {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.parentPortal.childFees(childId),
    queryFn: () => parentPortalApi.childFees(childId),
    enabled: enabled && Boolean(childId),
  })
}

export function useParentChildAttendance(
  childId: string,
  params?: { from?: string; to?: string },
) {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.parentPortal.childAttendance(childId, params),
    queryFn: () => parentPortalApi.childAttendance(childId, params),
    enabled: enabled && Boolean(childId),
  })
}

export function useParentChildTransport(childId: string) {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.parentPortal.childTransport(childId),
    queryFn: () => parentPortalApi.childTransport(childId),
    enabled: enabled && Boolean(childId),
  })
}

export function useRecordFeePayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ feeId, body }: { feeId: string; body: RecordFeePaymentRequest }) =>
      feesApi.recordPayment(feeId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.parentPortal.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.studentPortal.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.fees.all })
    },
  })
}
