'use client'

import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from './school-site-motion'

type SchoolSectionHeaderProps = {
  label?: string
  title: string
  description?: string
  accentColor?: string
  align?: 'left' | 'center'
}

export function SchoolSectionHeader({
  label,
  title,
  description,
  accentColor,
  align = 'left',
}: SchoolSectionHeaderProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      variants={fadeUp}
      className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {label && (
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-[0.2em]"
          style={accentColor ? { color: accentColor } : undefined}
        >
          {label}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
      )}
    </motion.div>
  )
}
