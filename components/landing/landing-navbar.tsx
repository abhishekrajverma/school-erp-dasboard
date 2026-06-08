'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, Moon, Sparkles, Sun, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { brand } from '@/lib/landing/content'
import { salesContact } from '@/lib/landing/sales'
import { NavbarGreetingContainer } from '@/components/festivals/festival-greeting'
import { cn } from '@/lib/utils'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Stories' },
  { href: '#faq', label: 'FAQ' },
]

export function LandingNavbar() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border/60 bg-background/85 shadow-sm backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 shadow-lg shadow-primary/25">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">{brand.name}</span>
            <span className="hidden text-[10px] text-muted-foreground sm:block">{brand.tagline}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavbarGreetingContainer className="hidden sm:flex" />
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          )}
          <Button variant="ghost" className="hidden sm:inline-flex" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button className="hidden sm:inline-flex shadow-lg shadow-primary/20" asChild>
            <Link href="/get-started?plan=professional">{salesContact.cta}</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-border/60 bg-background/95 px-4 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
            <Button asChild className="mt-2">
              <Link href="/get-started?plan=professional">{salesContact.cta}</Link>
            </Button>
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}
