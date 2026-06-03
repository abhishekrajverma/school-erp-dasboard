import {
  attendanceRecordsData,
  feeRecordsData,
  parentsData,
  studentsData,
  examsData,
} from './erp-data'
import { schoolNotices } from './data'

export type StudentDailyAttendance = {
  date: string
  dayLabel: string
  status: 'present' | 'late' | 'absent'
  checkIn: string | null
  checkOut: string | null
  remarks: string
}

export type MonthlyAttendanceSummary = {
  monthKey: string
  monthLabel: string
  year: number
  month: number
  workingDays: number
  present: number
  late: number
  absent: number
  percentage: number
  logs: StudentDailyAttendance[]
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

function hashSeed(input: string): number {
  let h = 0
  for (let i = 0; i < input.length; i++) h = (h * 31 + input.charCodeAt(i)) | 0
  return Math.abs(h)
}

function formatMonthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function formatMonthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

/** Deterministic school-day attendance for demo (weekdays only) */
function generateSchoolDayAttendance(
  studentId: string,
  year: number,
  month: number,
): StudentDailyAttendance[] {
  const logs: StudentDailyAttendance[] = []
  const daysInMonth = new Date(year, month, 0).getDate()

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day)
    const dow = date.getDay()
    if (dow === 0) continue

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const seed = hashSeed(`${studentId}-${dateStr}`)
    const roll = seed % 100

    let status: StudentDailyAttendance['status']
    let checkIn: string | null
    let checkOut: string | null
    let remarks = ''

    if (roll < 8) {
      status = 'absent'
      checkIn = null
      checkOut = null
      remarks = roll % 2 === 0 ? 'Sick leave' : 'Family emergency'
    } else if (roll < 18) {
      status = 'late'
      const mins = 10 + (seed % 35)
      checkIn = `09:${String(mins).padStart(2, '0')} AM`
      checkOut = '03:30 PM'
      remarks = 'Late arrival'
    } else {
      status = 'present'
      const hour = 8
      const mins = 35 + (seed % 20)
      checkIn = `${hour}:${String(mins).padStart(2, '0')} AM`
      checkOut = '03:30 PM'
    }

    logs.push({
      date: dateStr,
      dayLabel: DAY_NAMES[dow],
      status,
      checkIn,
      checkOut,
      remarks,
    })
  }

  return logs
}

function recordToDailyLog(
  r: (typeof attendanceRecordsData)[number],
): StudentDailyAttendance {
  const date = new Date(r.date)
  const status =
    r.status === 'late' ? 'late' : r.status === 'absent' ? 'absent' : 'present'
  return {
    date: r.date,
    dayLabel: DAY_NAMES[date.getDay()],
    status,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    remarks: r.remarks,
  }
}

export function getParentById(id: string) {
  return parentsData.find((p) => p.id === id)
}

export function getParentChildren(parentId: string) {
  const parent = getParentById(parentId)
  if (!parent) return []
  return studentsData.filter((s) => parent.studentIds.includes(s.id))
}

export function getChildFees(studentId: string) {
  return feeRecordsData.filter((f) => f.studentId === studentId)
}

export function getChildAttendance(studentId: string) {
  return attendanceRecordsData.filter(
    (r) => r.entityType === 'student' && r.entityId === studentId,
  )
}

/** Full daily log: generated history + any ERP overrides, newest first */
export function getChildDailyAttendanceLog(studentId: string): StudentDailyAttendance[] {
  const fromErp = getChildAttendance(studentId).map(recordToDailyLog)
  const generated = [
    ...generateSchoolDayAttendance(studentId, 2024, 6),
    ...generateSchoolDayAttendance(studentId, 2024, 5),
  ]

  const byDate = new Map<string, StudentDailyAttendance>()
  for (const log of generated) byDate.set(log.date, log)
  for (const log of fromErp) byDate.set(log.date, log)

  return [...byDate.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function getChildMonthlyAttendanceSummaries(
  studentId: string,
): MonthlyAttendanceSummary[] {
  const logs = getChildDailyAttendanceLog(studentId)
  const monthMap = new Map<string, StudentDailyAttendance[]>()

  for (const log of logs) {
    const [year, month] = log.date.split('-').map(Number)
    const key = formatMonthKey(year, month)
    const list = monthMap.get(key) ?? []
    list.push(log)
    monthMap.set(key, list)
  }

  return [...monthMap.entries()]
    .map(([monthKey, monthLogs]) => {
      const [year, month] = monthKey.split('-').map(Number)
      const present = monthLogs.filter((l) => l.status === 'present').length
      const late = monthLogs.filter((l) => l.status === 'late').length
      const absent = monthLogs.filter((l) => l.status === 'absent').length
      const workingDays = monthLogs.length
      const attended = present + late
      const percentage =
        workingDays > 0 ? Math.round((attended / workingDays) * 1000) / 10 : 0

      return {
        monthKey,
        monthLabel: formatMonthLabel(year, month),
        year,
        month,
        workingDays,
        present,
        late,
        absent,
        percentage,
        logs: monthLogs.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
      }
    })
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
}

export function getAvailableAttendanceMonths(studentId: string) {
  return getChildMonthlyAttendanceSummaries(studentId).map((m) => ({
    key: m.monthKey,
    label: m.monthLabel,
  }))
}

export type AttendanceViewPeriod = '7days' | 'monthly' | 'all'

export function filterAttendanceByPeriod(
  logs: StudentDailyAttendance[],
  period: AttendanceViewPeriod,
  monthKey?: string,
): StudentDailyAttendance[] {
  if (period === '7days') return logs.slice(0, 7)
  if (period === 'monthly' && monthKey) {
    return logs.filter((l) => l.date.startsWith(monthKey))
  }
  if (period === 'monthly') return logs
  return logs
}

export function summarizeAttendanceLogs(logs: StudentDailyAttendance[]) {
  const workingDays = logs.length
  const present = logs.filter((l) => l.status === 'present').length
  const late = logs.filter((l) => l.status === 'late').length
  const absent = logs.filter((l) => l.status === 'absent').length
  const attended = present + late
  const percentage =
    workingDays > 0 ? Math.round((attended / workingDays) * 1000) / 10 : 0
  return { workingDays, present, late, absent, percentage }
}

export function getChildExams(studentClass: string) {
  return examsData.filter((e) => e.class === studentClass)
}

export function getParentNotices() {
  return schoolNotices
}

export { getParentNoticesRich } from './parent-notices'
