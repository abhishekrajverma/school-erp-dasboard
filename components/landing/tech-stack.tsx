'use client'

import { motion, useInView } from 'framer-motion'
import * as React from 'react'
import { Cpu } from 'lucide-react'
import { techStack } from '@/lib/landing/content'

export function TechStack() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section className="border-y border-border/60 bg-muted/20 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="mb-10 flex flex-col items-center text-center"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Cpu className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Built on modern infrastructure</h2>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            Enterprise-grade stack for speed, security, and scale — the same patterns used by top SaaS products.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm transition hover:border-primary/30"
            >
              <div className="h-2 w-2 rounded-full bg-chart-2 shadow-[0_0_8px_var(--chart-2)]" />
              <div>
                <p className="font-semibold">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{tech.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
