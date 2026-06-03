import { NextResponse } from 'next/server'
import { getSecureCookieOptions } from '@/lib/auth/cookies'
import { TENANT_COOKIE } from '@/lib/tenant/constants'

export async function POST(request: Request) {
  const body = (await request.json()) as { tenantId?: string }
  const tenantId = body.tenantId?.trim()

  if (!tenantId) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'tenantId is required' },
      { status: 400 },
    )
  }

  const response = NextResponse.json({ tenantId })
  response.cookies.set(
    TENANT_COOKIE,
    tenantId,
    getSecureCookieOptions(60 * 60 * 24 * 365),
  )
  return response
}
