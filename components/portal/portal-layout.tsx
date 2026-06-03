'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LogOut,
  Moon,
  Sparkles,
  Sun,
  UserCheck,
  UserCircle,
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
import { getSession, markLoggedOut } from '@/lib/auth'
import type { UserRole } from '@/lib/portal-users'
import { getTeacherById } from '@/lib/teacher-portal'
import { getStudentById } from '@/lib/student-portal'
import { getParentById } from '@/lib/parent-portal'
import { loadTeacherProfilePhotos, getTeacherProfilePhotoUrl } from '@/lib/teacher-portal'

const navByRole: Record<
  UserRole,
  { name: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
> = {
  admin: [],
  teacher: [{ name: 'My Portal', href: '/teacher-portal', icon: UserCheck }],
  student: [{ name: 'My Portal', href: '/student-portal', icon: GraduationCap }],
  parent: [{ name: 'My Portal', href: '/parent-portal', icon: UserCircle }],
}

function usePortalUser() {
  const session = getSession()
  if (!session) return null

  if (session.role === 'teacher') {
    const teacher = getTeacherById(session.userId)
    const photos = loadTeacherProfilePhotos()
    return {
      name: session.name,
      subtitle: teacher?.department ?? 'Teacher',
      avatar: teacher
        ? getTeacherProfilePhotoUrl(session.userId, photos, teacher.avatar)
        : undefined,
      initials: session.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2),
    }
  }

  if (session.role === 'student') {
    const student = getStudentById(session.userId)
    return {
      name: session.name,
      subtitle: student ? `Class ${student.class}` : 'Student',
      avatar: student?.avatar,
      initials: session.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2),
    }
  }

  if (session.role === 'parent') {
    const parent = getParentById(session.userId)
    return {
      name: session.name,
      subtitle: 'Parent / Guardian',
      avatar: parent?.avatar,
      initials: session.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2),
    }
  }

  return {
    name: session.name,
    subtitle: 'Admin',
    avatar: undefined,
    initials: 'AD',
  }
}

export function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const session = getSession()
  const user = usePortalUser()

  React.useEffect(() => setMounted(true), [])

  const handleLogout = () => {
    markLoggedOut()
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

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
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
        <p className="text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{roleLabel}</span>
        </p>
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
