import {
  DEFAULT_SCHOOL_WEBSITE_SLUG,
  getAllPublishedSchoolSlugs,
  getSeedSchoolWebsite,
  schoolWebsitesSeed,
} from './data'
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
  getAllPublishedSchoolSlugs,
  schoolWebsitesSeed,
} from './data'
export { loadSchoolWebsiteOverrides, saveSchoolWebsiteOverrides } from './storage'
export { slugifySchoolName, getSchoolWebsitePath, formatFeeFrequency }

export function getSchoolWebsite(slug: string): SchoolWebsite | null {
  const seed = getSeedSchoolWebsite(slug)
  if (!seed) return null
  const overrides = loadSchoolWebsiteOverrides(slug)
  return mergeSchoolWebsite(seed, overrides)
}

/** Server-safe lookup (seed data only, no localStorage) */
export function getSchoolWebsiteStatic(slug: string): SchoolWebsite | null {
  return getSeedSchoolWebsite(slug)
}

export function getDefaultSchoolWebsite(): SchoolWebsite {
  return getSeedSchoolWebsite(DEFAULT_SCHOOL_WEBSITE_SLUG)!
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
