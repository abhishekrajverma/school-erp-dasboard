'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  GraduationCap,
  Quote,
  Sparkles,
  Users,
} from 'lucide-react'
import { AnnouncementsList } from '@/components/school-website/announcements-list'
import { FeeStructureTable } from '@/components/school-website/fee-structure-table'
import { PlatformFeaturesSection } from '@/components/school-website/platform-features-section'
import { SchoolHeroBackground } from '@/components/school-website/school-hero-background'
import { SchoolSectionHeader } from '@/components/school-website/school-section-header'
import {
  fadeUp,
  scaleIn,
  slideFromRight,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from '@/components/school-website/school-site-motion'
import { SchoolWebsiteLiveSection } from '@/components/school-website/school-site-shell'
import { Button } from '@/components/ui/button'
import type { SchoolWebsite } from '@/lib/school-website/types'
import { getSchoolWebsitePath } from '@/lib/school-website/utils'

type SchoolHomeContentProps = {
  site: SchoolWebsite
}

const facilityIcons = [Building2, BookOpen, Award, GraduationCap, Users, Sparkles]

export function SchoolHomeContent({ site: initialSite }: SchoolHomeContentProps) {
  return (
    <SchoolWebsiteLiveSection initialSite={initialSite}>
      {(site) => {
        const base = getSchoolWebsitePath(site.slug)
        const stats = [
          { icon: Users, label: 'Students', value: site.studentCount.toLocaleString('en-IN') },
          { icon: GraduationCap, label: 'Teachers', value: site.teacherCount.toLocaleString('en-IN') },
          { icon: Award, label: 'Established', value: String(site.establishedYear) },
          { icon: BookOpen, label: 'Board', value: site.affiliationBoard },
        ]

        return (
          <>
            {/* Hero */}
            <section className="relative min-h-[92vh] overflow-hidden border-b border-border/40">
              <SchoolHeroBackground primaryColor={site.primaryColor} />
              <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16 lg:pt-16">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                  className="space-y-7"
                >
                  <motion.div variants={staggerItem}>
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider backdrop-blur-md"
                      style={{
                        borderColor: `${site.primaryColor}40`,
                        backgroundColor: `${site.primaryColor}12`,
                        color: site.primaryColor,
                      }}
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      {site.affiliationBoard} Affiliated
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={staggerItem}
                    className="school-hero-gradient-text text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]"
                    style={
                      {
                        '--school-gradient-from': site.primaryColor,
                        '--school-gradient-to': `${site.primaryColor}88`,
                      } as Record<string, string>
                    }
                  >
                    {site.schoolName}
                  </motion.h1>

                  <motion.p
                    variants={staggerItem}
                    className="max-w-xl text-lg leading-relaxed text-muted-foreground"
                  >
                    {site.tagline}
                  </motion.p>

                  <motion.div variants={staggerItem} className="flex flex-wrap gap-3">
                    {site.admissionOpen && (
                      <Button
                        asChild
                        size="lg"
                        className="h-12 gap-2 px-6 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          backgroundColor: site.primaryColor,
                          boxShadow: `0 12px 40px -8px ${site.primaryColor}55`,
                        }}
                      >
                        <Link href={`${base}/admissions`}>
                          Admissions Open
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-12 border-border/80 bg-background/60 px-6 backdrop-blur-sm transition-transform hover:scale-[1.02]"
                    >
                      <Link href={`${base}/fees`}>View Fee Structure</Link>
                    </Button>
                  </motion.div>

                  <motion.div variants={staggerItem} className="flex flex-wrap gap-2 pt-1">
                    {[site.city, site.affiliationBoard, `Est. ${site.establishedYear}`].map((chip) => (
                      <span
                        key={chip}
                        className="rounded-full border border-border/60 bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
                      >
                        {chip}
                      </span>
                    ))}
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={slideFromRight}
                  className="relative"
                >
                  <div className="school-hero-card-glow absolute -inset-4 rounded-3xl opacity-60" style={{ background: `radial-gradient(circle, ${site.primaryColor}25, transparent 70%)` }} />
                  <div className="school-glass-card relative overflow-hidden rounded-3xl border border-white/10 p-6 shadow-2xl sm:p-8">
                    <div
                      className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl"
                      style={{ backgroundColor: `${site.primaryColor}30` }}
                    />
                    <p className="text-sm font-medium text-muted-foreground">Campus at a glance</p>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      animate="show"
                      transition={{ delayChildren: 0.35 }}
                      className="mt-5 grid grid-cols-2 gap-3"
                    >
                      {stats.map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          variants={staggerItem}
                          whileHover={{ y: -4, scale: 1.02 }}
                          className="group rounded-2xl border border-border/50 bg-background/80 p-4 backdrop-blur-sm transition-shadow hover:shadow-md"
                        >
                          <stat.icon
                            className="mb-3 h-5 w-5 transition-transform group-hover:scale-110"
                            style={{ color: site.primaryColor }}
                          />
                          <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                          <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                    {site.admissionOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="mt-5 flex items-center justify-between rounded-xl px-4 py-3 text-sm"
                        style={{ backgroundColor: `${site.primaryColor}15` }}
                      >
                        <span className="font-medium">Applications open</span>
                        <span className="font-semibold" style={{ color: site.primaryColor }}>
                          Apply →
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <motion.div
                    className="school-float-badge absolute -bottom-4 -left-4 hidden rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-md sm:flex sm:items-center sm:gap-3"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-white"
                      style={{ backgroundColor: site.primaryColor }}
                    >
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Trusted by families</p>
                      <p className="text-sm font-semibold">{site.studentCount.toLocaleString('en-IN')}+ students</p>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            {/* About */}
            <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
              <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <SchoolSectionHeader
                  label="Who we are"
                  title="About Our School"
                  description={site.about}
                  accentColor={site.primaryColor}
                />
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  variants={scaleIn}
                  className="school-glass-card relative overflow-hidden rounded-3xl border border-border/50 p-8"
                >
                  <Quote
                    className="absolute right-6 top-6 h-12 w-12 opacity-[0.08]"
                    style={{ color: site.primaryColor }}
                  />
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    From the Principal
                  </p>
                  <p className="mt-3 text-xl font-semibold">{site.principalName}</p>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{site.principalMessage}</p>
                  <Button asChild variant="link" className="mt-6 h-auto p-0 font-semibold" style={{ color: site.primaryColor }}>
                    <Link href={`${base}/about`}>
                      Read full message
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </section>

            {/* Digital platform — parents, app, portals */}
            <PlatformFeaturesSection
              schoolName={site.schoolName}
              primaryColor={site.primaryColor}
              slug={site.slug}
              compact
            />

            {/* Fees */}
            <section className="relative overflow-hidden border-y border-border/40 py-20">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{ background: `linear-gradient(180deg, ${site.primaryColor}08, transparent)` }}
              />
              <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
                <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
                  <SchoolSectionHeader
                    label="Transparency"
                    title="Fee Structure"
                    description="Clear, published fees for the current academic session"
                    accentColor={site.primaryColor}
                  />
                  <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={viewportOnce}>
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href={`${base}/fees`}>View all fees</Link>
                    </Button>
                  </motion.div>
                </div>
                <motion.div
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  variants={fadeUp}
                >
                  <FeeStructureTable fees={site.feeStructure.slice(0, 5)} accentColor={site.primaryColor} animated />
                </motion.div>
              </div>
            </section>

            {/* Facilities */}
            <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
              <SchoolSectionHeader
                label="Campus"
                title="World-Class Facilities"
                description="Spaces designed for learning, creativity, and wellbeing"
                accentColor={site.primaryColor}
                align="center"
              />
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >
                {site.facilities.map((facility, i) => {
                  const Icon = facilityIcons[i % facilityIcons.length]
                  return (
                    <motion.div
                      key={facility}
                      variants={staggerItem}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card/80 p-4 backdrop-blur-sm transition-shadow hover:border-border hover:shadow-lg"
                    >
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${site.primaryColor}18`, color: site.primaryColor }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{facility}</span>
                    </motion.div>
                  )
                })}
              </motion.div>
            </section>

            {/* Announcements */}
            <section className="border-t border-border/40 bg-muted/20 py-20">
              <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <SchoolSectionHeader
                  label="Updates"
                  title="Latest Announcements"
                  accentColor={site.primaryColor}
                />
                <motion.div
                  className="mt-10"
                  initial="hidden"
                  whileInView="show"
                  viewport={viewportOnce}
                  variants={fadeUp}
                >
                  <AnnouncementsList
                    announcements={site.announcements}
                    compact
                    viewAllHref={`${base}/announcements`}
                    accentColor={site.primaryColor}
                    animated
                  />
                </motion.div>
              </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                variants={scaleIn}
                className="relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-16"
                style={{
                  background: `linear-gradient(135deg, ${site.primaryColor} 0%, ${site.primaryColor}bb 50%, ${site.primaryColor}88 100%)`,
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_50%)]" />
                <motion.div
                  className="relative space-y-4"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewportOnce}
                  transition={{ delay: 0.15 }}
                >
                  <h2 className="text-3xl font-bold text-white sm:text-4xl">
                    Ready to join {site.schoolName}?
                  </h2>
                  <p className="mx-auto max-w-xl text-white/90">
                    Explore admissions, review fees, or visit our office during {site.officeHours}.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <Button asChild size="lg" variant="secondary" className="h-12 px-8 shadow-lg">
                      <Link href={`${base}/admissions`}>Start Admission</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-12 border-white/40 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20"
                    >
                      <Link href={`${base}/features`}>Parent App & Portal</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-12 border-white/40 bg-white/10 px-8 text-white backdrop-blur-sm hover:bg-white/20"
                    >
                      <Link href={`${base}/contact`}>Contact Us</Link>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </section>
          </>
        )
      }}
    </SchoolWebsiteLiveSection>
  )
}
