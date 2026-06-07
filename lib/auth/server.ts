import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import type { AuthUser } from '@/lib/auth/types'
import type { UserRole } from '@/lib/portal-users'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  decodeDemoSession,
  encodeDemoSession,
  getSecureCookieOptions,
  isDemoToken,
} from '@/lib/auth/cookies'
import { env } from '@/lib/config/env'
import { authenticatePortalUser } from '@/lib/portal-users'
import { TENANT_COOKIE } from '@/lib/tenant/constants'
import { DEFAULT_DEMO_TENANT } from '@/lib/tenant/constants'
import { serverApi } from '@/lib/api/client'

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

  if (isDemoToken(token)) {
    const demo = decodeDemoSession(token)
    if (!demo) return null
    return {
      userId: demo.userId,
      role: demo.role as UserRole,
      email: demo.email,
      name: demo.name,
      tenantId: demo.tenantId,
    }
  }

  try {
    const tenantId = await resolveTenantIdForServerCall(request)
    return await serverApi<AuthUser>('/auth/me', { accessToken: token, tenantId })
  } catch {
    return null
  }
}

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<{ user: AuthUser; accessToken: string; refreshToken?: string }> {
  if (env.useMock) {
    const account = authenticatePortalUser(email, password)
    if (!account) {
      throw new Error('Invalid email or password')
    }

    const user: AuthUser = {
      role: account.role,
      userId: account.userId,
      name: account.name,
      email: account.email,
      tenantId: DEFAULT_DEMO_TENANT.id,
    }

    const accessToken = encodeDemoSession({
      userId: user.userId,
      role: user.role,
      email: user.email,
      name: user.name,
      tenantId: user.tenantId,
    })

    return { user, accessToken, refreshToken: accessToken }
  }

  const backend = await serverApi<BackendLoginResponse>('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    tenantId: env.defaultTenantId,
  })

  return {
    user: backend.user,
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
