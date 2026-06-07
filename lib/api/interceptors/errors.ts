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

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: ApiErrorResponse | undefined
  try {
    body = (await response.json()) as ApiErrorResponse
  } catch {
    body = undefined
  }

  return new ApiError(
    response.status,
    body?.code ?? `HTTP_${response.status}`,
    body?.message ?? response.statusText ?? 'Request failed',
    body?.errors ?? body,
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

export function getApiErrorStatus(error: unknown): number | undefined {
  if (!isApiError(error)) return undefined
  return error.status
}

export function isUnauthorized(error: unknown): boolean {
  return isApiError(error) && error.status === 401
}
