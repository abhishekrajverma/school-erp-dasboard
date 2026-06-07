'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { teacherPortalApi } from '@/lib/api/teacher-portal'
import { queryKeys } from '@/hooks/api/query-keys'
import type { CreateLeaveRequestBody } from '@/lib/api/types/portals'
import { useAuthQueryEnabled } from './use-auth-query'

export function useTeacherProfile() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.teacherPortal.me(),
    queryFn: () => teacherPortalApi.me(),
    enabled,
  })
}

export function useTeacherPortalLeaves() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.teacherPortal.leaves(),
    queryFn: () => teacherPortalApi.leaves(),
    enabled,
  })
}

export function useTeacherPortalPayroll() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.teacherPortal.payroll(),
    queryFn: () => teacherPortalApi.payroll(),
    enabled,
  })
}

export function useTeacherPortalTimetable(params?: { day?: string }) {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.teacherPortal.timetable(params),
    queryFn: () => teacherPortalApi.timetable(params),
    enabled,
  })
}

export function useApplyTeacherLeave() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateLeaveRequestBody) => teacherPortalApi.applyLeave(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.teacherPortal.leaves() })
      queryClient.invalidateQueries({ queryKey: queryKeys.leave.all })
    },
  })
}
