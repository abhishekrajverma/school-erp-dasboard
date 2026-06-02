'use client'

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { stats } from '@/lib/landing/content'
import { useCounter } from './use-counter'

function StatCard({
  value,
  suffix,
  label,
  detail,
  index,
}: {
  value: number
  suffix: string
  label: string
  detail: string
  index: number
}) {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const count = useCounter(value, 2200, inView)
  const display =
    suffix === '+'
      ? `${Math.round(count)}+`
      : suffix === 'M+'
        ? `${count.toFixed(1)}M+`
        : suffix === 'Cr+'
          ? `${Math.round(count)}Cr+`
          : `${Math.round(count)}${suffix}`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/80 p-6 backdrop-blur-sm transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/20" />
      <p className="text-3xl font-bold tracking-tight md:text-4xl">{display}</p>
      <p className="mt-1 font-medium">{label}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
    </motion.div>
  )
}

export function StatsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            detail={stat.detail}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}
