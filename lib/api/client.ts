import { env } from '@/lib/config/env'
import { handleUnauthorized } from './interceptors/auth'
import {
  CORRELATION_HEADER,
  getOrCreateCorrelationId,
} from './interceptors/correlation'
import { ApiError, createNetworkError, parseApiError } from './interceptors/errors'
import { applyTenantHeaders } from './interceptors/tenant'
import { applyFinancialYearHeaders } from './interceptors/financial-year'
import { resolveProxyHeaderScope, type ProxyHeaderScope } from '@/lib/api/proxy-policy'
import { reportError, shouldReportError } from '@/lib/observability/report-error'

export { ApiError } from './interceptors/errors'

/** Browser calls Next.js BFF; server routes forward to ASP.NET Core */
export const BFF_BASE = '/api/proxy'

export type ApiRequestOptions = RequestInit & {
  /** Skip silent refresh on 401 (e.g. login) */
  skipAuthRetry?: boolean
  /** Skip JSON Content-Type (file uploads) */
  rawBody?: boolean
  correlationId?: string
  /** Header scope for tenant / financial-year forwarding */
  scope?: ProxyHeaderScope
}

function buildUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${BFF_BASE}${normalized}`
}

export async function api<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const {
    skipAuthRetry = false,
    rawBody = false,
    correlationId,
    scope,
    ...init
  } = options

  const headerScope =
    scope ?? resolveProxyHeaderScope(path.replace(/^\/+/, ''), init.method ?? 'GET')

  const headers = new Headers(init.headers)
  if (!rawBody && !headers.has('Content-Type') && init.body) {
    headers.set('Content-Type', 'application/json')
  }
  headers.set(CORRELATION_HEADER, getOrCreateCorrelationId(correlationId))
  applyTenantHeaders(headers, headerScope)
  applyFinancialYearHeaders(headers, headerScope)

  const execute = async (): Promise<Response> => {
    try {
      return await fetch(buildUrl(path), {
        ...init,
        headers,
        credentials: 'include',
      })
    } catch (err) {
      throw createNetworkError(err)
    }
  }

  let response = await execute()

  if (response.status === 401 && !skipAuthRetry) {
    const recovered = await handleUnauthorized()
    if (recovered) {
      response = await execute()
    }
  }

  if (!response.ok) {
    const error = await parseApiError(response)
    if (shouldReportError(error)) {
      reportError(error, {
        correlationId: headers.get(CORRELATION_HEADER) ?? undefined,
        route: path,
      })
    }
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

  let response: Response
  try {
    response = await fetch(url, { ...init, headers })
  } catch (err) {
    throw createNetworkError(err)
  }

  if (!response.ok) {
    throw await parseApiError(response)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
