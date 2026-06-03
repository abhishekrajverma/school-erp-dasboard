/** Shared API types — pagination, errors, etc. */

export type PaginatedResponse<T> = {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export type ApiErrorResponse = {
  code: string
  message: string
  errors?: Record<string, string[]>
}

export type ListQueryParams = {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
