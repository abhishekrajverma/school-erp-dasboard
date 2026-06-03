import type { UserRole } from '@/lib/portal-users'

/** TODO: align with ASP.NET Core auth DTOs */

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  refreshToken?: string
  expiresIn: number
}

export type AuthUser = {
  userId: string
  name: string
  email: string
  role: UserRole
}
