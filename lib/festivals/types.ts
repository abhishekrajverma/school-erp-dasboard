export type FestivalEffect = 'holi' | 'diwali' | 'patriotic' | 'sparkle' | 'spring'

export type FestivalDefinition = {
  id: string
  name: string
  greeting: string
  effect: FestivalEffect
  emoji: string
  /** Show effect this many days before and after the festival date(s). */
  windowDays: number
  /** Same date every year (1–12 month, day). */
  fixedDate?: { month: number; day: number }
  /** Lunar / movable festivals — ISO date ranges per year. */
  yearlyRanges?: Record<number, { start: string; end: string }>
}

export type ActiveFestival = FestivalDefinition & {
  year: number
}

export const FESTIVAL_PREFERENCE_KEY = 'edusync-festival-effects-enabled'
