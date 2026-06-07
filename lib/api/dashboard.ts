import { api } from './client'
import type { DashboardDto } from './types/dashboard'

export const dashboardApi = {
  get: () => api<DashboardDto>('/dashboard'),
}
