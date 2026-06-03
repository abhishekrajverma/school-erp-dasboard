'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { hero, trustBadges } from '@/lib/landing/content'
import { DashboardMockup } from './dashboard-mockup'
import { RotatingHeroText } from './rotating-hero-text'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden pt-16">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-12 md:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:pt-20">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-7">
          <motion.div variants={item}>
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium backdrop-blur-sm"
            >
              <Sparkles className="h-3 w-3 text-primary" />
              {hero.badge}
            </Badge>
          </motion.div>

          <motion.h1
            variants={item}
            className="text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl"
          >
            <span className="block sm:inline">Run Your Entire School From One</span>{' '}
            <RotatingHeroText
              words={hero.headlineRotations}
              className="mt-1 block sm:mt-0 sm:inline-block"
            />
          </motion.h1>

          <motion.p variants={item} className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {hero.subheadline}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <Button size="lg" className="h-12 gap-2 px-6 shadow-xl shadow-primary/25" asChild>
              <Link href="/get-started?plan=professional">
                {hero.primaryCta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 gap-2 border-border/80 bg-background/50 backdrop-blur-sm" asChild>
              <Link href="/dashboard">
                <Play className="h-4 w-4 fill-current" />
                {hero.secondaryCta}
              </Link>
            </Button>
          </motion.div>

          <motion.p variants={item} className="text-xs text-muted-foreground">
            {hero.note}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-2 pt-2">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.06 }}
              >
                <Badge
                  variant="secondary"
                  className="gap-1.5 rounded-full border border-border/60 bg-card/60 px-3 py-1.5 text-[11px] font-normal backdrop-blur-sm"
                >
                  <badge.icon className="h-3 w-3 text-primary" />
                  {badge.label}
                </Badge>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <div className="relative lg:pl-4">
          <DashboardMockup />
        </div>
      </div>
    </section>
  )
}
