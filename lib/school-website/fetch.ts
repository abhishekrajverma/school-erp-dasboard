import { env } from '@/lib/config/env'
import { serverApi } from '@/lib/api/client'
import type { SchoolWebsite } from './types'
import { slugifySchoolName } from './utils'

type BackendTenant = {
  id: string
  slug?: string
  name?: string
  schoolEmail?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  principalName?: string
  status?: string
  planKey?: string
  website?: {
    published?: boolean
    tagline?: string
    logo?: string
    primaryColor?: string
    about?: string
    mission?: string
    vision?: string
    principalMessage?: string
    establishedYear?: number
    affiliationBoard?: string
    affiliationNumber?: string
    studentCount?: number
    teacherCount?: number
    socialLinks?: SchoolWebsite['socialLinks']
    feeStructure?: SchoolWebsite['feeStructure']
    feeNotes?: string
    announcements?: SchoolWebsite['announcements']
    facilities?: string[]
    admissionOpen?: boolean
    admissionDeadline?: string
    admissionProcess?: string[]
    officeHours?: string
  }
}

function mapPlanKey(value?: string): SchoolWebsite['subscriptionPlan'] {
  if (value === 'starter' || value === 'professional' || value === 'enterprise') {
    return value
  }
  return 'professional'
}

function mapTenantToSchoolWebsite(tenant: BackendTenant, slug: string): SchoolWebsite {
  const website = tenant.website ?? {}

  return {
    slug: tenant.slug ?? slug,
    tenantId: tenant.id,
    published: website.published ?? tenant.status === 'live',
    subscriptionPlan: mapPlanKey(tenant.planKey),
    schoolName: tenant.name ?? slug,
    tagline: website.tagline ?? '',
    logo: website.logo ?? '',
    primaryColor: website.primaryColor ?? '#4f46e5',
    about: website.about ?? '',
    mission: website.mission ?? '',
    vision: website.vision ?? '',
    principalName: tenant.principalName ?? '',
    principalMessage: website.principalMessage ?? '',
    establishedYear: website.establishedYear ?? new Date().getFullYear(),
    affiliationBoard: website.affiliationBoard ?? '',
    affiliationNumber: website.affiliationNumber ?? '',
    studentCount: website.studentCount ?? 0,
    teacherCount: website.teacherCount ?? 0,
    email: tenant.schoolEmail ?? '',
    phone: tenant.phone ?? '',
    address: tenant.address ?? '',
    city: tenant.city ?? '',
    state: tenant.state ?? '',
    pincode: tenant.pincode ?? '',
    socialLinks: website.socialLinks ?? {},
    feeStructure: website.feeStructure ?? [],
    feeNotes: website.feeNotes,
    announcements: website.announcements ?? [],
    facilities: website.facilities ?? [],
    admissionOpen: website.admissionOpen ?? false,
    admissionDeadline: website.admissionDeadline,
    admissionProcess: website.admissionProcess ?? [],
    officeHours: website.officeHours ?? '',
  }
}

export async function fetchSchoolWebsiteBySlug(slug: string): Promise<SchoolWebsite | null> {
  try {
    const tenant = await serverApi<BackendTenant>(`/tenants/by-slug/${encodeURIComponent(slug)}`, {
      tenantId: env.defaultTenantId,
    })
    return mapTenantToSchoolWebsite(tenant, slug)
  } catch {
    return null
  }
}

export const DEFAULT_SCHOOL_WEBSITE_SLUG = slugifySchoolName(
  process.env.NEXT_PUBLIC_DEFAULT_SCHOOL_NAME ?? 'school',
)

export async function getAllPublishedSchoolSlugs(): Promise<string[]> {
  return []
}
