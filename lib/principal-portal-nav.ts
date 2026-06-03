export const PRINCIPAL_PORTAL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'academics', label: 'Academics' },
  { id: 'staff', label: 'Staff' },
  { id: 'finance', label: 'Finance' },
  { id: 'notices', label: 'Notices' },
] as const

export type PrincipalPortalTabId = (typeof PRINCIPAL_PORTAL_TABS)[number]['id']

const TAB_IDS = new Set<string>(PRINCIPAL_PORTAL_TABS.map((t) => t.id))

export function isPrincipalPortalTab(
  value: string | null | undefined,
): value is PrincipalPortalTabId {
  return Boolean(value && TAB_IDS.has(value))
}

export function getPrincipalPortalTabFromSearch(
  value: string | null | undefined,
): PrincipalPortalTabId {
  return isPrincipalPortalTab(value) ? value : 'overview'
}

export function getPrincipalPortalTabHref(tab: PrincipalPortalTabId): string {
  return tab === 'overview' ? '/principal-portal' : `/principal-portal?tab=${tab}`
}
