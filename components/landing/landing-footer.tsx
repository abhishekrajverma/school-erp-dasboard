'use client'

import Link from 'next/link'
import { Bot, Database, ShieldCheck, Sparkles } from 'lucide-react'
import { brand } from '@/lib/landing/content'

export function LandingFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold">{brand.name} ERP</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-muted-foreground">{brand.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-semibold">Product</p>
              <a href="#features" className="block text-muted-foreground hover:text-foreground">
                Features
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-foreground">
                Pricing
              </a>
              <Link href="/dashboard" className="block text-muted-foreground hover:text-foreground">
                Dashboard
              </Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Account</p>
              <Link href="/login" className="block text-muted-foreground hover:text-foreground">
                Login
              </Link>
              <Link href="/get-started" className="block text-muted-foreground hover:text-foreground">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-primary" /> SOC-ready
            </span>
            <span className="inline-flex items-center gap-1">
              <Database className="h-4 w-4 text-primary" /> Multi-tenant
            </span>
            <span className="inline-flex items-center gap-1">
              <Bot className="h-4 w-4 text-primary" /> AI insights
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
