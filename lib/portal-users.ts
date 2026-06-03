import { parentsData, schoolSettings, studentsData, teachersData } from './erp-data'

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent' | 'principal'

export type PortalAccount = {
  email: string
  password: string
  role: UserRole
  userId: string
  name: string
}

/** Demo login accounts — password is role name + 123 for easy testing */
export const portalAccounts: PortalAccount[] = [
  {
    email: 'admin@school.edu',
    password: 'admin123',
    role: 'admin',
    userId: 'admin',
    name: 'Admin User',
  },
  {
    email: 'principal@school.edu',
    password: 'principal123',
    role: 'principal',
    userId: 'principal',
    name: schoolSettings.principalName,
  },
  ...teachersData.map((t) => ({
    email: t.email,
    password: 'teacher123',
    role: 'teacher' as const,
    userId: t.id,
    name: t.name,
  })),
  ...studentsData.map((s) => ({
    email: s.email,
    password: 'student123',
    role: 'student' as const,
    userId: s.id,
    name: s.name,
  })),
  ...parentsData.map((p) => ({
    email: p.email,
    password: 'parent123',
    role: 'parent' as const,
    userId: p.id,
    name: p.name,
  })),
]

export function authenticatePortalUser(
  email: string,
  password: string,
): PortalAccount | null {
  const normalized = email.trim().toLowerCase()
  return (
    portalAccounts.find(
      (a) => a.email.toLowerCase() === normalized && a.password === password,
    ) ?? null
  )
}

export const demoLoginHints: Record<UserRole, { email: string; password: string; label: string }> = {
  admin: { email: 'admin@school.edu', password: 'admin123', label: 'School admin' },
  principal: {
    email: 'principal@school.edu',
    password: 'principal123',
    label: schoolSettings.principalName,
  },
  teacher: {
    email: 'anita.s@school.edu',
    password: 'teacher123',
    label: 'Mrs. Anita Singh',
  },
  student: { email: 'arjun.s@school.edu', password: 'student123', label: 'Arjun Sharma' },
  parent: {
    email: 'rajesh.sharma@email.com',
    password: 'parent123',
    label: 'Mr. Rajesh Sharma',
  },
}
