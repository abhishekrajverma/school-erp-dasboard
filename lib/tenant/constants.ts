export const TENANT_STORAGE_KEY = 'erp-tenant-v1'
export const TENANT_COOKIE = 'erp-tenant-id'
export const TENANT_HEADER = 'X-Tenant-Id'
export const TENANT_SLUG_HEADER = 'X-Tenant-Slug'

/** Default demo tenant for local / mock development */
export const DEFAULT_DEMO_TENANT = {
  id: 'demo-school-001',
  slug: 'demo-school',
  name: 'Demo International School',
} as const
