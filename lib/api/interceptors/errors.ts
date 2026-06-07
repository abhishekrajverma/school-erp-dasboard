import type { ApiErrorResponse } from '../types/common'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/** Status codes when the backend is down or unreachable */
export const SERVER_UNAVAILABLE_STATUSES = [0, 502, 503, 504] as const

export const SERVER_UNAVAILABLE_MESSAGE =
  "We're unable to reach our servers right now. Please try again in a moment."

export const SERVER_UNAVAILABLE_TITLE = 'Connection interrupted'

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: ApiErrorResponse | undefined
  try {
    body = (await response.json()) as ApiErrorResponse
  } catch {
    body = undefined
  }

  const status = response.status
  const code = body?.code ?? `HTTP_${status}`
  let message = body?.message ?? response.statusText ?? 'Request failed'

  if (SERVER_UNAVAILABLE_STATUSES.includes(status as (typeof SERVER_UNAVAILABLE_STATUSES)[number])) {
    message = SERVER_UNAVAILABLE_MESSAGE
  }

  return new ApiError(status, code, message, body?.errors ?? body)
}

export function createNetworkError(cause?: unknown): ApiError {
  return new ApiError(
    0,
    'NETWORK_ERROR',
    SERVER_UNAVAILABLE_MESSAGE,
    cause,
  )
}

export function isApiError(error: unknown): error is ApiError {
  if (error instanceof ApiError) return true
  return (
    typeof error === 'object' &&
    error !== null &&
    (error as ApiError).name === 'ApiError' &&
    typeof (error as ApiError).status === 'number'
  )
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    const msg = error.message.toLowerCase()
    return msg.includes('fetch') || msg.includes('network') || msg.includes('failed to load')
  }
  return false
}

export function isServerUnavailableError(error: unknown): boolean {
  if (isApiError(error)) {
    return (
      SERVER_UNAVAILABLE_STATUSES.includes(error.status as (typeof SERVER_UNAVAILABLE_STATUSES)[number]) ||
      error.code === 'NETWORK_ERROR' ||
      error.code === 'SERVER_UNAVAILABLE'
    )
  }
  return isNetworkError(error)
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (isServerUnavailableError(error)) return SERVER_UNAVAILABLE_MESSAGE
  if (isApiError(error)) return error.message
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function getApiErrorCode(error: unknown): string {
  if (isApiError(error)) {
    if (error.status > 0) return String(error.status)
    return error.code
  }
  if (isNetworkError(error)) return '503'
  return '500'
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (!isApiError(error)) return undefined
  return error.status
}

export function isUnauthorized(error: unknown): boolean {
  return isApiError(error) && error.status === 401
}
