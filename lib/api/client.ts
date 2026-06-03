import { env } from '@/lib/config/env'
import { handleUnauthorized } from './interceptors/auth'
import {
  CORRELATION_HEADER,
  getOrCreateCorrelationId,
} from './interceptors/correlation'
import { ApiError, parseApiError } from './interceptors/errors'
import { applyTenantHeaders } from './interceptors/tenant'
import { reportError } from '@/lib/observability/report-error'

export { ApiError } from './interceptors/errors'

/** Browser calls Next.js BFF; server routes forward to ASP.NET Core */
export const BFF_BASE = '/api/proxy'

export type ApiRequestOptions = RequestInit & {
  /** Skip silent refresh on 401 (e.g. login) */
  skipAuthRetry?: boolean
  /** Skip JSON Content-Type (file uploads) */
  rawBody?: boolean
  correlationId?: string
}

function buildUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BFF_BASE}${normalized}`
}

export async function api<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { skipAuthRetry = false, rawBody = false, correlationId, ...init } = options

  const headers = new Headers(init.headers)
  if (!rawBody && !headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set(CORRELATION_HEADER, getOrCreateCorrelationId(correlationId))
  applyTenantHeaders(headers)

  const execute = async (): Promise<Response> =>
    fetch(buildUrl(path), {
      ...init,
      headers,
      credentials: 'include',
    })

  let response = await execute()

  if (response.status === 401 && !skipAuthRetry) {
    const recovered = await handleUnauthorized()
    if (recovered) {
      response = await execute()
    }
  }

  if (!response.ok) {
    const error = await parseApiError(response)
    reportError(error, {
      correlationId: headers.get(CORRELATION_HEADER) ?? undefined,
      route: path,
    })
    throw error
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  return response.text() as Promise<T>
}

/** Direct server-to-server call from Route Handlers to ASP.NET Core */
export async function serverApi<T>(
  path: string,
  options: RequestInit & {
    accessToken?: string
    tenantId?: string
    correlationId?: string
  } = {},
): Promise<T> {
  const { accessToken, tenantId, correlationId, ...init } = options
  const normalized = path.startsWith('/') ? path : `/${path}`
  const url = `${env.serverApiUrl}${normalized}`

  const headers = new Headers(init.headers)
  headers.set(CORRELATION_HEADER, getOrCreateCorrelationId(correlationId))
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)
  if (tenantId) headers.set('X-Tenant-Id', tenantId)

  const response = await fetch(url, { ...init, headers })

  if (!response.ok) {
    throw await parseApiError(response)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
