import type { UserRole } from '@/lib/portal-users'

const VALID_ROLES: UserRole[] = [
  'admin',
  'teacher',
  'student',
  'parent',
  'principal',
  'company',
]

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  if (typeof atob === 'function') {
    return atob(padded)
  }
  return Buffer.from(padded, 'base64').toString('utf-8')
}

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as Record<string, unknown>
  } catch {
    return null
  }
}

function normalizeRole(value: unknown): UserRole | null {
  if (value == null) return null
  const role = String(Array.isArray(value) ? value[0] : value).toLowerCase()
  return VALID_ROLES.includes(role as UserRole) ? (role as UserRole) : null
}

export function getRoleFromJwt(token: string): UserRole | null {
  const payload = decodeJwtPayload(token)
  if (!payload) return null

  return normalizeRole(
    payload.role ??
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payload.roles,
  )
}
