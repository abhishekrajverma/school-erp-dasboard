import { getApiErrorStatus, isApiError } from '@/lib/api/interceptors/errors'

export type ErrorReportContext = {
  correlationId?: string
  tenantId?: string
  userId?: string
  route?: string
}

function isErrorLike(error: unknown): error is Error {
  return (
    error instanceof Error ||
    (typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Error).message === 'string')
  )
}

/** Normalize any thrown value into a log-safe plain object */
export function formatErrorForLog(error: unknown): Record<string, unknown> {
  if (isApiError(error)) {
    return {
      name: 'ApiError',
      status: error.status,
      code: error.code,
      message: error.message,
      details: error.details,
    }
  }

  if (isErrorLike(error)) {
    const e = error as Error & { status?: number; code?: string; details?: unknown }
    return {
      name: e.name || 'Error',
      message: e.message,
      ...(typeof e.status === 'number' ? { status: e.status } : {}),
      ...(typeof e.code === 'string' ? { code: e.code } : {}),
      ...(e.details !== undefined ? { details: e.details } : {}),
      ...(e.stack ? { stack: e.stack } : {}),
    }
  }

  if (error == null) {
    return { message: 'Unknown error (null or undefined)' }
  }

  if (typeof error === 'string') {
    return { message: error }
  }

  if (typeof error === 'object') {
    try {
      const serialized = JSON.parse(JSON.stringify(error))
      if (serialized && typeof serialized === 'object' && Object.keys(serialized).length > 0) {
        return serialized as Record<string, unknown>
      }
    } catch {
      // fall through
    }
    return { message: String(error) }
  }

  return { message: String(error) }
}

/** Skip noisy logs for expected auth/session failures and stale resource lookups */
export function shouldReportError(error: unknown): boolean {
  const status = getApiErrorStatus(error)
  if (status === 401 || status === 403 || status === 404) return false
  if (status === 0 || status === 503 || status === 502 || status === 504) return false
  return true
}

/** Hook for Sentry / Datadog — extend in production */
export function reportError(error: unknown, context?: ErrorReportContext): void {
  if (!shouldReportError(error)) return

  if (process.env.NODE_ENV === 'development') {
    const formatted = formatErrorForLog(error)
    const line = `[reportError] ${formatted.message ?? 'Request failed'}${context?.route ? ` (${context.route})` : ''}`
    console.error(line, { error: formatted, ...(context ? { context } : {}) })
  }
  // TODO: Sentry.captureException(error, { extra: context })
}
