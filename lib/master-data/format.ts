import type { MasterData } from './types'

/** e.g. ADM1001 with prefix ADM, start 1001, padding 4 → ADM1001 */
export function formatAdmissionNumber(data: MasterData, sequenceIndex: number): string {
  const num = data.admissionNumberStartFrom + Math.max(0, sequenceIndex)
  const padded = String(num).padStart(data.admissionNumberPadding, '0')
  return `${data.admissionNumberPrefix}${padded}`
}

export function formatEmployeeId(data: MasterData, sequenceIndex: number): string {
  const num = data.employeeIdStartFrom + Math.max(0, sequenceIndex)
  return `${data.employeeIdPrefix}${String(num).padStart(4, '0')}`
}

export function formatRollNumber(data: MasterData, sequenceIndex: number): string {
  const num = data.rollNumberStartFrom + Math.max(0, sequenceIndex)
  const core = String(num).padStart(4, '0')
  return data.rollNumberPrefix ? `${data.rollNumberPrefix}${core}` : core
}

/** Parse "A, B, C" → ["A","B","C"] */
export function parseSectionList(raw: string): string[] {
  return raw
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export const CLASS_LEVEL_OPTIONS = [
  { id: 'nursery', label: 'Nursery', grade: 'Nursery' },
  { id: 'lkg', label: 'LKG', grade: 'LKG' },
  { id: 'ukg', label: 'UKG', grade: 'UKG' },
  { id: '1', label: '1', grade: '1' },
  { id: '2', label: '2', grade: '2' },
  { id: '3', label: '3', grade: '3' },
  { id: '4', label: '4', grade: '4' },
  { id: '5', label: '5', grade: '5' },
  { id: '6', label: '6', grade: '6' },
  { id: '7', label: '7', grade: '7' },
  { id: '8', label: '8', grade: '8' },
  { id: '9', label: '9', grade: '9' },
  { id: '10', label: '10', grade: '10' },
  { id: '11', label: '11', grade: '11' },
  { id: '12', label: '12', grade: '12' },
] as const

const LEGACY_PREPRIMARY_IDS = new Set(['nursery', 'lkg', 'ukg'])

/** Convert old dropdown ids (nursery, lkg) to display names for existing tenants. */
export function normalizeClassLevelName(value: string, _classLabelPrefix = 'Class'): string {
  const trimmed = value.trim()
  if (!trimmed) return trimmed
  const legacy = CLASS_LEVEL_OPTIONS.find((level) => level.id === trimmed.toLowerCase())
  if (!legacy) return trimmed
  if (/^\d+$/.test(legacy.id)) return trimmed
  return legacy.grade
}

export function parseClassNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const direct = Number(trimmed)
  if (Number.isInteger(direct) && direct > 0) return direct
  const match = trimmed.match(/(\d+)\s*$/)
  if (!match) return null
  const parsed = Number(match[1])
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null
}

/** Parse comma-separated class names */
export function parseClassList(raw: string | undefined): string[] {
  return parseSectionList(raw ?? '')
}

export function serializeClassList(classes: string[]): string {
  return classes.join(', ')
}

export function getSuggestedClassNames(classLabelPrefix: string): string[] {
  const prefix = classLabelPrefix.trim()
  return CLASS_LEVEL_OPTIONS.map((level) => {
    if (/^\d+$/.test(level.id)) return prefix ? `${prefix} ${level.id}` : level.id
    return level.grade
  })
}

export function formatClassListLabel(raw: string | undefined, emptyLabel = 'Add classes'): string {
  const classes = parseClassList(raw)
  if (classes.length === 0) return emptyLabel
  if (classes.length === 1) return classes[0]
  if (classes.length <= 3) return classes.join(', ')
  return `${classes.length} classes · ${classes[0]} … ${classes[classes.length - 1]}`
}

/** First and last class from an ordered class list. */
export function classListBounds(classes: string[]): { start: string; end: string } | null {
  if (classes.length === 0) return null
  return { start: classes[0], end: classes[classes.length - 1] }
}

/** Merge master class list with extra names (e.g. from API), preserving order and deduping. */
export function mergeClassNames(primary: string[], extra: string[]): string[] {
  const merged = [...primary]
  for (const name of extra) {
    const trimmed = name?.trim()
    if (!trimmed) continue
    if (!merged.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      merged.push(trimmed)
    }
  }
  return merged
}

export function formatClassLabel(data: MasterData, grade: string | number): string {
  const g = String(grade).trim()
  if (!g) return ''
  if (g.toLowerCase().startsWith('class') || g.includes('-')) return g
  const prefix = data.classLabelPrefix.trim()
  if (/^\d+$/.test(g)) return prefix ? `${prefix} ${g}` : g
  return g
}

/** Build ordered class names from explicit list or start/end names. */
export function buildClassRange(data: MasterData): string[] {
  const explicit = parseClassList(data.classList)
  if (explicit.length > 0) return explicit

  const start = normalizeClassLevelName(data.classStartFrom, data.classLabelPrefix)
  const end = normalizeClassLevelName(data.classEndAt, data.classLabelPrefix)
  if (!start || !end) return []
  if (start.toLowerCase() === end.toLowerCase()) return [start]

  const startNum = parseClassNumber(start)
  const endNum = parseClassNumber(end)

  if (startNum !== null && endNum !== null && endNum >= startNum) {
    return Array.from({ length: endNum - startNum + 1 }, (_, index) =>
      formatClassLabel(data, startNum + index),
    )
  }

  if (startNum === null && endNum !== null) {
    return [start, ...Array.from({ length: endNum }, (_, index) => formatClassLabel(data, index + 1))]
  }

  return [start, end]
}

export function formatClassRangeSummary(data: MasterData): string {
  const classes = buildClassRange(data)
  if (classes.length === 0) return 'Enter start and end class names'
  if (classes.length === 1) return classes[0]
  if (classes.length <= 4) return classes.join(', ')
  return `${classes[0]} … ${classes[classes.length - 1]} (${classes.length} classes)`
}

export function migrateMasterDataClassFields(data: Partial<MasterData>): Partial<MasterData> {
  const prefix = data.classLabelPrefix ?? 'Class'
  const next = { ...data }

  if (next.classStartFrom && LEGACY_PREPRIMARY_IDS.has(next.classStartFrom.toLowerCase())) {
    next.classStartFrom = normalizeClassLevelName(next.classStartFrom, prefix)
  }
  if (next.classEndAt && LEGACY_PREPRIMARY_IDS.has(next.classEndAt.toLowerCase())) {
    next.classEndAt = normalizeClassLevelName(next.classEndAt, prefix)
  }

  return next
}

export function admissionNumberPlaceholder(data: MasterData): string {
  return formatAdmissionNumber(data, 0)
}

export const WEEKDAY_OPTIONS = [
  { id: 'Mon', label: 'Monday' },
  { id: 'Tue', label: 'Tuesday' },
  { id: 'Wed', label: 'Wednesday' },
  { id: 'Thu', label: 'Thursday' },
  { id: 'Fri', label: 'Friday' },
  { id: 'Sat', label: 'Saturday' },
  { id: 'Sun', label: 'Sunday' },
] as const

const DAY_ALIASES: Record<string, (typeof WEEKDAY_OPTIONS)[number]['id']> = {
  mon: 'Mon',
  monday: 'Mon',
  tue: 'Tue',
  tues: 'Tue',
  tuesday: 'Tue',
  wed: 'Wed',
  wednesday: 'Wed',
  thu: 'Thu',
  thur: 'Thu',
  thurs: 'Thu',
  thursday: 'Thu',
  fri: 'Fri',
  friday: 'Fri',
  sat: 'Sat',
  saturday: 'Sat',
  sun: 'Sun',
  sunday: 'Sun',
}

/** Parse stored string → weekday ids in calendar order */
export function parseWorkingDays(raw: string): string[] {
  const tokens = raw
    .split(/[,;|]/)
    .map((s) => s.trim())
    .filter(Boolean)

  const ids = tokens
    .map((token) => DAY_ALIASES[token.toLowerCase()] ?? token)
    .filter((id): id is (typeof WEEKDAY_OPTIONS)[number]['id'] =>
      WEEKDAY_OPTIONS.some((d) => d.id === id),
    )

  return WEEKDAY_OPTIONS.map((d) => d.id).filter((id) => ids.includes(id))
}

export function serializeWorkingDays(dayIds: string[]): string {
  const ordered = WEEKDAY_OPTIONS.map((d) => d.id).filter((id) => dayIds.includes(id))
  return ordered.join(', ')
}

export function formatWorkingDaysLabel(raw: string): string {
  const ids = parseWorkingDays(raw)
  if (ids.length === 0) return 'Select working days'
  if (ids.length === 7) return 'Every day'
  if (ids.join(',') === 'Mon,Tue,Wed,Thu,Fri') return 'Mon – Fri'
  return ids
    .map((id) => WEEKDAY_OPTIONS.find((d) => d.id === id)?.label ?? id)
    .join(', ')
}
