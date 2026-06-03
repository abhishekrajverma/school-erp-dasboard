export type Tenant = {
  id: string
  slug: string
  name: string
  logoUrl?: string | null
}

export type TenantContextValue = {
  tenant: Tenant | null
  tenantId: string | null
  isLoading: boolean
  setTenant: (tenant: Tenant) => void
  clearTenant: () => void
}
