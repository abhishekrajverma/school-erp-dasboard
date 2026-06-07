'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { admissionsApi } from '@/lib/api/admissions'
import { queryKeys } from '@/hooks/api/query-keys'
import type { CreateAdmissionRequest, UpdateAdmissionRequest } from '@/lib/api/types/admissions'
import type { ListQueryParams } from '@/lib/api/types/common'

export function useAdmissions(params?: ListQueryParams) {
  return useQuery({
    queryKey: queryKeys.admissions.list(params),
    queryFn: () => admissionsApi.list(params),
  })
}

export function useCreateAdmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateAdmissionRequest) => admissionsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all })
    },
  })
}

export function useUpdateAdmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateAdmissionRequest }) =>
      admissionsApi.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all })
    },
  })
}

export function useSubmitAdmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => admissionsApi.submit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admissions.all })
    },
  })
}
