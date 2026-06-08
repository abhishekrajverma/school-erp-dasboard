/** Routes that do not require authentication */
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/get-started',
  '/school',
] as const

export const COMPANY_ROUTE_PREFIX = '/company'

/** Admin ERP dashboard routes (require admin role) */
export const ADMIN_ROUTE_PREFIXES = [
  '/dashboard',
  '/students',
  '/teachers',
  '/parents',
  '/fees',
  '/payroll',
  '/hr',
  '/attendance',
  '/academics',
  '/timetable',
  '/exams',
  '/library',
  '/transport',
  '/hostel',
  '/inventory',
  '/billing',
  '/reports',
  '/notifications',
  '/settings',
  '/admission',
] as const

export const PORTAL_ROUTES = {
  teacher: '/teacher-portal',
  student: '/student-portal',
  parent: '/parent-portal',
  principal: '/principal-portal',
} as const

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

export function isProtectedRoute(pathname: string): boolean {
  if (isPublicRoute(pathname)) return false
  if (pathname.startsWith('/api')) return false
  if (pathname.startsWith('/_next')) return false
  return true
}
