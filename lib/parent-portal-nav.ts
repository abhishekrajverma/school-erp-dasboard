export const PARENT_PORTAL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'children', label: 'My Children' },
  { id: 'fees', label: 'Fees' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'transport', label: 'Transport' },
  { id: 'notices', label: 'Notices' },
  { id: 'profile', label: 'My Profile' },
] as const

export type ParentPortalTabId = (typeof PARENT_PORTAL_TABS)[number]['id']

const TAB_IDS = new Set<string>(PARENT_PORTAL_TABS.map((t) => t.id))

export function isParentPortalTab(value: string | null | undefined): value is ParentPortalTabId {
  return Boolean(value && TAB_IDS.has(value))
}

export function getParentPortalTabFromSearch(
  value: string | null | undefined,
): ParentPortalTabId {
  return isParentPortalTab(value) ? value : 'overview'
}

export function getParentPortalTabHref(tab: ParentPortalTabId): string {
  return tab === 'overview' ? '/parent-portal' : `/parent-portal?tab=${tab}`
}
