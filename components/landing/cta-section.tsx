'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import * as React from 'react'
import { ArrowRight, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CtaSection() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 md:px-6">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/20 via-card to-chart-4/10 p-8 md:p-14"
      >
        <div className="landing-gradient-orb absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
        <div className="relative flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/30">
            <Rocket className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
            Launch your branded school portal in under 15 minutes
          </h2>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Join 3,240+ institutions using EduSync for admissions, fees, attendance, and parent engagement — all from one secure cloud ERP.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" className="h-12 gap-2 px-8 shadow-xl shadow-primary/25" asChild>
              <Link href="/get-started?plan=professional">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 bg-background/50" asChild>
              <Link href="/dashboard">View Live Dashboard</Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
