import type { UserRole } from '@/lib/portal-users'
import { env } from '@/lib/config/env'
import { serverApi } from '@/lib/api/client'
import { mapBackendSchoolStatus } from '@/lib/company/mappers'
import type { ManagedSchool, SchoolStatus } from './types'

export const SCHOOL_PORTAL_ROLES = [
  'admin',
  'principal',
  'teacher',
  'student',
  'parent',
] as const satisfies readonly UserRole[]

export type SchoolPortalRole = (typeof SCHOOL_PORTAL_ROLES)[number]

export function isSchoolPortalRole(role: UserRole): role is SchoolPortalRole {
  return (SCHOOL_PORTAL_ROLES as readonly UserRole[]).includes(role)
}

export type SchoolLoginAccess =
  | { allowed: true; school: ManagedSchool | null }
  | { allowed: false; status: SchoolStatus | 'unknown'; message: string }

type BackendTenant = {
  id: string
  slug?: string
  name?: string
  schoolEmail?: string
  status?: string
}

function messageForStatus(status: SchoolStatus): string {
  switch (status) {
    case 'suspended':
      return 'Your school has been suspended. Contact EduSync support to restore access.'
    case 'pending':
      return 'Your school is not active yet. Contact EduSync to complete onboarding.'
    default:
      return 'Your school cannot access the ERP right now. Contact EduSync support.'
  }
}

async function findManagedSchoolFromBackend(
  email: string,
  tenantId?: string,
): Promise<ManagedSchool | null> {
  const lookupId = tenantId ?? env.defaultTenantId

  try {
    const tenant = await serverApi<BackendTenant>(`/tenants/${lookupId}`)
    const status = mapBackendSchoolStatus(tenant.status)
    return {
      id: tenant.id,
      slug: tenant.slug ?? tenant.id,
      name: tenant.name ?? tenant.id,
      planKey: 'professional',
      planName: 'Professional',
      status,
      schoolCode: '',
      schoolEmail: tenant.schoolEmail ?? email,
      contactNumber: '',
      principalName: '',
      city: '',
      state: '',
      studentStrength: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  } catch {
    return null
  }
}

export async function findManagedSchool(
  email: string,
  tenantId?: string,
): Promise<ManagedSchool | null> {
  return findManagedSchoolFromBackend(email, tenantId)
}

export async function resolveSchoolTenantId(
  email: string,
  fallbackTenantId?: string,
): Promise<string | undefined> {
  const school = await findManagedSchool(email, fallbackTenantId)
  if (school?.status === 'live') return school.id
  return fallbackTenantId
}

export async function checkSchoolLoginAccess(
  email: string,
  tenantId?: string,
): Promise<SchoolLoginAccess> {
  const school = await findManagedSchool(email, tenantId)

  if (!school) {
    return { allowed: true, school: null }
  }

  if (school.status === 'live') {
    return { allowed: true, school }
  }

  return {
    allowed: false,
    status: school.status,
    message: messageForStatus(school.status),
  }
}

export async function assertSchoolLoginAllowed(
  email: string,
  role: UserRole,
  tenantId?: string,
): Promise<void> {
  if (!isSchoolPortalRole(role)) return

  const access = await checkSchoolLoginAccess(email, tenantId)
  if (!access.allowed) {
    throw new Error(access.message)
  }
}
