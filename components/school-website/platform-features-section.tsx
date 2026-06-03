'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Monitor, Smartphone } from 'lucide-react'
import { ParentAppPreview } from '@/components/school-website/parent-app-preview'
import { SchoolSectionHeader } from '@/components/school-website/school-section-header'
import {
  fadeUp,
  staggerContainer,
  staggerItem,
  viewportOnce,
} from '@/components/school-website/school-site-motion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  accessSteps,
  getFeaturesForAudience,
  parentAppHighlights,
  platformAudiences,
  type PlatformAudienceId,
} from '@/lib/school-website/platform-features'
import { getSchoolWebsitePath } from '@/lib/school-website/utils'

type PlatformFeaturesSectionProps = {
  schoolName: string
  primaryColor: string
  slug: string
  compact?: boolean
}

export function PlatformFeaturesSection({
  schoolName,
  primaryColor,
  slug,
  compact = false,
}: PlatformFeaturesSectionProps) {
  const base = getSchoolWebsitePath(slug)
  const [audience, setAudience] = React.useState<PlatformAudienceId>('parents')
  const activeAudience = platformAudiences.find((a) => a.id === audience)!
  const features = getFeaturesForAudience(audience)

  return (
    <section className="relative overflow-hidden border-y border-border/40 py-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(ellipse 70% 50% at 50% 0%, ${primaryColor}12, transparent)` }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SchoolSectionHeader
          label="Digital campus"
          title="Everything families need — online & on mobile"
          description={`${schoolName} uses a modern school platform so parents can track attendance, pay fees, follow the bus, and stay updated without phone calls to the office.`}
          accentColor={primaryColor}
          align="center"
        />

        {/* Parent spotlight */}
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="order-2 lg:order-1"
          >
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
              >
                <Monitor className="h-3.5 w-3.5" />
                Parent Dashboard (Web)
              </span>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card/80 px-3 py-1 text-xs font-semibold"
              >
                <Smartphone className="h-3.5 w-3.5" />
                Mobile App (iOS & Android)
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
              Track your child from anywhere
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Log in once to see all your children. Check today&apos;s attendance, pending fees, homework,
              exam results, and bus location — the same information on your laptop or phone.
            </p>

            <ul className="mt-6 space-y-3">
              {parentAppHighlights.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <div
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="gap-2 text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Link href="/login">
                  Parent Portal Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              {!compact && (
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={`${base}/features`}>See all digital tools</Link>
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            variants={fadeUp}
            className="order-1 flex justify-center lg:order-2"
          >
            <ParentAppPreview schoolName={schoolName} primaryColor={primaryColor} />
          </motion.div>
        </div>

        {/* Audience tabs + feature cards */}
        {!compact && (
          <>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              className="mt-20"
            >
              <p className="text-center text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                Built for everyone at school
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {platformAudiences.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAudience(a.id)}
                    className={cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-all',
                      audience === a.id
                        ? 'text-white shadow-md'
                        : 'border border-border/60 bg-card/80 text-muted-foreground hover:text-foreground',
                    )}
                    style={
                      audience === a.id
                        ? { backgroundColor: primaryColor, boxShadow: `0 8px 24px -8px ${primaryColor}55` }
                        : undefined
                    }
                  >
                    {a.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={audience}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="mx-auto mt-8 max-w-2xl text-center"
                >
                  <h3 className="text-xl font-bold">{activeAudience.headline}</h3>
                  <p className="mt-2 text-muted-foreground">{activeAudience.description}</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mt-10 grid gap-4 sm:grid-cols-2"
            >
              <AnimatePresence mode="popLayout">
                {features.map((feature) => (
                  <motion.article
                    key={feature.id}
                    layout
                    variants={staggerItem}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileHover={{ y: -4 }}
                    className="school-glass-card rounded-2xl border border-border/50 p-6"
                  >
                    <div
                      className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h4 className="text-lg font-semibold">{feature.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.summary}</p>
                    <ul className="mt-4 space-y-2">
                      {feature.details.map((line) => (
                        <li key={line} className="flex gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* How to access */}
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              variants={fadeUp}
              className="mt-20 rounded-3xl border border-border/50 bg-muted/25 p-8 sm:p-10"
            >
              <h3 className="text-center text-2xl font-bold">How to get started</h3>
              <p className="mx-auto mt-2 max-w-xl text-center text-muted-foreground">
                New parents receive login details from the school office. Existing families can reset passwords at reception.
              </p>
              <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {accessSteps.map((item) => (
                  <div key={item.step} className="relative text-center">
                    <div
                      className="mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {item.step}
                    </div>
                    <p className="mt-4 font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <Button asChild variant="outline">
                  <Link href={`${base}/contact`}>Need help? Contact school</Link>
                </Button>
                <Button asChild style={{ backgroundColor: primaryColor }} className="text-white">
                  <Link href="/login">Go to Portal Login</Link>
                </Button>
              </div>
            </motion.div>
          </>
        )}

        {compact && (
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`${base}/features`}>
                Explore all features
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
