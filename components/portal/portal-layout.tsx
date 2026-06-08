'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Bus,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  BookOpen,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  LogOut,
  Moon,
  Sparkles,
  Sun,
  User,
  UserCheck,
  UserCircle,
  Users,
  Wallet,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/providers/auth-provider'
import type { UserRole } from '@/lib/portal-users'
import {
  getParentProfilePhotoUrl,
  loadParentProfilePhotos,
} from '@/lib/parent-profile'
import { loadTeacherProfilePhotos, getTeacherProfilePhotoUrl } from '@/lib/teacher-portal'
import {
  getParentPortalTabFromSearch,
  type ParentPortalTabId,
} from '@/lib/parent-portal-nav'
import {
  getPrincipalPortalTabFromSearch,
  type PrincipalPortalTabId,
} from '@/lib/principal-portal-nav'
import { SignedInRoleLabel } from '@/components/portal/signed-in-role-label'

type PortalNavItem = {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  tab?: ParentPortalTabId | PrincipalPortalTabId
}

const navByRole: Record<UserRole, PortalNavItem[]> = {
  admin: [],
  company: [],
  principal: [
    { name: 'Overview', href: '/principal-portal', icon: LayoutDashboard, tab: 'overview' },
    {
      name: 'Academics',
      href: '/principal-portal?tab=academics',
      icon: BookOpen,
      tab: 'academics',
    },
    { name: 'Staff', href: '/principal-portal?tab=staff', icon: Users, tab: 'staff' },
    { name: 'Finance', href: '/principal-portal?tab=finance', icon: Wallet, tab: 'finance' },
    { name: 'Notices', href: '/principal-portal?tab=notices', icon: Bell, tab: 'notices' },
  ],
  teacher: [{ name: 'My Portal', href: '/teacher-portal', icon: UserCheck }],
  student: [{ name: 'My Portal', href: '/student-portal', icon: GraduationCap }],
  parent: [
    { name: 'My Portal', href: '/parent-portal', icon: UserCircle, tab: 'overview' },
    { name: 'My Children', href: '/parent-portal?tab=children', icon: Users, tab: 'children' },
    { name: 'Fees', href: '/parent-portal?tab=fees', icon: CreditCard, tab: 'fees' },
    {
      name: 'Attendance',
      href: '/parent-portal?tab=attendance',
      icon: CalendarCheck,
      tab: 'attendance',
    },
    { name: 'Transport', href: '/parent-portal?tab=transport', icon: Bus, tab: 'transport' },
    { name: 'Notices', href: '/parent-portal?tab=notices', icon: Bell, tab: 'notices' },
    { name: 'My Profile', href: '/parent-portal?tab=profile', icon: User, tab: 'profile' },
  ],
}

function usePortalUser(session: ReturnType<typeof useAuth>['user'], _profileVersion = 0) {
  void _profileVersion
  if (!session) return null

  const initials = session.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)

  if (session.role === 'teacher') {
    const photos = loadTeacherProfilePhotos()
    return {
      name: session.name,
      subtitle: 'Teacher',
      avatar: getTeacherProfilePhotoUrl(session.userId, photos),
      initials,
    }
  }

  if (session.role === 'student') {
    return {
      name: session.name,
      subtitle: 'Student',
      avatar: undefined,
      initials,
    }
  }

  if (session.role === 'parent') {
    const photos = loadParentProfilePhotos()
    return {
      name: session.name,
      subtitle: 'Parent / Guardian',
      avatar: getParentProfilePhotoUrl(session.userId, photos),
      initials,
    }
  }

  if (session.role === 'principal') {
    return {
      name: session.name,
      subtitle: 'Principal',
      avatar: undefined,
      initials,
    }
  }

  return {
    name: session.name,
    subtitle: session.role === 'company' ? 'Company Admin' : 'Admin',
    avatar: undefined,
    initials,
  }
}

function isNavItemActive(
  item: PortalNavItem,
  pathname: string,
  activeParentTab: ParentPortalTabId,
  activePrincipalTab: PrincipalPortalTabId,
) {
  if (item.tab && pathname.startsWith('/parent-portal')) {
    return item.tab === activeParentTab
  }
  if (item.tab && pathname.startsWith('/principal-portal')) {
    return item.tab === activePrincipalTab
  }
  return pathname === item.href
}

function PortalNavLinks({
  nav,
  collapsed,
  pathname,
}: {
  nav: PortalNavItem[]
  collapsed: boolean
  pathname: string
}) {
  const searchParams = useSearchParams()
  const activeParentTab = getParentPortalTabFromSearch(searchParams.get('tab'))
  const activePrincipalTab = getPrincipalPortalTabFromSearch(searchParams.get('tab'))

  return (
    <>
      {nav.map((item) => {
        const Icon = item.icon
        const active = isNavItemActive(item, pathname, activeParentTab, activePrincipalTab)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.name}</span>}
          </Link>
        )
      })}
    </>
  )
}

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user: session, logout } = useAuth()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [profileVersion, setProfileVersion] = React.useState(0)
  const user = usePortalUser(session, profileVersion)

  React.useEffect(() => setMounted(true), [])

  React.useEffect(() => {
    const onProfileUpdate = () => setProfileVersion((v) => v + 1)
    window.addEventListener('edusync-parent-profile-updated', onProfileUpdate)
    return () => window.removeEventListener('edusync-parent-profile-updated', onProfileUpdate)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const nav = session ? navByRole[session.role] : []

  const roleLabel =
    session?.role === 'teacher'
      ? 'Teacher'
      : session?.role === 'student'
        ? 'Student'
        : session?.role === 'parent'
          ? 'Parent'
          : session?.role === 'principal'
            ? 'Principal'
            : 'User'

  return (
    <div className="min-h-screen">
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 240 }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-sidebar/90 backdrop-blur-xl"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!collapsed && (
            <Link href={nav[0]?.href ?? '/'} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">EduSync</span>
            </Link>
          )}
          {collapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <React.Suspense
            fallback={
              <>
                {nav.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.name}</span>}
                    </div>
                  )
                })}
              </>
            }
          >
            <PortalNavLinks nav={nav} collapsed={collapsed} pathname={pathname} />
          </React.Suspense>
        </nav>

        <div className="border-t border-border p-3 space-y-2">
          {!collapsed && user && (
            <div className="rounded-lg bg-muted/40 px-3 py-2">
              <p className="truncate text-xs font-medium">{user.name}</p>
              <p className="text-[10px] text-muted-foreground">{roleLabel}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn('w-full', collapsed ? 'justify-center px-0' : 'justify-start gap-2')}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && 'Log out'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </motion.aside>

      <motion.header
        initial={false}
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur"
      >
        <SignedInRoleLabel roleLabel={roleLabel} />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.initials}</AvatarFallback>
                </Avatar>
                <AnimatePresence>
                  <span className="hidden text-sm font-medium md:inline">{user?.name}</span>
                </AnimatePresence>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session?.role === 'parent' && (
                <DropdownMenuItem asChild>
                  <Link href="/parent-portal?tab=profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
              )}
              {session?.role === 'parent' && <DropdownMenuSeparator />}
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      <motion.main
        initial={false}
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        className="min-h-[calc(100vh-4rem)] p-6"
      >
        {children}
      </motion.main>
    </div>
  )
}
