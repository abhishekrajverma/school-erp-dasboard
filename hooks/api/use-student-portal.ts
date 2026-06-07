'use client'

import { useQuery } from '@tanstack/react-query'
import { studentPortalApi } from '@/lib/api/student-portal'
import { queryKeys } from '@/hooks/api/query-keys'
import { useAuthQueryEnabled } from './use-auth-query'

export function useStudentProfile() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.studentPortal.me(),
    queryFn: () => studentPortalApi.me(),
    enabled,
  })
}

export function useStudentPortalFees() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.studentPortal.fees(),
    queryFn: () => studentPortalApi.fees(),
    enabled,
  })
}

export function useStudentPortalAttendance() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.studentPortal.attendance(),
    queryFn: () => studentPortalApi.attendance(),
    enabled,
  })
}

export function useStudentPortalExams() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.studentPortal.exams(),
    queryFn: () => studentPortalApi.exams(),
    enabled,
  })
}

export function useStudentPortalTimetable() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.studentPortal.timetable(),
    queryFn: () => studentPortalApi.timetable(),
    enabled,
  })
}

export function useStudentPortalLibraryIssues() {
  const enabled = useAuthQueryEnabled()
  return useQuery({
    queryKey: queryKeys.studentPortal.libraryIssues(),
    queryFn: () => studentPortalApi.libraryIssues(),
    enabled,
  })
}
