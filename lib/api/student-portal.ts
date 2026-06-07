import { api } from './client'
import { unwrapItems } from './unwrap'
import type {
  AttendanceRecordDto,
  BookIssueDto,
  ExamDto,
  FeeRecordDto,
  TimetableEntryDto,
} from './types/portals'
import type { StudentDto } from './types/students'
import type { PaginatedResponse } from './types/common'

export const studentPortalApi = {
  me: () => api<StudentDto>('/students/me'),

  fees: async (): Promise<FeeRecordDto[]> => {
    const data = await api<FeeRecordDto[] | PaginatedResponse<FeeRecordDto>>(
      '/students/me/fees',
    )
    return unwrapItems(data)
  },

  attendance: async (): Promise<AttendanceRecordDto[]> => {
    const data = await api<AttendanceRecordDto[] | PaginatedResponse<AttendanceRecordDto>>(
      '/students/me/attendance',
    )
    return unwrapItems(data)
  },

  exams: async (): Promise<ExamDto[]> => {
    const data = await api<ExamDto[] | PaginatedResponse<ExamDto>>('/students/me/exams')
    return unwrapItems(data)
  },

  timetable: async (): Promise<TimetableEntryDto[]> => {
    const data = await api<TimetableEntryDto[] | PaginatedResponse<TimetableEntryDto>>(
      '/students/me/timetable',
    )
    return unwrapItems(data)
  },

  libraryIssues: async (): Promise<BookIssueDto[]> => {
    const data = await api<BookIssueDto[] | PaginatedResponse<BookIssueDto>>(
      '/students/me/library/issues',
    )
    return unwrapItems(data)
  },
}
