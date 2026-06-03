'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Download, Laptop, Smartphone } from 'lucide-react'
import { PlatformFeaturesSection } from '@/components/school-website/platform-features-section'
import { SchoolHeroBackground } from '@/components/school-website/school-hero-background'
import { SchoolSectionHeader } from '@/components/school-website/school-section-header'
import { fadeUp, viewportOnce } from '@/components/school-website/school-site-motion'
import { Button } from '@/components/ui/button'
import { PORTAL_ROUTES } from '@/lib/constants/routes'
import type { SchoolWebsite } from '@/lib/school-website/types'
import { getSchoolWebsitePath } from '@/lib/school-website/utils'

type SchoolFeaturesPageProps = {
  site: SchoolWebsite
}

const portalLinks = [
  { label: 'Parent Portal', href: PORTAL_ROUTES.parent, desc: 'Fees, attendance, bus, notices' },
  { label: 'Student Portal', href: PORTAL_ROUTES.student, desc: 'Timetable, homework, results' },
  { label: 'Teacher Portal', href: PORTAL_ROUTES.teacher, desc: 'Classes, marks, messaging' },
]

export function SchoolFeaturesPage({ site }: SchoolFeaturesPageProps) {
  const base = getSchoolWebsitePath(site.slug)

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/40 pb-16 pt-12">
        <SchoolHeroBackground primaryColor={site.primaryColor} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="mx-auto max-w-3xl text-center"
          >
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.2em]"
              style={{ color: site.primaryColor }}
            >
              Digital campus at {site.schoolName}
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Smart tools for parents, students & staff
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Our school runs on a connected platform. Parents use a web dashboard and mobile app to
              track children in real time. Students and teachers have their own secure portals too.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="gap-2 text-white"
                style={{ backgroundColor: site.primaryColor }}
              >
                <Link href="/login">
                  <Laptop className="h-4 w-4" />
                  Portal Login
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href={`${base}/contact`}>
                  Get login help
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <PlatformFeaturesSection
        schoolName={site.schoolName}
        primaryColor={site.primaryColor}
        slug={site.slug}
      />

      {/* Portal + App download */}
      <section className="border-t border-border/40 bg-muted/20 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              className="school-glass-card rounded-3xl border border-border/50 p-8"
            >
              <Laptop className="h-8 w-8" style={{ color: site.primaryColor }} />
              <h2 className="mt-4 text-2xl font-bold">Web portals</h2>
              <p className="mt-2 text-muted-foreground">
                Open any browser, go to Portal Login, and sign in with credentials from the school office.
              </p>
              <ul className="mt-6 space-y-4">
                {portalLinks.map((portal) => (
                  <li key={portal.href}>
                    <Link
                      href={portal.href}
                      className="group flex items-center justify-between rounded-xl border border-border/50 bg-background/60 px-4 py-3 transition-colors hover:border-border"
                    >
                      <div>
                        <p className="font-medium group-hover:underline">{portal.label}</p>
                        <p className="text-sm text-muted-foreground">{portal.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              className="school-glass-card rounded-3xl border border-border/50 p-8"
            >
              <Smartphone className="h-8 w-8" style={{ color: site.primaryColor }} />
              <h2 className="mt-4 text-2xl font-bold">Mobile app for parents</h2>
              <p className="mt-2 text-muted-foreground">
                Download the official school app to get push notifications, pay fees, and track the bus on the go.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>• Same login as the parent web dashboard</li>
                <li>• Real-time alerts for attendance and fees</li>
                <li>• Live bus map when GPS transport is enabled</li>
                <li>• Available on iOS and Android</li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="outline" className="gap-2" disabled>
                  <Download className="h-4 w-4" />
                  App Store (ask school)
                </Button>
                <Button variant="outline" className="gap-2" disabled>
                  <Download className="h-4 w-4" />
                  Google Play (ask school)
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                App links are shared by the school office after admission. Contact reception if you need the download QR code.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
