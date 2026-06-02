'use client'

import { motion, useInView } from 'framer-motion'
import * as React from 'react'
import { Quote } from 'lucide-react'
import { testimonials } from '@/lib/landing/content'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function TestimonialsSection() {
  const ref = React.useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="mb-12 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Loved by school leaders</h2>
        <p className="mt-2 text-muted-foreground">Real outcomes from principals, owners, and admins.</p>
      </motion.div>

      <div ref={ref} className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.blockquote
            key={t.author}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.12 }}
            whileHover={{ scale: 1.02 }}
            className="relative rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur-sm"
          >
            <Quote className="mb-4 h-8 w-8 text-primary/40" />
            <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <footer className="mt-6 flex items-center gap-3 border-t border-border/60 pt-4">
              <Avatar>
                <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
                  {t.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold">{t.author}</p>
                <p className="text-xs text-muted-foreground">
                  {t.role} · {t.school}
                </p>
              </div>
            </footer>
          </motion.blockquote>
        ))}
      </div>
    </section>
  )
}
