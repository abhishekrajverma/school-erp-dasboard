import { isApiError } from '@/lib/api/interceptors/errors'

export type ErrorReportContext = {
  correlationId?: string
  tenantId?: string
  userId?: string
  route?: string
}

/** Hook for Sentry / Datadog — extend in production */
export function reportError(error: unknown, context?: ErrorReportContext): void {
  if (process.env.NODE_ENV === 'development') {
    const payload = {
      error: isApiError(error)
        ? { status: error.status, code: error.code, message: error.message }
        : error,
      context,
    }
    console.error('[reportError]', payload)
  }
  // TODO: Sentry.captureException(error, { extra: context })
}
