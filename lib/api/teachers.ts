import { api } from './client'
import { toQuery } from './query'
import type { ListQueryParams, PaginatedResponse } from './types/common'
import type { CreateTeacherRequest, TeacherDto, UpdateTeacherRequest } from './types/teachers'

export const teachersApi = {
  list: (params?: ListQueryParams) =>
    api<PaginatedResponse<TeacherDto>>(`/teachers${toQuery(params)}`),

  getById: (id: string) => api<TeacherDto>(`/teachers/${id}`),

  create: (body: CreateTeacherRequest) =>
    api<TeacherDto>('/teachers', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: UpdateTeacherRequest) =>
    api<TeacherDto>(`/teachers/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  delete: (id: string) => api<void>(`/teachers/${id}`, { method: 'DELETE' }),
}
