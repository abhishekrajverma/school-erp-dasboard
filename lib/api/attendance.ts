import { createResourceApi } from './create-resource-api'
import type { AttendanceRecordDto, MarkAttendanceRequest } from './types/attendance'
import { api } from './client'

const base = createResourceApi<AttendanceRecordDto>('/attendance')

export const attendanceApi = {
  ...base,
  mark: (body: MarkAttendanceRequest) =>
    api<AttendanceRecordDto>('/attendance', { method: 'POST', body: JSON.stringify(body) }),
}
