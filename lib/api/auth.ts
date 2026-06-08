import { api } from './client'
import { ApiError } from './interceptors/errors'
import type { AuthUser, LoginCredentials } from '@/lib/auth/types'
import type { LoginRequest, LoginResponse } from './types/auth'

export const authApi = {
  login: (body: LoginCredentials) =>
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body satisfies LoginRequest),
    }).then(async (res) => {
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string; code?: string }
        throw new ApiError(
          res.status,
          err.code ?? `HTTP_${res.status}`,
          err.message ?? 'Login failed',
        )
      }
      return res.json() as Promise<{ user: AuthUser }>
    }),

  logout: () =>
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }),

  me: () =>
    fetch('/api/auth/me', { credentials: 'include' }).then(async (res) => {
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string; code?: string }
        throw new ApiError(
          res.status,
          err.code ?? `HTTP_${res.status}`,
          err.message ?? 'Not authenticated',
        )
      }
      return res.json() as Promise<AuthUser>
    }),

  refresh: () =>
    fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    }).then(async (res) => {
      if (!res.ok) throw new Error('Session refresh failed')
      return res.json() as Promise<LoginResponse>
    }),
}
