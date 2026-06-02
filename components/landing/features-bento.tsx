'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import * as React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { features } from '@/lib/landing/content'
import { cn } from '@/lib/utils'

export function FeaturesBento() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="mb-12 text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">14+ Modules</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
          Everything your institution runs on
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          A bento-style modular ERP — pick what you need today, scale to enterprise tomorrow.
        </p>
      </motion.div>

      <div ref={ref} className="grid auto-rows-[minmax(140px,auto)] gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.article
            key={feature.name}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.05, duration: 0.45 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br p-6 backdrop-blur-sm transition-shadow hover:shadow-xl',
              feature.gradient,
              feature.span === 'wide' && 'md:col-span-2',
              feature.span === 'tall' && 'md:row-span-2',
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/80 shadow-sm ring-1 ring-border/60">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                {feature.metric}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold">{feature.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            <Link
              href="/get-started?plan=professional"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100"
            >
              Learn more
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
