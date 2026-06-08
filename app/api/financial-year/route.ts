import { NextResponse } from 'next/server'
import { getSecureCookieOptions } from '@/lib/auth/cookies'
import { FINANCIAL_YEAR_COOKIE } from '@/lib/financial-year/constants'
import { normalizeFinancialYear } from '@/lib/financial-year/format'

export async function POST(request: Request) {
  const body = (await request.json()) as { financialYear?: string }
  const financialYear = normalizeFinancialYear(body.financialYear?.trim() ?? '')

  if (!financialYear) {
    return NextResponse.json(
      { code: 'VALIDATION_ERROR', message: 'financialYear is required' },
      { status: 400 },
    )
  }

  const response = NextResponse.json({ financialYear })
  response.cookies.set(
    FINANCIAL_YEAR_COOKIE,
    financialYear,
    getSecureCookieOptions(60 * 60 * 24 * 365),
  )
  return response
}
