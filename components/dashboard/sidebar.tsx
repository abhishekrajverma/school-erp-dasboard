'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCircle,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Wallet,
  Bus,
  FileText,
  Library,
  Building,
  Clock,
  Package,
  Briefcase,
  Bell,
  BarChart3,
  Settings,
  Receipt,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserCircle,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Wallet,
  Bus,
  FileText,
  Library,
  Building,
  Clock,
  Package,
  Briefcase,
  Bell,
  BarChart3,
  Settings,
  Receipt,
  ClipboardList,
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Students', href: '/students', icon: 'GraduationCap' },
  { name: 'Admission Form', href: '/admission', icon: 'ClipboardList' },
  { name: 'Teachers', href: '/teachers', icon: 'Users' },
  { name: 'Parents', href: '/parents', icon: 'UserCircle' },
  { name: 'Academics', href: '/academics', icon: 'BookOpen' },
  { name: 'Attendance', href: '/attendance', icon: 'CalendarCheck' },
  { name: 'Fees Management', href: '/fees', icon: 'CreditCard' },
  { name: 'Salary & Payroll', href: '/payroll', icon: 'Wallet' },
  { name: 'Transport', href: '/transport', icon: 'Bus' },
  { name: 'Exams', href: '/exams', icon: 'FileText' },
  { name: 'Library', href: '/library', icon: 'Library' },
  { name: 'Hostel', href: '/hostel', icon: 'Building' },
  { name: 'Timetable', href: '/timetable', icon: 'Clock' },
  { name: 'Inventory', href: '/inventory', icon: 'Package' },
  { name: 'HR Management', href: '/hr', icon: 'Briefcase' },
  { name: 'Notifications', href: '/notifications', icon: 'Bell' },
  { name: 'Reports', href: '/reports', icon: 'BarChart3' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
  { name: 'Billing', href: '/billing', icon: 'Receipt' },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 flex h-screen min-h-0 flex-col overflow-hidden border-r border-border/80 bg-sidebar/90 backdrop-blur-xl dark:bg-sidebar/95"
      >
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg tracking-tight">EduSync</span>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary mx-auto">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation — scrollable when many menu items */}
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-4">
          <nav className="space-y-1 px-3">
            {navigationItems.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = pathname === item.href

              const linkContent = (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return <div key={item.name}>{linkContent}</div>
            })}
          </nav>
        </div>

        {/* Collapse Toggle */}
        <div className="shrink-0 border-t border-border p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.aside>
    </TooltipProvider>
  )
}
