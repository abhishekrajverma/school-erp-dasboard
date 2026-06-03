import { NextResponse } from 'next/server'
import {
  getAccessTokenFromRequest,
  resolveUserFromToken,
} from '@/lib/auth/server'

export async function GET() {
  const token = await getAccessTokenFromRequest()
  const user = await resolveUserFromToken(token)

  if (!user) {
    return NextResponse.json(
      { code: 'UNAUTHORIZED', message: 'Not authenticated' },
      { status: 401 },
    )
  }

  return NextResponse.json(user)
}
