'use client'

import * as React from 'react'
import { mergeSchoolWebsiteWithOverrides } from '@/lib/school-website'
import type { SchoolWebsite } from '@/lib/school-website/types'
import { SchoolSiteNav } from './school-site-nav'
import { SchoolSiteFooter } from './school-site-footer'

type SchoolSiteShellProps = {
  site: SchoolWebsite
  children: React.ReactNode
}

export function SchoolSiteShell({ site: initialSite, children }: SchoolSiteShellProps) {
  const [site, setSite] = React.useState(initialSite)

  React.useEffect(() => {
    setSite(mergeSchoolWebsiteWithOverrides(initialSite))
  }, [initialSite.slug])

  return (
    <div
      className="school-site-root min-h-screen bg-background text-foreground"
      style={{ ['--school-primary' as string]: site.primaryColor }}
    >
      <div className="relative z-10 flex min-h-screen flex-col">
        <SchoolSiteNav site={site} />
        <main className="flex-1">
          <SchoolWebsiteContext.Provider value={site}>{children}</SchoolWebsiteContext.Provider>
        </main>
        <SchoolSiteFooter site={site} />
      </div>
    </div>
  )
}

const SchoolWebsiteContext = React.createContext<SchoolWebsite | null>(null)

export function useSchoolWebsiteContext() {
  const ctx = React.useContext(SchoolWebsiteContext)
  if (!ctx) throw new Error('useSchoolWebsiteContext must be used within SchoolSiteShell')
  return ctx
}

export function SchoolWebsiteLiveSection({
  initialSite,
  children,
}: {
  initialSite: SchoolWebsite
  children: (site: SchoolWebsite) => React.ReactNode
}) {
  const [site, setSite] = React.useState(initialSite)

  React.useEffect(() => {
    setSite(mergeSchoolWebsiteWithOverrides(initialSite))
  }, [initialSite.slug])

  return <>{children(site)}</>
}
