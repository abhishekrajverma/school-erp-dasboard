import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/config/env'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '@/lib/auth/cookies'
import { buildAuthCookies } from '@/lib/auth/server'
import { serverApi } from '@/lib/api/client'
import { TENANT_COOKIE } from '@/lib/tenant/constants'

export async function POST() {
  const jar = await cookies()
  const refreshToken = jar.get(REFRESH_TOKEN_COOKIE)?.value

  if (!refreshToken) {
    return NextResponse.json(
      { code: 'UNAUTHORIZED', message: 'Refresh token missing' },
      { status: 401 },
    )
  }

  try {
    const tenantId = jar.get(TENANT_COOKIE)?.value ?? env.defaultTenantId
    const backend = await serverApi<{
      accessToken: string
      refreshToken?: string
      expiresIn?: number
    }>('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      tenantId,
    })

    const response = NextResponse.json({
      accessToken: backend.accessToken,
      expiresIn: backend.expiresIn,
    })

    for (const cookie of buildAuthCookies(
      backend.accessToken,
      backend.refreshToken ?? refreshToken,
    )) {
      response.cookies.set(cookie.name, cookie.value, cookie.options)
    }

    return response
  } catch {
    return NextResponse.json(
      { code: 'UNAUTHORIZED', message: 'Session expired' },
      { status: 401 },
    )
  }
}
