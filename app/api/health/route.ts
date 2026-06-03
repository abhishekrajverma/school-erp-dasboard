import { NextResponse } from 'next/server'
import { env } from '@/lib/config/env'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'EduSync',
    environment: env.isProd ? 'production' : 'development',
    mockMode: env.useMock,
    timestamp: new Date().toISOString(),
  })
}
