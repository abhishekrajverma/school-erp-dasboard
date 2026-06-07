import { api } from './client'
import { toQueryRecord } from './query'
import { unwrapItems } from './unwrap'
import type {
  AttendanceRecordDto,
  FeeRecordDto,
  ParentChildDto,
  ParentDto,
  ParentTransportDto,
} from './types/portals'
import type { PaginatedResponse } from './types/common'

export const parentPortalApi = {
  me: () => api<ParentDto>('/parents/me'),

  children: async (): Promise<ParentChildDto[]> => {
    const data = await api<ParentChildDto[] | PaginatedResponse<ParentChildDto>>(
      '/parents/me/children',
    )
    return unwrapItems(data)
  },

  childFees: async (childId: string): Promise<FeeRecordDto[]> => {
    const data = await api<FeeRecordDto[] | PaginatedResponse<FeeRecordDto>>(
      `/parents/me/children/${childId}/fees`,
    )
    return unwrapItems(data)
  },

  childAttendance: async (
    childId: string,
    params?: { from?: string; to?: string },
  ): Promise<AttendanceRecordDto[]> => {
    const data = await api<AttendanceRecordDto[] | PaginatedResponse<AttendanceRecordDto>>(
      `/parents/me/children/${childId}/attendance${toQueryRecord(params)}`,
    )
    return unwrapItems(data)
  },

  childTransport: (childId: string) =>
    api<ParentTransportDto | null>(`/parents/me/children/${childId}/transport`),
}
