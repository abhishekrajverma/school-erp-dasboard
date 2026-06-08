import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth/cookies'
import { getRoleFromJwt } from '@/lib/auth/jwt'
import { isProtectedRoute, isPublicRoute } from '@/lib/constants/routes'
import { getRoleHomePath } from '@/lib/auth/types'
import type { UserRole } from '@/lib/portal-users'

function getRoleFromToken(token: string): UserRole | null {
  return getRoleFromJwt(token)
}

function isCompanyRoute(pathname: string): boolean {
  return pathname === '/company' || pathname.startsWith('/company/')
}

function isAdminRoute(pathname: string): boolean {
  const adminPrefixes = [
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
  ]
  return adminPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

function enforceRoleRouting(request: NextRequest, role: UserRole): NextResponse | null {
  const { pathname } = request.nextUrl

  if (isAdminRoute(pathname) && role !== 'admin') {
    return NextResponse.redirect(new URL(getRoleHomePath(role), request.url))
  }

  if (isCompanyRoute(pathname) && role !== 'company') {
    return NextResponse.redirect(new URL(getRoleHomePath(role), request.url))
  }

  if (role === 'company' && isAdminRoute(pathname)) {
    return NextResponse.redirect(new URL('/company', request.url))
  }

  if (role === 'admin' && isCompanyRoute(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (role === 'admin' && pathname.startsWith('/teacher-portal')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if (role === 'admin' && pathname.startsWith('/student-portal')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if (role === 'admin' && pathname.startsWith('/parent-portal')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  if (role === 'admin' && pathname.startsWith('/principal-portal')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const portalRoutes: Record<UserRole, string> = {
    teacher: '/teacher-portal',
    student: '/student-portal',
    parent: '/parent-portal',
    principal: '/principal-portal',
    admin: '/dashboard',
    company: '/company',
  }

  const portalPrefixes = [
    '/teacher-portal',
    '/student-portal',
    '/parent-portal',
    '/principal-portal',
  ]

  if (role !== 'admin' && role !== 'company') {
    const ownPortal = portalRoutes[role]
    if (portalPrefixes.some((prefix) => pathname.startsWith(prefix))) {
      if (!pathname.startsWith(ownPortal)) {
        return NextResponse.redirect(new URL(getRoleHomePath(role), request.url))
      }
    }
  }

  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const isAuthenticated = Boolean(token)
  const role = token ? getRoleFromToken(token) : null

  if (isPublicRoute(pathname)) {
    if (isAuthenticated && pathname === '/login' && role) {
      return NextResponse.redirect(new URL(getRoleHomePath(role), request.url))
    }
    return NextResponse.next()
  }

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (role) {
    const redirect = enforceRoleRouting(request, role)
    if (redirect) return redirect
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.png$).*)'],
}
