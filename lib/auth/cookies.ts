export const AUTH_STORAGE_KEY = 'erp-auth-session-v2'

export const ACCESS_TOKEN_COOKIE = 'erp-access-token'
export const REFRESH_TOKEN_COOKIE = 'erp-refresh-token'
export const SESSION_COOKIE = 'erp-session'

export const DEMO_TOKEN_PREFIX = 'demo.'

export function isDemoToken(token: string): boolean {
  return token.startsWith(DEMO_TOKEN_PREFIX)
}

export function encodeDemoSession(payload: {
  userId: string
  role: string
  email: string
  name: string
  tenantId?: string
}): string {
  const json = JSON.stringify(payload)
  return `${DEMO_TOKEN_PREFIX}${Buffer.from(json, 'utf-8').toString('base64url')}`
}

export function decodeDemoSession(token: string): {
  userId: string
  role: string
  email: string
  name: string
  tenantId?: string
} | null {
  if (!isDemoToken(token)) return null
  try {
    const json = Buffer.from(token.slice(DEMO_TOKEN_PREFIX.length), 'base64url').toString('utf-8')
    return JSON.parse(json) as {
      userId: string
      role: string
      email: string
      name: string
      tenantId?: string
    }
  } catch {
    return null
  }
}

export function getSecureCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
