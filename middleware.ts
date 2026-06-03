import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ACCESS_TOKEN_COOKIE } from '@/lib/auth/cookies'
import { isProtectedRoute, isPublicRoute } from '@/lib/constants/routes'
import { getRoleHomePath } from '@/lib/auth/types'
import type { UserRole } from '@/lib/portal-users'
import { decodeDemoSession, isDemoToken } from '@/lib/auth/cookies'

function getRoleFromToken(token: string): UserRole | null {
  if (isDemoToken(token)) {
    const session = decodeDemoSession(token)
    return (session?.role as UserRole) ?? null
  }
  return null
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

  if (isPublicRoute(pathname)) {
    if (isAuthenticated && pathname === '/login') {
      const role = token ? getRoleFromToken(token) : null
      if (role) {
        return NextResponse.redirect(new URL(getRoleHomePath(role), request.url))
      }
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

  if (token && isDemoToken(token)) {
    const role = getRoleFromToken(token)

    if (role && isAdminRoute(pathname) && role !== 'admin') {
      return NextResponse.redirect(new URL(getRoleHomePath(role), request.url))
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

    const portalRoutes: Record<UserRole, string> = {
      teacher: '/teacher-portal',
      student: '/student-portal',
      parent: '/parent-portal',
      admin: '/dashboard',
    }

    if (role && role !== 'admin') {
      const ownPortal = portalRoutes[role]
      if (
        pathname.startsWith('/teacher-portal') ||
        pathname.startsWith('/student-portal') ||
        pathname.startsWith('/parent-portal')
      ) {
        if (!pathname.startsWith(ownPortal)) {
          return NextResponse.redirect(new URL(getRoleHomePath(role), request.url))
        }
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.png$).*)'],
}
