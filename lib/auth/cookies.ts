export const AUTH_STORAGE_KEY = 'erp-auth-session-v2'

export const ACCESS_TOKEN_COOKIE = 'erp-access-token'
export const REFRESH_TOKEN_COOKIE = 'erp-refresh-token'
export const SESSION_COOKIE = 'erp-session'

export function getSecureCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
