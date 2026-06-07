import type { ListQueryParams } from './types/common'

export function toQuery(params?: ListQueryParams): string {
  return toQueryRecord(params as Record<string, string | number | undefined> | undefined)
}

export function toQueryRecord(
  params?: Record<string, string | number | undefined>,
): string {
  if (!params) return ''
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') search.set(key, String(value))
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}
