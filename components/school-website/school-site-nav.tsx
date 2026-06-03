'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { SchoolWebsite } from '@/lib/school-website/types'
import { getSchoolWebsitePath } from '@/lib/school-website/utils'

type SchoolSiteNavProps = {
  site: SchoolWebsite
}

const navItems = [
  { label: 'Home', segment: '' },
  { label: 'About', segment: 'about' },
  { label: 'For Parents', segment: 'features' },
  { label: 'Fees', segment: 'fees' },
  { label: 'Admissions', segment: 'admissions' },
  { label: 'Contact', segment: 'contact' },
] as const

export function SchoolSiteNav({ site }: SchoolSiteNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const base = getSchoolWebsitePath(site.slug)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (segment: string) => {
    const href = segment ? `${base}/${segment}` : base
    return pathname === href
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/50 bg-background/80 shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-background/40 backdrop-blur-md',
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={base} className="group flex min-w-0 items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-md"
            style={{ backgroundColor: site.primaryColor, boxShadow: `0 8px 24px -6px ${site.primaryColor}55` }}
          >
            {site.schoolName.slice(0, 2).toUpperCase()}
          </motion.div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold transition-colors group-hover:text-foreground sm:text-base">
              {site.schoolName}
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">{site.tagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => {
            const href = item.segment ? `${base}/${item.segment}` : base
            const active = isActive(item.segment)
            return (
              <Link
                key={item.segment}
                href={href}
                className={cn(
                  'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="school-nav-pill"
                    className="absolute inset-0 rounded-lg"
                    style={{ backgroundColor: `${site.primaryColor}18` }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10" style={active ? { color: site.primaryColor } : undefined}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {site.admissionOpen && (
            <Button
              asChild
              size="sm"
              className="text-white shadow-md transition-transform hover:scale-[1.02]"
              style={{ backgroundColor: site.primaryColor }}
            >
              <Link href={`${base}/admissions`}>Apply Now</Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" className="bg-background/60 backdrop-blur-sm">
            <Link href="/login">Portal Login</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/50 md:hidden"
          >
            <nav className="flex flex-col gap-1 bg-background/95 px-4 py-3 backdrop-blur-xl">
              {navItems.map((item, i) => {
                const href = item.segment ? `${base}/${item.segment}` : base
                return (
                  <motion.div
                    key={item.segment}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'block rounded-lg px-3 py-2.5 text-sm font-medium',
                        isActive(item.segment) ? 'bg-muted' : 'text-muted-foreground',
                      )}
                      style={isActive(item.segment) ? { color: site.primaryColor } : undefined}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
