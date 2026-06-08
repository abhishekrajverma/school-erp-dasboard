import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import type { AuthUser } from '@/lib/auth/types'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getSecureCookieOptions,
} from '@/lib/auth/cookies'
import { serverApi } from '@/lib/api/client'
import {
  assertSchoolLoginAllowed,
  checkSchoolLoginAccess,
  isSchoolPortalRole,
} from '@/lib/company/access'
import { env } from '@/lib/config/env'
import { TENANT_COOKIE } from '@/lib/tenant/constants'

const ACCESS_MAX_AGE = 60 * 60 * 8 // 8 hours
const REFRESH_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export type BackendLoginResponse = {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  user: AuthUser
}

export async function getAccessTokenFromRequest(
  request?: NextRequest,
): Promise<string | undefined> {
  if (request) {
    return request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  }
  const jar = await cookies()
  return jar.get(ACCESS_TOKEN_COOKIE)?.value
}

export async function getTenantIdFromRequest(
  request?: NextRequest,
): Promise<string | undefined> {
  if (request) {
    return (
      request.cookies.get(TENANT_COOKIE)?.value ??
      request.headers.get('X-Tenant-Id') ??
      undefined
    )
  }
  const jar = await cookies()
  return jar.get(TENANT_COOKIE)?.value
}

async function resolveTenantIdForServerCall(
  request?: NextRequest,
): Promise<string> {
  const fromRequest = await getTenantIdFromRequest(request)
  return fromRequest ?? env.defaultTenantId
}

export async function resolveUserFromToken(
  token: string | undefined,
  request?: NextRequest,
): Promise<AuthUser | null> {
  if (!token) return null

  try {
    const tenantId = await resolveTenantIdForServerCall(request)
    const user = await serverApi<AuthUser>('/auth/me', { accessToken: token, tenantId })
    const access = await checkSchoolLoginAccess(user.email, user.tenantId ?? tenantId)
    if (!access.allowed) return null
    return user
  } catch {
    return null
  }
}

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<{ user: AuthUser; accessToken: string; refreshToken?: string }> {
  const backend = await serverApi<BackendLoginResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (isSchoolPortalRole(backend.user.role)) {
    await assertSchoolLoginAllowed(
      backend.user.email,
      backend.user.role,
      backend.user.tenantId ?? env.defaultTenantId,
    )
  }

  const tenantId =
    backend.user.tenantId && backend.user.tenantId.length > 0
      ? backend.user.tenantId
      : undefined

  return {
    user: { ...backend.user, tenantId },
    accessToken: backend.accessToken,
    refreshToken: backend.refreshToken,
  }
}

export function buildAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieList = [
    {
      name: ACCESS_TOKEN_COOKIE,
      value: accessToken,
      options: getSecureCookieOptions(ACCESS_MAX_AGE),
    },
  ]

  if (refreshToken) {
    cookieList.push({
      name: REFRESH_TOKEN_COOKIE,
      value: refreshToken,
      options: getSecureCookieOptions(REFRESH_MAX_AGE),
    })
  }

  return cookieList
}

export function buildClearAuthCookies() {
  const expired = { ...getSecureCookieOptions(0), maxAge: 0 }
  return [
    { name: ACCESS_TOKEN_COOKIE, value: '', options: expired },
    { name: REFRESH_TOKEN_COOKIE, value: '', options: expired },
  ]
}
