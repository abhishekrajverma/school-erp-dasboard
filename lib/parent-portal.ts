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

function formatMonthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`
}

function formatMonthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
}

export function getChildMonthlyAttendanceSummaries(
  logs: StudentDailyAttendance[],
): MonthlyAttendanceSummary[] {
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

export function getAvailableAttendanceMonths(logs: StudentDailyAttendance[]) {
  return getChildMonthlyAttendanceSummaries(logs).map((m) => ({
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

export function mapAttendanceRecordToDailyLog(record: {
  date: string
  status: string
  checkIn: string | null
  checkOut: string | null
  remarks?: string | null
}): StudentDailyAttendance {
  const date = new Date(record.date)
  const status =
    record.status === 'late' ? 'late' : record.status === 'absent' ? 'absent' : 'present'
  return {
    date: record.date,
    dayLabel: DAY_NAMES[date.getDay()] ?? '—',
    status,
    checkIn: record.checkIn,
    checkOut: record.checkOut,
    remarks: record.remarks ?? '',
  }
}
