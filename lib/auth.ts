import type { UserRole } from './portal-users'

export const AUTH_STORAGE_KEY = 'erp-auth-session-v2'

export type AuthSession = {
  role: UserRole
  userId: string
  name: string
  email: string
}

export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/dashboard'
    case 'teacher':
      return '/teacher-portal'
    case 'student':
      return '/student-portal'
    case 'parent':
      return '/parent-portal'
  }
}

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

export function isAuthenticated(): boolean {
  return getSession() !== null
}

export function login(session: AuthSession) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
}

/** @deprecated Use login() with a session — kept for get-started flow */
export function markLoggedIn() {
  login({
    role: 'admin',
    userId: 'admin',
    name: 'Admin User',
    email: 'admin@school.edu',
  })
}

export function markLoggedOut() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function sessionHasRole(role: UserRole): boolean {
  return getSession()?.role === role
}
