import type { ActiveFestival, FestivalDefinition } from './types'

/** Major Indian festivals — extend yearlyRanges each calendar year. */
export const INDIAN_FESTIVALS: FestivalDefinition[] = [
  {
    id: 'republic-day',
    name: 'Republic Day',
    greeting: 'Happy Republic Day',
    effect: 'patriotic',
    emoji: '🇮🇳',
    windowDays: 2,
    fixedDate: { month: 1, day: 26 },
  },
  {
    id: 'holi',
    name: 'Holi',
    greeting: 'Happy Holi',
    effect: 'holi',
    emoji: '🎨',
    windowDays: 3,
    yearlyRanges: {
      2025: { start: '2025-03-13', end: '2025-03-15' },
      2026: { start: '2026-03-02', end: '2026-03-04' },
      2027: { start: '2027-03-22', end: '2027-03-24' },
    },
  },
  {
    id: 'ugadi-gudi',
    name: 'Ugadi / Gudi Padwa',
    greeting: 'Happy New Year',
    effect: 'spring',
    emoji: '🌸',
    windowDays: 2,
    yearlyRanges: {
      2025: { start: '2025-03-30', end: '2025-03-31' },
      2026: { start: '2026-03-19', end: '2026-03-20' },
      2027: { start: '2027-03-08', end: '2027-03-09' },
    },
  },
  {
    id: 'raksha-bandhan',
    name: 'Raksha Bandhan',
    greeting: 'Happy Raksha Bandhan',
    effect: 'sparkle',
    emoji: '🎀',
    windowDays: 2,
    yearlyRanges: {
      2025: { start: '2025-08-08', end: '2025-08-10' },
      2026: { start: '2026-08-27', end: '2026-08-29' },
      2027: { start: '2027-08-17', end: '2027-08-19' },
    },
  },
  {
    id: 'independence-day',
    name: 'Independence Day',
    greeting: 'Happy Independence Day',
    effect: 'patriotic',
    emoji: '🇮🇳',
    windowDays: 2,
    fixedDate: { month: 8, day: 15 },
  },
  {
    id: 'janmashtami',
    name: 'Janmashtami',
    greeting: 'Happy Janmashtami',
    effect: 'sparkle',
    emoji: '🪈',
    windowDays: 2,
    yearlyRanges: {
      2025: { start: '2025-08-15', end: '2025-08-17' },
      2026: { start: '2026-09-04', end: '2026-09-06' },
      2027: { start: '2027-08-25', end: '2027-08-27' },
    },
  },
  {
    id: 'ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    greeting: 'Ganpati Bappa Morya',
    effect: 'spring',
    emoji: '🙏',
    windowDays: 3,
    yearlyRanges: {
      2025: { start: '2025-08-26', end: '2025-08-28' },
      2026: { start: '2026-09-14', end: '2026-09-16' },
      2027: { start: '2027-09-03', end: '2027-09-05' },
    },
  },
  {
    id: 'navratri',
    name: 'Navratri',
    greeting: 'Happy Navratri',
    effect: 'sparkle',
    emoji: '🪔',
    windowDays: 4,
    yearlyRanges: {
      2025: { start: '2025-09-22', end: '2025-09-30' },
      2026: { start: '2026-10-11', end: '2026-10-19' },
      2027: { start: '2027-10-01', end: '2027-10-09' },
    },
  },
  {
    id: 'dussehra',
    name: 'Dussehra',
    greeting: 'Happy Dussehra',
    effect: 'sparkle',
    emoji: '🏹',
    windowDays: 2,
    yearlyRanges: {
      2025: { start: '2025-10-01', end: '2025-10-03' },
      2026: { start: '2026-10-19', end: '2026-10-21' },
      2027: { start: '2027-10-09', end: '2027-10-11' },
    },
  },
  {
    id: 'diwali',
    name: 'Diwali',
    greeting: 'Happy Diwali',
    effect: 'diwali',
    emoji: '🪔',
    windowDays: 5,
    yearlyRanges: {
      2025: { start: '2025-10-18', end: '2025-10-22' },
      2026: { start: '2026-11-06', end: '2026-11-10' },
      2027: { start: '2027-10-28', end: '2027-11-01' },
    },
  },
  {
    id: 'gandhi-jayanti',
    name: 'Gandhi Jayanti',
    greeting: 'Gandhi Jayanti',
    effect: 'patriotic',
    emoji: '🕊️',
    windowDays: 1,
    fixedDate: { month: 10, day: 2 },
  },
  {
    id: 'christmas',
    name: 'Christmas',
    greeting: 'Merry Christmas',
    effect: 'sparkle',
    emoji: '🎄',
    windowDays: 3,
    fixedDate: { month: 12, day: 25 },
  },
  {
    id: 'new-year',
    name: 'New Year',
    greeting: 'Happy New Year',
    effect: 'sparkle',
    emoji: '🎉',
    windowDays: 2,
    fixedDate: { month: 1, day: 1 },
  },
]

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function daysBetween(a: Date, b: Date): number {
  const ms = Math.abs(startOfDay(a).getTime() - startOfDay(b).getTime())
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

function isWithinWindow(date: Date, center: Date, windowDays: number): boolean {
  return daysBetween(date, center) <= windowDays
}

function isDateInRange(date: Date, start: Date, end: Date, windowDays: number): boolean {
  const from = startOfDay(start)
  from.setDate(from.getDate() - windowDays)
  const to = startOfDay(end)
  to.setDate(to.getDate() + windowDays)
  const current = startOfDay(date)
  return current >= from && current <= to
}

function isFestivalActiveOnDate(festival: FestivalDefinition, date: Date): boolean {
  const year = date.getFullYear()

  if (festival.fixedDate) {
    const center = new Date(year, festival.fixedDate.month - 1, festival.fixedDate.day)
    return isWithinWindow(date, center, festival.windowDays)
  }

  const range = festival.yearlyRanges?.[year]
  if (!range) return false
  return isDateInRange(date, parseIsoDate(range.start), parseIsoDate(range.end), festival.windowDays)
}

/** Preview a festival by id (e.g. ?festival=diwali). */
export function getFestivalById(id: string): FestivalDefinition | undefined {
  return INDIAN_FESTIVALS.find((f) => f.id === id)
}

export function getActiveFestival(date = new Date(), previewId?: string | null): ActiveFestival | null {
  if (previewId) {
    const preview = getFestivalById(previewId)
    if (preview) return { ...preview, year: date.getFullYear() }
  }

  for (const festival of INDIAN_FESTIVALS) {
    if (isFestivalActiveOnDate(festival, date)) {
      return { ...festival, year: date.getFullYear() }
    }
  }

  return null
}
