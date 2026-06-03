/**
 * Centralized environment configuration.
 * Server-only secrets stay in API routes — never expose via NEXT_PUBLIC_*.
 */

function readBool(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

export const env = {
  /** Browser-safe ASP.NET Core base URL */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  /** Server-side backend URL (falls back to public URL) */
  serverApiUrl:
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:5000/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  /** Use mock auth + local data instead of real API */
  useMock: readBool(process.env.NEXT_PUBLIC_USE_MOCK, true),
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const
