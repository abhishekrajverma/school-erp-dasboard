'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Bell,
  ChevronDown,
  Sun,
  Moon,
  Plus,
  LogOut,
  User,
  Settings,
  ChevronsUpDown,
  Building2,
  Check,
  PanelLeft,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useAuth } from '@/components/providers/auth-provider'
import { useTenant } from '@/components/providers/tenant-provider'
import { NavbarGreetingContainer } from '@/components/festivals/festival-greeting'
import { FinancialYearSwitcher } from '@/components/dashboard/financial-year-switcher'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  sidebarCollapsed: boolean
  onSidebarToggle: () => void
}

export function Header({ sidebarCollapsed, onSidebarToggle }: HeaderProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { user: session, logout } = useAuth()
  const { tenant } = useTenant()
  const [mounted, setMounted] = React.useState(false)
  const [schoolOpen, setSchoolOpen] = React.useState(false)
  const schoolName = tenant?.name ?? 'School'

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <motion.header
      initial={false}
      animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6"
    >
      {/* Left side - Sidebar toggle, School Switcher & Search */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onSidebarToggle}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft className="h-4 w-4" />
        </Button>

        {/* School Switcher */}
        <Popover open={schoolOpen} onOpenChange={setSchoolOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={schoolOpen}
              className="w-[240px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="truncate">{schoolName}</span>
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search schools..." />
              <CommandList>
                <CommandEmpty>No school found.</CommandEmpty>
                <CommandGroup heading="Current tenant">
                  <CommandItem value={schoolName} onSelect={() => setSchoolOpen(false)}>
                    <div className="flex items-center gap-2 flex-1">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span className="text-sm">{schoolName}</span>
                        {tenant?.slug ? <span className="text-xs text-muted-foreground">{tenant.slug}</span> : null}
                      </div>
                    </div>
                    <Check className="ml-2 h-4 w-4 text-primary" />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students, teachers, classes..."
            className="w-[300px] pl-9 bg-secondary/50"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Festival greeting — navbar only */}
      <NavbarGreetingContainer className="hidden shrink-0 md:flex" />

      {session?.role === 'admin' ? (
        <FinancialYearSwitcher />
      ) : null}

      {/* Right side - Quick Actions, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2">
        {/* Quick Action */}
        <Button size="sm" className="hidden sm:flex gap-2">
          <Plus className="h-4 w-4" />
          Quick Action
        </Button>

        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                5
              </span>
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary">5 new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-y-auto">
              {[
                { title: 'Fee Payment Received', desc: 'Arjun Sharma paid ₹45,000', time: '2 min ago' },
                { title: 'New Admission', desc: 'Aditya Kapoor enrolled in Class 6-A', time: '15 min ago' },
                { title: 'Exam Schedule Updated', desc: 'Mathematics exam moved to June 22', time: '1 hour ago' },
                { title: 'Low Attendance Alert', desc: 'Class 9-C attendance below 85%', time: '2 hours ago' },
                { title: 'Salary Approval Pending', desc: '3 payroll requests need approval', time: '3 hours ago' },
              ].map((notification, i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 py-3">
                  <span className="font-medium text-sm">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.desc}</span>
                  <span className="text-xs text-muted-foreground/70">{notification.time}</span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 pl-2 pr-3">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{session?.name ?? 'Admin User'}</span>
                <span className="text-[10px] text-muted-foreground capitalize">
                  {session?.role ?? 'admin'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
