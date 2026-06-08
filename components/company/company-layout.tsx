'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Building2,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Moon,
  PanelLeft,
  School,
  Sparkles,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { CompanyGuard } from '@/components/auth/company-guard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/components/providers/auth-provider'
import { companyBrand } from '@/lib/company-branding'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Overview', href: '/company', icon: LayoutDashboard },
  { name: 'Enquiries', href: '/company?tab=enquiries', icon: ClipboardList },
  { name: 'Schools', href: '/company?tab=schools', icon: School },
]

export function CompanyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') ?? 'overview'
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <CompanyGuard>
      <div className="min-h-screen">
        <aside
          className={cn(
            'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/80 bg-sidebar/90 backdrop-blur-xl transition-all',
            collapsed ? 'w-[72px]' : 'w-[260px]',
          )}
        >
          <div className="flex h-16 items-center border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              {!collapsed ? (
                <div>
                  <p className="text-sm font-semibold">{companyBrand.name}</p>
                  <p className="text-[10px] text-muted-foreground">Company dashboard</p>
                </div>
              ) : null}
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active =
                item.href === '/company'
                  ? pathname === '/company' && tab === 'overview'
                  : item.href.includes(`tab=${tab}`)
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!collapsed ? <span>{item.name}</span> : null}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center"
              onClick={() => setCollapsed((prev) => !prev)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
          </div>
        </aside>

        <motion.div
          animate={{ marginLeft: collapsed ? 72 : 260 }}
          transition={{ duration: 0.2 }}
        >
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary" />
              Manage school onboarding, enquiries, and plan assignments
            </div>
            <div className="flex items-center gap-2">
              {mounted ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              ) : null}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <span className="text-sm">{user?.name ?? 'Company Admin'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Company account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => void handleLogout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="min-h-[calc(100vh-4rem)] p-6">{children}</main>
        </motion.div>
      </div>
    </CompanyGuard>
  )
}
