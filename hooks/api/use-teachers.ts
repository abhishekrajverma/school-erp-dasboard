'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teachersApi } from '@/lib/api/teachers'
import { queryKeys } from '@/hooks/api/query-keys'
import type { CreateTeacherRequest, UpdateTeacherRequest } from '@/lib/api/types/teachers'
import type { ListQueryParams } from '@/lib/api/types/common'
import { useAuthQueryEnabled } from './use-auth-query'
import { useQueryFinancialYear } from '@/hooks/use-query-financial-year'

export function useTeachers(params?: ListQueryParams) {
  const enabled = useAuthQueryEnabled()
  const financialYear = useQueryFinancialYear()

  return useQuery({
    queryKey: queryKeys.teachers.list({ ...(params ?? {}), financialYear }),
    queryFn: () => teachersApi.list(params),
    enabled,
  })
}

export function useTeacher(id: string) {
  return useQuery({
    queryKey: queryKeys.teachers.detail(id),
    queryFn: () => teachersApi.getById(id),
    enabled: Boolean(id),
  })
}

export function useCreateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateTeacherRequest) => teachersApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.all })
    },
  })
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateTeacherRequest }) =>
      teachersApi.update(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.teachers.lists() })
    },
  })
}
