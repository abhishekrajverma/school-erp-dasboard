import { NextResponse } from 'next/server'
import { buildClearAuthCookies } from '@/lib/auth/server'
import { TENANT_COOKIE } from '@/lib/tenant/constants'
import { getSecureCookieOptions } from '@/lib/auth/cookies'

export async function POST() {
  const response = NextResponse.json({ success: true })

  for (const cookie of buildClearAuthCookies()) {
    response.cookies.set(cookie.name, cookie.value, cookie.options)
  }

  response.cookies.set(TENANT_COOKIE, '', getSecureCookieOptions(0))

  return response
}
