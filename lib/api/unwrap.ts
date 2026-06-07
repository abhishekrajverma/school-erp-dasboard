import type { PaginatedResponse } from './types/common'

type ListEnvelope<T> = {
  items?: T[]
  /** ASP.NET / OData-style list wrapper */
  value?: T[]
  data?: T[]
  results?: T[]
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
  Count?: number
}

/** Backend list endpoints may return several envelope shapes or a plain array. */
export function unwrapItems<T>(
  data: T[] | ListEnvelope<T> | PaginatedResponse<T> | null | undefined,
): T[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  const envelope = data as ListEnvelope<T>
  return envelope.items ?? envelope.value ?? envelope.data ?? envelope.results ?? []
}

/** Normalize any list API payload into the paginated shape the UI expects. */
export function normalizeListResponse<T>(
  data: T[] | ListEnvelope<T> | PaginatedResponse<T> | null | undefined,
  params?: { page?: number; pageSize?: number },
): PaginatedResponse<T> {
  const items = unwrapItems(data)
  const envelope = (Array.isArray(data) ? {} : data ?? {}) as ListEnvelope<T>
  const totalCount = envelope.totalCount ?? envelope.Count ?? items.length
  const pageSize = envelope.pageSize ?? params?.pageSize ?? (items.length || 1)
  const page = envelope.page ?? params?.page ?? 1
  const totalPages =
    envelope.totalPages ?? Math.max(1, Math.ceil(totalCount / pageSize))

  return { items, page, pageSize, totalCount, totalPages }
}
