import type { SchoolWebsite, SchoolWebsitePatch } from './types'

const STORAGE_PREFIX = 'school-website-v1'

function storageKey(slug: string) {
  return `${STORAGE_PREFIX}:${slug}`
}

export function loadSchoolWebsiteOverrides(slug: string): SchoolWebsitePatch | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(storageKey(slug))
    if (!raw) return null
    return JSON.parse(raw) as SchoolWebsitePatch
  } catch {
    return null
  }
}

export function saveSchoolWebsiteOverrides(slug: string, patch: SchoolWebsitePatch) {
  if (typeof window === 'undefined') return
  localStorage.setItem(storageKey(slug), JSON.stringify(patch))
}

export function mergeSchoolWebsite(base: SchoolWebsite, patch: SchoolWebsitePatch | null): SchoolWebsite {
  if (!patch) return base
  return { ...base, ...patch }
}
