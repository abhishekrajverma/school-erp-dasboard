import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  getAccessTokenFromRequest,
  resolveUserFromToken,
} from '@/lib/auth/server'

export async function requireCompanyUser(request?: NextRequest) {
  const token = await getAccessTokenFromRequest(request)
  const user = await resolveUserFromToken(token, request)

  if (!user || user.role !== 'company') {
    return {
      user: null,
      response: NextResponse.json(
        { code: 'FORBIDDEN', message: 'Company access required' },
        { status: 403 },
      ),
    }
  }

  return { user, response: null }
}
