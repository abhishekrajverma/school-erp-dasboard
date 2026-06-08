import { BFF_BASE } from './client'
import { toQueryRecord } from './query'
import {
  mapBackendCompanyDashboard,
  mapBackendEnquiry,
  mapBackendSchool,
  unwrapBackendEnquiries,
  type BackendCompanyDashboard,
  type BackendEnquiriesPage,
  type BackendManagedSchool,
} from '@/lib/company/mappers'
import type {
  CompanyOverview,
  ManagedSchool,
  PlanKey,
  SchoolEnquiry,
  SchoolStatus,
} from '@/lib/company/types'

async function companyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BFF_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message ?? 'Company request failed')
  }

  return response.json() as Promise<T>
}

export const companyApi = {
  dashboard: async (): Promise<{
    overview: CompanyOverview
    enquiries: SchoolEnquiry[]
    schools: ManagedSchool[]
  }> => {
    const data = await companyFetch<BackendCompanyDashboard>('/company')
    return mapBackendCompanyDashboard(data)
  },

  overview: async () => (await companyApi.dashboard()).overview,

  enquiries: async (params?: {
    page?: number
    pageSize?: number
    status?: string
    search?: string
  }) => {
    const data = await companyFetch<BackendEnquiriesPage>(
      `/enquiries${toQueryRecord(params)}`,
    )
    return { enquiries: unwrapBackendEnquiries(data) }
  },

  schools: async () => {
    const { schools } = await companyApi.dashboard()
    return { schools }
  },

  updateEnquiry: (
    id: string,
    body: { status?: SchoolEnquiry['status']; notes?: string; planKey?: PlanKey },
  ) => {
    const payload = {
      ...body,
      status: body.status === 'approved' ? 'converted' : body.status,
    }

    return companyFetch<{ enquiry: BackendEnquiriesPage }>(`/enquiries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).then((result) => ({
      enquiry: mapBackendEnquiry(
        (result as unknown as { enquiry?: Parameters<typeof mapBackendEnquiry>[0] }).enquiry ??
          (result as unknown as Parameters<typeof mapBackendEnquiry>[0]),
      ),
    }))
  },

  activateSchool: (enquiryId: string, planKey: PlanKey) =>
    companyFetch<{ school: BackendManagedSchool; enquiry?: unknown }>('/company', {
      method: 'POST',
      body: JSON.stringify({ action: 'activate', enquiryId, planKey }),
    }).then((result) => ({
      school: mapBackendSchool(result.school),
      enquiry: result.enquiry
        ? mapBackendEnquiry(result.enquiry as Parameters<typeof mapBackendEnquiry>[0])
        : ({} as SchoolEnquiry),
    })),

  assignPlan: (tenantId: string, planKey: PlanKey) =>
    companyFetch<{ school: BackendManagedSchool }>('/company', {
      method: 'POST',
      body: JSON.stringify({ action: 'assign-plan', tenantId, planKey }),
    }).then((result) => ({ school: mapBackendSchool(result.school) })),

  updateSchoolStatus: (tenantId: string, status: SchoolStatus) => {
    const action = status === 'live' ? 'activate' : 'suspend'
    return companyFetch<{ school: BackendManagedSchool }>('/company', {
      method: 'POST',
      body: JSON.stringify({ action, tenantId }),
    }).then((result) => ({ school: mapBackendSchool(result.school) }))
  },
}

export async function submitSchoolEnquiry(body: Record<string, string>) {
  const payload = {
    schoolName: body.schoolName,
    contactName: body.principalName ?? body.contactName ?? '',
    email: body.schoolEmail ?? body.email ?? '',
    phone: body.contactNumber ?? body.phone ?? '',
    city: body.city,
    state: body.state,
    country: body.country,
    address: body.address,
    planKey: body.planKey ?? 'professional',
    schoolCode: body.schoolCode,
    studentStrength: body.studentStrength,
    website: body.website,
  }

  const response = await fetch(`${BFF_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.message ?? 'Could not submit enquiry')
  }

  const result = await response.json()
  return {
    enquiry: mapBackendEnquiry(result.enquiry ?? result),
  }
}
