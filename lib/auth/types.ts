import type { UserRole } from '@/lib/portal-users'

export type AuthSession = {
  role: UserRole
  userId: string
  name: string
  email: string
  tenantId?: string
  permissions?: string[]
}

export type AuthUser = AuthSession

export type LoginCredentials = {
  email: string
  password: string
  /** Required for admin — scopes session data to this financial year */
  financialYear?: string
}

export type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<AuthUser>
  logout: () => Promise<void>
  refreshSession: () => Promise<AuthUser | null>
}

export function getRoleHomePath(role: UserRole): string {
  switch (role) {
    case 'admin':
      return '/dashboard'
    case 'principal':
      return '/principal-portal'
    case 'teacher':
      return '/teacher-portal'
    case 'student':
      return '/student-portal'
    case 'parent':
      return '/parent-portal'
    case 'company':
      return '/company'
  }
}
