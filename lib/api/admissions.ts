import { api } from './client'
import { toQuery } from './query'
import type { ListQueryParams, PaginatedResponse } from './types/common'
import type {
  AdmissionDto,
  CreateAdmissionRequest,
  UpdateAdmissionRequest,
} from './types/admissions'

export const admissionsApi = {
  list: (params?: ListQueryParams & { status?: string }) =>
    api<PaginatedResponse<AdmissionDto>>(`/admissions${toQuery(params)}`),

  getById: (id: string) => api<AdmissionDto>(`/admissions/${id}`),

  create: (body: CreateAdmissionRequest) =>
    api<AdmissionDto>('/admissions', { method: 'POST', body: JSON.stringify(body) }),

  update: (id: string, body: UpdateAdmissionRequest) =>
    api<AdmissionDto>(`/admissions/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  submit: (id: string) =>
    api<AdmissionDto>(`/admissions/${id}/submit`, { method: 'POST' }),

  updateStatus: (id: string, status: string) =>
    api<AdmissionDto>(`/admissions/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  uploadDocument: (id: string, formData: FormData) =>
    api<AdmissionDto>(`/admissions/${id}/documents`, {
      method: 'POST',
      body: formData,
      rawBody: true,
    }),
}
