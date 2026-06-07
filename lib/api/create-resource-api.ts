import { api } from './client'
import { toQuery } from './query'
import { normalizeListResponse } from './unwrap'
import type { ListQueryParams, PaginatedResponse } from './types/common'

export function createResourceApi<T, Create = Partial<T>, Update = Partial<T>>(
  basePath: string,
) {
  const path = basePath.startsWith('/') ? basePath : `/${basePath}`

  return {
    list: async (params?: ListQueryParams) => {
      const data = await api<
        PaginatedResponse<T> | T[] | { value?: T[]; Count?: number }
      >(`${path}${toQuery(params)}`)
      return normalizeListResponse(data, params)
    },

    getById: (id: string) => api<T>(`${path}/${id}`),

    create: (body: Create) =>
      api<T>(path, { method: 'POST', body: JSON.stringify(body) }),

    update: (id: string, body: Update) =>
      api<T>(`${path}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

    delete: (id: string) => api<void>(`${path}/${id}`, { method: 'DELETE' }),
  }
}
