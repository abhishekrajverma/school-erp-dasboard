'use client'

import * as React from 'react'
import { Suspense } from 'react'
import type { ActiveFestival, FestivalEffect } from '@/lib/festivals/types'
import { isFestivalEffectsEnabled, setFestivalEffectsEnabled } from '@/lib/festivals/storage'
import { useActiveFestival } from '@/hooks/use-active-festival'
import { useNavbarBirthdayGreeting } from '@/hooks/use-navbar-birthday-greeting'
import { cn } from '@/lib/utils'

const NAV_STYLES: Partial<Record<FestivalEffect, string>> = {
  holi: 'border-pink-500/35 bg-pink-500/10',
  diwali: 'border-amber-500/35 bg-amber-500/10',
  patriotic: 'border-orange-500/30 bg-linear-to-r from-orange-500/10 via-white/5 to-green-600/10',
  spring: 'border-rose-400/30 bg-rose-400/10',
  sparkle: 'border-violet-500/30 bg-violet-500/10',
}

type FestivalNavBadgeProps = {
  festival: ActiveFestival
  className?: string
}

export function FestivalNavBadge({ festival, className }: FestivalNavBadgeProps) {
  const isHoli = festival.effect === 'holi'

  return (
    <NavCelebrationBadge
      emoji={festival.emoji}
      message={festival.greeting}
      className={cn(
        NAV_STYLES[festival.effect] ?? 'border-primary/30 bg-primary/10',
        isHoli && 'festival-nav-holi',
        className,
      )}
      messageClassName={cn(
        isHoli && 'festival-nav-holi-text bg-linear-to-r from-pink-500 via-amber-400 to-emerald-500 bg-clip-text text-transparent',
      )}
    />
  )
}

type NavCelebrationBadgeProps = {
  emoji: string
  message: string
  className?: string
  messageClassName?: string
}

export function NavCelebrationBadge({ emoji, message, className, messageClassName }: NavCelebrationBadgeProps) {
  return (
    <div
      className={cn(
        'flex max-w-[240px] items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold sm:max-w-none sm:px-3',
        className,
      )}
      role="status"
    >
      <span className="text-sm leading-none" aria-hidden>
        {emoji}
      </span>
      <span className={cn('truncate', messageClassName)}>{message}</span>
    </div>
  )
}

export function BirthdayNavBadge({ message, className }: { message: string; className?: string }) {
  return (
    <NavCelebrationBadge
      emoji="🎂"
      message={message}
      className={cn('border-pink-500/35 bg-pink-500/10', className)}
      messageClassName="text-pink-700 dark:text-pink-200"
    />
  )
}

function NavbarGreetingInner({ className }: { className?: string }) {
  const festival = useActiveFestival()
  const birthday = useNavbarBirthdayGreeting()

  if (festival) return <FestivalNavBadge festival={festival} className={className} />
  if (birthday) return <BirthdayNavBadge message={birthday.message} className={className} />
  return null
}

/** Festival or birthday greeting in the navbar (festival takes priority). */
export function NavbarGreetingContainer({ className }: { className?: string }) {
  return (
    <Suspense fallback={null}>
      <NavbarGreetingInner className={className} />
    </Suspense>
  )
}

function FestivalNavBadgeInner({ className }: { className?: string }) {
  const festival = useActiveFestival()
  if (!festival) return null
  return <FestivalNavBadge festival={festival} className={className} />
}

/** @deprecated Use NavbarGreetingContainer */
export function FestivalNavBadgeContainer({ className }: { className?: string }) {
  return (
    <Suspense fallback={null}>
      <FestivalNavBadgeInner className={className} />
    </Suspense>
  )
}

export function FestivalEffectsToggle({ className }: { className?: string }) {
  const [enabled, setEnabled] = React.useState(true)

  React.useEffect(() => {
    setEnabled(isFestivalEffectsEnabled())
  }, [])

  return (
    <label className={cn('flex cursor-pointer items-center gap-2 text-sm', className)}>
      <input
        type="checkbox"
        checked={enabled}
        onChange={(event) => {
          const next = event.target.checked
          setEnabled(next)
          setFestivalEffectsEnabled(next)
        }}
        className="h-4 w-4 rounded border-input"
      />
      <span>Festival navbar greetings</span>
    </label>
  )
}
