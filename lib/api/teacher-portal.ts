import { api } from './client'
import { toQueryRecord } from './query'
import { unwrapItems } from './unwrap'
import type {
  CreateLeaveRequestBody,
  LeaveRequestDto,
  PayrollRecordDto,
  TeacherDto,
  TimetableEntryDto,
} from './types/portals'
import type { PaginatedResponse } from './types/common'

export const teacherPortalApi = {
  me: () => api<TeacherDto>('/teachers/me'),

  leaves: async (): Promise<LeaveRequestDto[]> => {
    const data = await api<LeaveRequestDto[] | PaginatedResponse<LeaveRequestDto>>(
      '/teachers/me/leaves',
    )
    return unwrapItems(data)
  },

  applyLeave: (body: CreateLeaveRequestBody) =>
    api<LeaveRequestDto>('/leave-requests', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  payroll: async (): Promise<PayrollRecordDto[]> => {
    const data = await api<PayrollRecordDto[] | PaginatedResponse<PayrollRecordDto>>(
      '/teachers/me/payroll',
    )
    return unwrapItems(data)
  },

  timetable: async (params?: { day?: string }): Promise<TimetableEntryDto[]> => {
    const data = await api<TimetableEntryDto[] | PaginatedResponse<TimetableEntryDto>>(
      `/teachers/me/timetable${toQueryRecord(params)}`,
    )
    return unwrapItems(data)
  },
}
