'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import * as React from 'react'
import { Check, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { pricing } from '@/lib/landing/content'
import { salesContact } from '@/lib/landing/sales'
import { cn } from '@/lib/utils'

export function PricingSection() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="pricing" className="relative overflow-hidden border-t border-border/60 py-16 md:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08),transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="mb-12 text-center"
        >
          <Badge variant="outline" className="mb-3 rounded-full">
            <Sparkles className="mr-1 h-3 w-3" />
            Flexible plans
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">Plans that grow with you</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{salesContact.pricingNote}</p>
        </motion.div>

        <div ref={ref} className="grid gap-6 lg:grid-cols-3">
          {pricing.map((plan, i) => (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: plan.highlight ? -8 : -4 }}
              className={cn(
                'relative flex flex-col rounded-2xl border bg-card/90 p-6 backdrop-blur-sm transition-shadow',
                plan.highlight
                  ? 'border-primary shadow-2xl shadow-primary/15 ring-2 ring-primary/20 lg:scale-105'
                  : 'border-border/70 hover:shadow-lg',
              )}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3">
                  Most Popular
                </Badge>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
              <p className="mt-4 text-2xl font-bold tracking-tight text-primary">
                {salesContact.pricingHeadline}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Custom quote for your school size</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-8 w-full"
                variant={plan.highlight ? 'default' : 'outline'}
                size="lg"
                asChild
              >
                <Link href={`/get-started?plan=${plan.key}`}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
