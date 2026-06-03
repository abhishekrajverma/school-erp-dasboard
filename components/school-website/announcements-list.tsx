'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/format'
import type { SchoolAnnouncement } from '@/lib/school-website/types'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem, viewportOnce } from './school-site-motion'

const categoryStyles: Record<SchoolAnnouncement['category'], string> = {
  general: 'bg-slate-500/10 text-slate-700 dark:text-slate-300',
  exam: 'bg-blue-500/10 text-blue-700 dark:text-blue-300',
  holiday: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
  admission: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
  event: 'bg-violet-500/10 text-violet-800 dark:text-violet-300',
}

type AnnouncementsListProps = {
  announcements: SchoolAnnouncement[]
  compact?: boolean
  viewAllHref?: string
  accentColor?: string
  animated?: boolean
}

export function AnnouncementsList({
  announcements,
  compact,
  viewAllHref,
  accentColor,
  animated,
}: AnnouncementsListProps) {
  const items = compact ? announcements.slice(0, 3) : announcements

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No announcements at the moment.</p>
  }

  const Container = animated ? motion.div : 'div'
  const containerProps = animated
    ? {
        variants: staggerContainer,
        initial: 'hidden' as const,
        whileInView: 'show' as const,
        viewport: viewportOnce,
        className: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
      }
    : { className: 'space-y-3' }

  return (
    <div className="space-y-4">
      <Container {...containerProps}>
        {items.map((item) => {
          const Article = animated ? motion.article : 'article'
          const articleProps = animated
            ? {
                variants: staggerItem,
                whileHover: { y: -4, transition: { duration: 0.2 } },
              }
            : {}

          return (
            <Article
              key={item.id}
              {...articleProps}
              className="group flex h-full flex-col rounded-2xl border border-border/50 bg-card/90 p-5 backdrop-blur-sm transition-shadow hover:border-border hover:shadow-lg"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', categoryStyles[item.category])}
                  style={
                    item.category === 'admission' && accentColor
                      ? { backgroundColor: `${accentColor}18`, color: accentColor }
                      : undefined
                  }
                >
                  {item.category}
                </span>
                <time className="text-xs text-muted-foreground">{formatDate(item.date)}</time>
              </div>
              <h3 className="font-semibold leading-snug group-hover:text-foreground">{item.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
              {!compact && item.body && (
                <p className="mt-3 text-sm leading-relaxed">{item.body}</p>
              )}
            </Article>
          )
        })}
      </Container>
      {compact && viewAllHref && announcements.length > 0 && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-80"
          style={accentColor ? { color: accentColor } : undefined}
        >
          View all announcements
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
