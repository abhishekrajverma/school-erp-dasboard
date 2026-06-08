'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentsApi } from '@/lib/api/students'
import { queryKeys } from '@/hooks/api/query-keys'
import type { CreateStudentRequest, UpdateStudentRequest } from '@/lib/api/types/students'
import type { ListQueryParams } from '@/lib/api/types/common'
import { useAuthQueryEnabled } from './use-auth-query'
import { useQueryFinancialYear } from '@/hooks/use-query-financial-year'

export function useStudents(params?: ListQueryParams) {
  const enabled = useAuthQueryEnabled()
  const financialYear = useQueryFinancialYear()

  return useQuery({
    queryKey: queryKeys.students.list({ ...(params ?? {}), financialYear }),
    queryFn: () => studentsApi.list(params),
    enabled,
  })
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: queryKeys.students.detail(id),
    queryFn: () => studentsApi.getById(id),
    enabled: Boolean(id),
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateStudentRequest) => studentsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateStudentRequest }) =>
      studentsApi.update(id, body),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.detail(id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.students.lists() })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => studentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.students.all })
    },
  })
}
