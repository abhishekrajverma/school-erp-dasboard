'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Calendar,
  Clock,
  MapPin,
  Users,
  GraduationCap,
  PartyPopper,
  Palmtree,
  Trophy,
  CreditCard,
  Info,
  Pin,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs } from '@/components/shared/page-components'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  getParentNoticesRich,
  getNoticeTypeLabel,
  type ParentNotice,
  type ParentNoticeType,
} from '@/lib/parent-notices'

const typeConfig: Record<
  ParentNoticeType,
  {
    icon: React.ComponentType<{ className?: string }>
    gradient: string
    border: string
    badge: string
  }
> = {
  ptm: {
    icon: Users,
    gradient: 'from-violet-500/15 via-violet-500/5 to-transparent',
    border: 'border-violet-500/25',
    badge: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  },
  event: {
    icon: PartyPopper,
    gradient: 'from-pink-500/15 via-pink-500/5 to-transparent',
    border: 'border-pink-500/25',
    badge: 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
  },
  holiday: {
    icon: Palmtree,
    gradient: 'from-amber-500/15 via-amber-500/5 to-transparent',
    border: 'border-amber-500/25',
    badge: 'bg-amber-500/15 text-amber-800 dark:text-amber-200',
  },
  academic: {
    icon: GraduationCap,
    gradient: 'from-blue-500/15 via-blue-500/5 to-transparent',
    border: 'border-blue-500/25',
    badge: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  },
  fee: {
    icon: CreditCard,
    gradient: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
    border: 'border-emerald-500/25',
    badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  },
  sports: {
    icon: Trophy,
    gradient: 'from-orange-500/15 via-orange-500/5 to-transparent',
    border: 'border-orange-500/25',
    badge: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  },
  general: {
    icon: Info,
    gradient: 'from-slate-500/15 via-slate-500/5 to-transparent',
    border: 'border-border',
    badge: 'bg-muted text-muted-foreground',
  },
}

const priorityStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  low: 'bg-muted text-muted-foreground border-border',
}

type FilterId = 'all' | ParentNoticeType

function NoticeHeroBlock({ notice }: { notice: ParentNotice }) {
  const isPtm = notice.type === 'ptm'
  const dateDetail = notice.details.find((d) => d.label === 'Date')
  const timeDetail =
    notice.details.find((d) => d.label === 'Meeting hours') ??
    notice.details.find((d) => d.label === 'Programme start') ??
    notice.details.find((d) => d.label === 'Reporting time')
  const venueDetail = notice.details.find((d) => d.label === 'Venue')

  return (
    <div
      className={cn(
        'grid gap-3 rounded-xl border border-border/60 bg-background/80 p-4 sm:grid-cols-3',
        isPtm && 'border-violet-500/30 bg-violet-500/5',
      )}
    >
      <div className="flex items-start gap-3 sm:col-span-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {isPtm ? 'PTM date' : 'Key date'}
          </p>
          <p className="font-semibold leading-snug">
            {dateDetail?.value ?? formatDate(notice.eventDate)}
          </p>
          {notice.eventEndDate && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Until {formatDate(notice.eventEndDate)}
            </p>
          )}
        </div>
      </div>
      {timeDetail && (
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Timing
            </p>
            <p className="text-sm font-medium leading-snug">{timeDetail.value}</p>
          </div>
        </div>
      )}
      {venueDetail && (
        <div className="flex items-start gap-3 sm:col-span-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Venue
            </p>
            <p className="text-sm font-medium leading-snug">{venueDetail.value}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function NoticeCard({
  notice,
  index,
  onFeeAction,
}: {
  notice: ParentNotice
  index: number
  onFeeAction?: () => void
}) {
  const config = typeConfig[notice.type]
  const Icon = config.icon
  const [expanded, setExpanded] = React.useState(notice.isPinned ?? false)

  const heroLabels = new Set(['Date', 'Meeting hours', 'Programme start', 'Reporting time', 'Venue'])
  const detailRows = notice.details.filter((d) => !heroLabels.has(d.label))

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className={cn('overflow-hidden transition-shadow hover:shadow-lg', config.border)}>
        <div className={cn('bg-linear-to-br px-5 py-4', config.gradient)}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex gap-3 min-w-0">
              <div
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                  config.badge,
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {notice.isPinned && (
                    <Badge variant="outline" className="gap-1 text-[10px] h-5 border-primary/40">
                      <Pin className="h-3 w-3" />
                      Pinned
                    </Badge>
                  )}
                  <Badge className={cn('text-[10px] h-5 border-0', config.badge)}>
                    {getNoticeTypeLabel(notice.type)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn('text-[10px] h-5 capitalize', priorityStyles[notice.priority])}
                  >
                    {notice.priority} priority
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold tracking-tight leading-tight pr-2">
                  {notice.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{notice.summary}</p>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground shrink-0">
              <p>Posted {formatDate(notice.publishedDate)}</p>
              <p className="mt-1 flex items-center justify-end gap-1">
                <Users className="h-3 w-3" />
                {notice.audience}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="space-y-4 pt-5">
          <NoticeHeroBlock notice={notice} />

          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="flex w-full items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted/40"
          >
            <span>{expanded ? 'Hide full details' : 'View all details & instructions'}</span>
            <ChevronRight
              className={cn('h-4 w-4 transition-transform', expanded && 'rotate-90')}
            />
          </button>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              {detailRows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 rounded-lg border border-border/50 bg-muted/15 px-4 py-3 sm:grid-cols-[140px_1fr]"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">{row.value}</p>
                </div>
              ))}
            </motion.div>
          )}

          {(notice.actionLabel || notice.actionHint) && (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
              {notice.actionHint && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  {notice.actionHint}
                </p>
              )}
              {notice.actionLabel && (
                <Button
                  size="sm"
                  className="gap-2 shrink-0"
                  onClick={() => {
                    if (notice.type === 'fee' && onFeeAction) onFeeAction()
                  }}
                >
                  {notice.actionLabel}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.article>
  )
}

export function ParentNoticesPanel({ onNavigateToFees }: { onNavigateToFees?: () => void }) {
  const notices = getParentNoticesRich()
  const [filter, setFilter] = React.useState<FilterId>('all')

  const filtered =
    filter === 'all' ? notices : notices.filter((n) => n.type === filter)

  const ptmCount = notices.filter((n) => n.type === 'ptm').length
  const highCount = notices.filter((n) => n.priority === 'high').length

  const filterTabs: { id: FilterId; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: notices.length },
    { id: 'ptm', label: 'PTM', count: ptmCount },
    { id: 'event', label: 'Events', count: notices.filter((n) => n.type === 'event').length },
    { id: 'academic', label: 'Academic', count: notices.filter((n) => n.type === 'academic').length },
    { id: 'fee', label: 'Fees', count: notices.filter((n) => n.type === 'fee').length },
    { id: 'sports', label: 'Sports', count: notices.filter((n) => n.type === 'sports').length },
    { id: 'holiday', label: 'Holidays', count: notices.filter((n) => n.type === 'holiday').length },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            School notices
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Dates, timings, venues, and instructions — everything you need in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            {highCount} high priority
          </Badge>
          {ptmCount > 0 && (
            <Badge className={cn('text-sm px-3 py-1 border-0', typeConfig.ptm.badge)}>
              {ptmCount} PTM scheduled
            </Badge>
          )}
        </div>
      </div>

      <Tabs
        tabs={filterTabs}
        activeTab={filter}
        onChange={(id) => setFilter(id as FilterId)}
      />

      <div className="space-y-5">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No notices in this category.
            </CardContent>
          </Card>
        ) : (
          filtered.map((notice, index) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              index={index}
              onFeeAction={onNavigateToFees}
            />
          ))
        )}
      </div>
    </div>
  )
}
