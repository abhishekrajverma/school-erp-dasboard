/** Rules for which headers the BFF forwards to ASP.NET Core. */

export type ProxyHeaderScope = 'school' | 'company' | 'public'

function normalizePath(path: string): string {
  return path.replace(/^\/+/, '').split('?')[0].toLowerCase()
}

export function resolveProxyHeaderScope(path: string, method: string): ProxyHeaderScope {
  const p = normalizePath(path)
  const verb = method.toUpperCase()

  if (p.startsWith('auth/')) return 'public'
  if (p === 'tenants/provision' && verb === 'POST') return 'public'
  if (p.startsWith('tenants/by-slug/')) return 'public'
  if (/^tenants\/[^/]+$/.test(p) && verb === 'GET') return 'public'
  if (p === 'enquiries' && verb === 'POST') return 'public'
  if (p === 'company' || p.startsWith('company/')) return 'company'
  if (p === 'enquiries' || p.startsWith('enquiries/')) return 'company'

  return 'school'
}

export function shouldForwardTenantHeader(path: string, method: string): boolean {
  const scope = resolveProxyHeaderScope(path, method)
  if (scope === 'school') return true
  if (scope === 'public' && normalizePath(path) === 'admissions' && method.toUpperCase() === 'POST') {
    return true
  }
  return false
}

export function shouldForwardFinancialYearHeader(path: string, method: string): boolean {
  return resolveProxyHeaderScope(path, method) === 'school'
}
