import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { env } from '@/lib/config/env'
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  getSecureCookieOptions,
  isDemoToken,
} from '@/lib/auth/cookies'
import { buildAuthCookies } from '@/lib/auth/server'
import { serverApi } from '@/lib/api/client'

export async function POST() {
  const jar = await cookies()
  const accessToken = jar.get(ACCESS_TOKEN_COOKIE)?.value
  const refreshToken = jar.get(REFRESH_TOKEN_COOKIE)?.value

  if (!accessToken && !refreshToken) {
    return NextResponse.json(
      { code: 'UNAUTHORIZED', message: 'No session' },
      { status: 401 },
    )
  }

  if (env.useMock && accessToken && isDemoToken(accessToken)) {
    const response = NextResponse.json({ success: true })
    response.cookies.set(
      ACCESS_TOKEN_COOKIE,
      accessToken,
      getSecureCookieOptions(60 * 60 * 8),
    )
    return response
  }

  if (!refreshToken) {
    return NextResponse.json(
      { code: 'UNAUTHORIZED', message: 'Refresh token missing' },
      { status: 401 },
    )
  }

  try {
    const backend = await serverApi<{
      accessToken: string
      refreshToken?: string
      expiresIn?: number
    }>('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
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
