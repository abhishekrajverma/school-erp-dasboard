import { NextResponse } from 'next/server'
import {
  buildAuthCookies,
  loginWithCredentials,
} from '@/lib/auth/server'
import {
  isServerUnavailableError,
  SERVER_UNAVAILABLE_MESSAGE,
} from '@/lib/api/interceptors/errors'
import { TENANT_COOKIE } from '@/lib/tenant/constants'
import { getSecureCookieOptions } from '@/lib/auth/cookies'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string }
    const email = body.email?.trim() ?? ''
    const password = body.password ?? ''

    if (!email || !password) {
      return NextResponse.json(
        { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
        { status: 400 },
      )
    }

    const { user, accessToken, refreshToken } = await loginWithCredentials(
      email,
      password,
    )

    const response = NextResponse.json({ user })

    for (const cookie of buildAuthCookies(accessToken, refreshToken)) {
      response.cookies.set(cookie.name, cookie.value, cookie.options)
    }

    if (user.tenantId) {
      response.cookies.set(
        TENANT_COOKIE,
        user.tenantId,
        getSecureCookieOptions(60 * 60 * 24 * 365),
      )
    }

    return response
  } catch (error) {
    if (isServerUnavailableError(error)) {
      return NextResponse.json(
        { code: 'SERVER_UNAVAILABLE', message: SERVER_UNAVAILABLE_MESSAGE },
        { status: 503 },
      )
    }
    const message = error instanceof Error ? error.message : 'Login failed'
    return NextResponse.json(
      { code: 'AUTH_FAILED', message },
      { status: 401 },
    )
  }
}
