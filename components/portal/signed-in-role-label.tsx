'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

const ease = [0.22, 1, 0.36, 1] as const

export function SignedInRoleLabel({ roleLabel }: { roleLabel: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.p
      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
      className="flex flex-wrap items-baseline gap-x-1.5 text-sm text-muted-foreground"
    >
      <motion.span
        initial={reduceMotion ? false : { opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08, duration: 0.4, ease }}
      >
        Signed in as
      </motion.span>
      <span className="relative inline-flex pb-0.5">
        {!reduceMotion && (
          <span
            className="pointer-events-none absolute -bottom-px left-0 h-[2px] w-full origin-left rounded-full bg-linear-to-r from-transparent via-primary/70 to-transparent landing-hero-accent-line"
            aria-hidden
          />
        )}
        <motion.span
          key={roleLabel}
          initial={reduceMotion ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.2, duration: 0.5, ease }}
          className={cn(
            'relative font-semibold',
            reduceMotion ? 'text-foreground' : 'portal-role-shimmer',
          )}
        >
          {roleLabel}
        </motion.span>
      </span>
    </motion.p>
  )
}
