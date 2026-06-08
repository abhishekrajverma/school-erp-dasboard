import {
  DEFAULT_SCHOOL_WEBSITE_SLUG,
  fetchSchoolWebsiteBySlug,
  getAllPublishedSchoolSlugs,
} from './fetch'
import { loadSchoolWebsiteOverrides, mergeSchoolWebsite } from './storage'
import type { SchoolWebsite, SchoolWebsitePatch } from './types'
import { formatFeeFrequency, getSchoolWebsitePath, slugifySchoolName } from './utils'

export type {
  SchoolWebsite,
  SchoolWebsitePatch,
  SchoolWebsiteFeeItem,
  SchoolAnnouncement,
} from './types'
export {
  DEFAULT_SCHOOL_WEBSITE_SLUG,
  fetchSchoolWebsiteBySlug,
  getAllPublishedSchoolSlugs,
} from './fetch'
export { loadSchoolWebsiteOverrides, saveSchoolWebsiteOverrides } from './storage'
export { slugifySchoolName, getSchoolWebsitePath, formatFeeFrequency }

export function mergeSchoolWebsiteWithOverrides(base: SchoolWebsite): SchoolWebsite {
  const overrides = loadSchoolWebsiteOverrides(base.slug)
  return mergeSchoolWebsite(base, overrides)
}

/** Server-side lookup from ASP.NET tenant API */
export async function getSchoolWebsiteStatic(slug: string): Promise<SchoolWebsite | null> {
  const site = await fetchSchoolWebsiteBySlug(slug)
  if (!site) return null
  const overrides = loadSchoolWebsiteOverrides(slug)
  return mergeSchoolWebsite(site, overrides)
}

export async function getDefaultSchoolWebsite(): Promise<SchoolWebsite | null> {
  return getSchoolWebsiteStatic(DEFAULT_SCHOOL_WEBSITE_SLUG)
}

export function buildSchoolWebsiteUrl(slug: string, origin?: string) {
  const path = getSchoolWebsitePath(slug)
  if (origin) return `${origin.replace(/\/$/, '')}${path}`
  return path
}

export function isWebsiteIncludedInPlan(plan: SchoolWebsite['subscriptionPlan']) {
  return plan === 'professional' || plan === 'enterprise'
}

export function applySchoolWebsitePatch(base: SchoolWebsite, patch: SchoolWebsitePatch): SchoolWebsite {
  return mergeSchoolWebsite(base, patch)
}
