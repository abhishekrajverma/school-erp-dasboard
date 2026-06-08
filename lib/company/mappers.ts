import { planLabel } from './plans'
import type {
  CompanyOverview,
  EnquiryStatus,
  ManagedSchool,
  PlanKey,
  SchoolEnquiry,
  SchoolStatus,
} from './types'

type BackendEnquiryStatus = 'new' | 'contacted' | 'converted' | 'rejected' | string
type BackendSchoolStatus = 'Active' | 'Provisioning' | 'Suspended' | 'live' | 'pending' | 'suspended' | string

export type BackendCompanyDashboard = {
  totalSchools?: number
  liveSchools?: number
  pendingSchools?: number
  suspendedSchools?: number
  newEnquiries?: number
  totalEnquiries?: number
  schools?: BackendManagedSchool[]
  recentEnquiries?: BackendEnquiry[]
  enquiries?: BackendEnquiry[]
}

export type BackendEnquiry = {
  id: string
  schoolName: string
  contactName?: string
  principalName?: string
  email?: string
  schoolEmail?: string
  phone?: string
  contactNumber?: string
  city?: string
  state?: string
  country?: string
  address?: string
  planKey?: PlanKey
  planName?: string
  status?: BackendEnquiryStatus
  notes?: string
  createdAt?: string
  updatedAt?: string
  schoolCode?: string
  studentStrength?: string
  website?: string
}

export type BackendManagedSchool = {
  id: string
  slug?: string
  name: string
  schoolEmail?: string
  status?: BackendSchoolStatus
  planKey?: PlanKey
  planName?: string
  city?: string
  state?: string
  schoolCode?: string
  contactNumber?: string
  principalName?: string
  studentStrength?: string
  activatedAt?: string
  createdAt?: string
  updatedAt?: string
  enquiryId?: string
}

export type BackendEnquiriesPage = {
  items?: BackendEnquiry[]
  enquiries?: BackendEnquiry[]
  page?: number
  pageSize?: number
  totalCount?: number
  totalPages?: number
}

export function mapBackendSchoolStatus(status?: BackendSchoolStatus): SchoolStatus {
  const normalized = String(status ?? '').toLowerCase()
  if (normalized === 'active' || normalized === 'live') return 'live'
  if (normalized === 'provisioning' || normalized === 'pending') return 'pending'
  if (normalized === 'suspended') return 'suspended'
  return 'pending'
}

export function mapBackendEnquiryStatus(status?: BackendEnquiryStatus): EnquiryStatus {
  const normalized = String(status ?? 'new').toLowerCase()
  if (normalized === 'converted' || normalized === 'approved') return 'approved'
  if (normalized === 'contacted') return 'contacted'
  if (normalized === 'rejected') return 'rejected'
  return 'new'
}

export function mapBackendEnquiry(enquiry: BackendEnquiry): SchoolEnquiry {
  const planKey = (enquiry.planKey ?? 'professional') as PlanKey
  return {
    id: enquiry.id,
    planKey,
    planName: enquiry.planName ?? planLabel(planKey),
    schoolName: enquiry.schoolName,
    schoolCode: enquiry.schoolCode ?? '',
    schoolEmail: enquiry.schoolEmail ?? enquiry.email ?? '',
    contactNumber: enquiry.contactNumber ?? enquiry.phone ?? '',
    principalName: enquiry.principalName ?? enquiry.contactName ?? '',
    website: enquiry.website ?? '',
    address: enquiry.address ?? '',
    city: enquiry.city ?? '',
    state: enquiry.state ?? '',
    country: enquiry.country ?? '',
    studentStrength: enquiry.studentStrength ?? '',
    status: mapBackendEnquiryStatus(enquiry.status),
    notes: enquiry.notes ?? '',
    createdAt: enquiry.createdAt ?? new Date().toISOString(),
    updatedAt: enquiry.updatedAt ?? enquiry.createdAt ?? new Date().toISOString(),
  }
}

export function mapBackendSchool(school: BackendManagedSchool): ManagedSchool {
  const planKey = (school.planKey ?? 'professional') as PlanKey
  const timestamp = school.createdAt ?? new Date().toISOString()
  return {
    id: school.id,
    slug: school.slug ?? school.id,
    name: school.name,
    planKey,
    planName: school.planName ?? planLabel(planKey),
    status: mapBackendSchoolStatus(school.status),
    enquiryId: school.enquiryId,
    schoolCode: school.schoolCode ?? '',
    schoolEmail: school.schoolEmail ?? '',
    contactNumber: school.contactNumber ?? '',
    principalName: school.principalName ?? '',
    city: school.city ?? '',
    state: school.state ?? '',
    studentStrength: school.studentStrength ?? '',
    activatedAt: school.activatedAt,
    createdAt: timestamp,
    updatedAt: school.updatedAt ?? timestamp,
  }
}

export function mapBackendCompanyDashboard(data: BackendCompanyDashboard): {
  overview: CompanyOverview
  enquiries: SchoolEnquiry[]
  schools: ManagedSchool[]
} {
  const schools = (data.schools ?? []).map(mapBackendSchool)
  const enquiries = (data.recentEnquiries ?? data.enquiries ?? []).map(mapBackendEnquiry)

  const byPlan: CompanyOverview['byPlan'] = {
    starter: 0,
    professional: 0,
    enterprise: 0,
  }

  for (const school of schools) {
    if (school.status === 'live') {
      byPlan[school.planKey] += 1
    }
  }

  return {
    overview: {
      totalEnquiries: data.totalEnquiries ?? enquiries.length,
      newEnquiries: data.newEnquiries ?? enquiries.filter((e) => e.status === 'new').length,
      liveSchools: data.liveSchools ?? schools.filter((s) => s.status === 'live').length,
      pendingSchools: data.pendingSchools ?? schools.filter((s) => s.status === 'pending').length,
      suspendedSchools:
        data.suspendedSchools ?? schools.filter((s) => s.status === 'suspended').length,
      byPlan,
    },
    enquiries,
    schools,
  }
}

export function unwrapBackendEnquiries(data: BackendEnquiriesPage | BackendEnquiry[]): SchoolEnquiry[] {
  const list = Array.isArray(data) ? data : data.items ?? data.enquiries ?? []
  return list.map(mapBackendEnquiry)
}
