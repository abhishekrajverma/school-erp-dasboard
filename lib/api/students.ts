import { api } from './client'
import { toQuery } from './query'
import { normalizeListResponse } from './unwrap'
import type { ListQueryParams } from './types/common'
import type { CreateStudentRequest, StudentDto, UpdateStudentRequest } from './types/students'

export const studentsApi = {
  list: async (params?: ListQueryParams) => {
    const data = await api(`/students${toQuery(params)}`)
    return normalizeListResponse<StudentDto>(data, params)
  },

  getById: (id: string) => api<StudentDto>(`/students/${id}`),

  create: (body: CreateStudentRequest) =>
    api<StudentDto>('/students', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: UpdateStudentRequest) =>
    api<StudentDto>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (id: string) => api<void>(`/students/${id}`, { method: 'DELETE' }),
}
