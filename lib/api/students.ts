import { api } from './client'
import type { ListQueryParams, PaginatedResponse } from './types/common'
import type { CreateStudentRequest, StudentDto, UpdateStudentRequest } from './types/students'

function toQuery(params?: ListQueryParams): string {
  if (!params) return ''
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value))
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const studentsApi = {
  list: (params?: ListQueryParams) =>
    api<PaginatedResponse<StudentDto>>(`/students${toQuery(params)}`),

  getById: (id: string) => api<StudentDto>(`/students/${id}`),

  create: (body: CreateStudentRequest) =>
    api<StudentDto>('/students', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: UpdateStudentRequest) =>
    api<StudentDto>(`/students/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (id: string) => api<void>(`/students/${id}`, { method: 'DELETE' }),
}
