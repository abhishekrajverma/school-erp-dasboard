import type { AuthSession } from './types'
import { AUTH_STORAGE_KEY } from './cookies'

/** Client-side session cache — synced after BFF login; used by legacy guards */
export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthSession
    if (!parsed?.role || !parsed?.userId || !parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

export function saveSession(session: AuthSession): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

export function clearSession(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function sessionHasRole(role: AuthSession['role']): boolean {
  return getSession()?.role === role
}

/** @deprecated Use AuthProvider.login() — kept for get-started flow */
export function markLoggedIn(): void {
  saveSession({
    role: 'admin',
    userId: 'admin',
    name: 'Admin User',
    email: 'admin@school.edu',
  })
}

/** @deprecated Use AuthProvider.login() */
export function login(session: AuthSession): void {
  saveSession(session)
}

/** @deprecated Use AuthProvider.logout() */
export function markLoggedOut(): void {
  clearSession()
}
