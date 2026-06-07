import { api } from './client'
import { toQueryRecord } from './query'
import { unwrapItems } from './unwrap'
import type { FeeRecordDto, RecordFeePaymentRequest } from './types/portals'
import type { PaginatedResponse } from './types/common'

export const feesApi = {
  list: (params?: { status?: string; studentId?: string; page?: number; pageSize?: number }) =>
    api<PaginatedResponse<FeeRecordDto>>(`/fees${toQueryRecord(params)}`),

  getById: (id: string) => api<FeeRecordDto>(`/fees/${id}`),

  create: (body: Partial<FeeRecordDto>) =>
    api<FeeRecordDto>('/fees', { method: 'POST', body: JSON.stringify(body) }),

  recordPayment: (id: string, body: RecordFeePaymentRequest) =>
    api<unknown>(`/fees/${id}/payments`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}

export const paymentsApi = {
  list: async (params?: { studentId?: string }) => {
    const data = await api<unknown[] | PaginatedResponse<unknown>>(
      `/payments${toQueryRecord(params)}`,
    )
    return unwrapItems(data)
  },
}
