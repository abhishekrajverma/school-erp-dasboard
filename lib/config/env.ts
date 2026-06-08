/**
 * Centralized environment configuration.
 * Server-only secrets stay in API routes — never expose via NEXT_PUBLIC_*.
 */

export const env = {
  /** Browser-safe ASP.NET Core base URL */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  /** Server-side backend URL (falls back to public URL) */
  serverApiUrl:
    process.env.API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:5000/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  /** Default tenant id for login and server-side API calls */
  defaultTenantId:
    process.env.NEXT_PUBLIC_TENANT_ID ??
    process.env.DEFAULT_TENANT_ID ??
    process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID ??
    'demo-school-001',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
} as const
