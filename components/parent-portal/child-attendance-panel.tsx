'use client'

import * as React from 'react'
import {
  Calendar,
  CalendarCheck,
  CalendarDays,
  Clock,
  TrendingUp,
  XCircle,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { StatCard, Tabs } from '@/components/shared/page-components'
import { StatusBadge } from '@/components/shared/data-table'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  filterAttendanceByPeriod,
  getChildDailyAttendanceLog,
  getChildMonthlyAttendanceSummaries,
  summarizeAttendanceLogs,
  type AttendanceViewPeriod,
  type StudentDailyAttendance,
} from '@/lib/parent-portal'

const PERIOD_OPTIONS: { id: AttendanceViewPeriod; label: string; description: string }[] = [
  { id: '7days', label: '7 Days', description: 'Last 7 school days' },
  { id: 'monthly', label: 'Monthly', description: 'Pick a calendar month' },
  { id: 'all', label: 'All', description: 'Full attendance history' },
]

function statusDot(status: StudentDailyAttendance['status']) {
  return cn(
    'h-2 w-2 shrink-0 rounded-full',
    status === 'present' && 'bg-success',
    status === 'late' && 'bg-amber-500',
    status === 'absent' && 'bg-destructive',
  )
}

function AttendanceLogTable({ logs }: { logs: StudentDailyAttendance[] }) {
  if (logs.length === 0) {
    return (
      <p className="px-4 py-8 text-center text-sm text-muted-foreground">
        No attendance records for this period.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Day</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Check in</th>
            <th className="px-4 py-3 font-medium">Check out</th>
            <th className="px-4 py-3 font-medium">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.date}
              className="border-b border-border/60 transition-colors hover:bg-muted/25"
            >
              <td className="px-4 py-3 font-medium tabular-nums whitespace-nowrap">
                {formatDate(log.date)}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{log.dayLabel}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {statusDot(log.status)}
                  <StatusBadge status={log.status} />
                </div>
              </td>
              <td className="px-4 py-3 tabular-nums text-muted-foreground">
                {log.checkIn ?? '—'}
              </td>
              <td className="px-4 py-3 tabular-nums text-muted-foreground">
                {log.checkOut ?? '—'}
              </td>
              <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">
                {log.remarks || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PeriodStats({
  summary,
  periodLabel,
}: {
  summary: ReturnType<typeof summarizeAttendanceLogs>
  periodLabel: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="text-sm font-semibold">
          {summary.percentage}% · {periodLabel}
        </Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="School days" value={summary.workingDays} icon={Calendar} />
        <StatCard title="Present" value={summary.present} changeType="positive" icon={CalendarCheck} />
        <StatCard title="Late" value={summary.late} changeType="neutral" icon={AlertCircle} />
        <StatCard title="Absent" value={summary.absent} changeType="negative" icon={XCircle} />
      </div>
      {summary.workingDays > 0 && (
        <div className="flex h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="bg-success transition-all"
            style={{ width: `${(summary.present / summary.workingDays) * 100}%` }}
          />
          <div
            className="bg-amber-500 transition-all"
            style={{ width: `${(summary.late / summary.workingDays) * 100}%` }}
          />
          <div
            className="bg-destructive transition-all"
            style={{ width: `${(summary.absent / summary.workingDays) * 100}%` }}
          />
        </div>
      )}
    </div>
  )
}

export function ChildAttendancePanel({
  studentId,
  studentName,
}: {
  studentId: string
  studentName: string
}) {
  const [period, setPeriod] = React.useState<AttendanceViewPeriod>('7days')
  const dailyLog = React.useMemo(
    () => getChildDailyAttendanceLog(studentId),
    [studentId],
  )
  const monthlySummaries = React.useMemo(
    () => getChildMonthlyAttendanceSummaries(studentId),
    [studentId],
  )
  const [selectedMonthKey, setSelectedMonthKey] = React.useState(
    monthlySummaries[0]?.monthKey ?? '',
  )

  React.useEffect(() => {
    if (monthlySummaries[0]) {
      setSelectedMonthKey(monthlySummaries[0].monthKey)
    }
  }, [studentId, monthlySummaries])

  const selectedMonth =
    monthlySummaries.find((m) => m.monthKey === selectedMonthKey) ?? monthlySummaries[0]

  const filteredLogs = React.useMemo(
    () =>
      filterAttendanceByPeriod(
        dailyLog,
        period,
        period === 'monthly' ? selectedMonthKey : undefined,
      ),
    [dailyLog, period, selectedMonthKey],
  )

  const summary = React.useMemo(
    () => summarizeAttendanceLogs(filteredLogs),
    [filteredLogs],
  )

  const periodMeta = PERIOD_OPTIONS.find((p) => p.id === period)!
  const periodLabel =
    period === 'monthly' && selectedMonth
      ? selectedMonth.monthLabel
      : periodMeta.description

  const todayLog = dailyLog[0]

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Attendance — {studentName}</h3>
          <p className="text-sm text-muted-foreground">
            Choose 7 days, a month, or view all records for your child
          </p>
        </div>
        <Tabs
          tabs={PERIOD_OPTIONS.map((p) => ({ id: p.id, label: p.label }))}
          activeTab={period}
          onChange={(id) => setPeriod(id as AttendanceViewPeriod)}
        />
        <p className="text-xs text-muted-foreground">{periodMeta.description}</p>
      </div>

      {period === 'monthly' && (
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedMonthKey} onValueChange={setSelectedMonthKey}>
            <SelectTrigger className="w-[220px]">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {monthlySummaries.map((m) => (
                <SelectItem key={m.monthKey} value={m.monthKey}>
                  {m.monthLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {todayLog && period === '7days' && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                <CalendarCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Most recent day
                </p>
                <p className="font-semibold">
                  {formatDate(todayLog.date)} · {todayLog.dayLabel}
                </p>
              </div>
            </div>
            <StatusBadge status={todayLog.status} />
            {todayLog.checkIn && (
              <p className="text-sm text-muted-foreground">
                <Clock className="mr-1 inline h-3.5 w-3.5" />
                {todayLog.checkIn} – {todayLog.checkOut ?? '—'}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <PeriodStats summary={summary} periodLabel={periodLabel} />

      {period === '7days' && filteredLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last 7 school days</CardTitle>
            <CardDescription>Quick view of the most recent week</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {filteredLogs.map((log) => (
              <div
                key={log.date}
                className="flex min-w-[100px] flex-col items-center gap-1 rounded-lg border border-border p-3 text-center"
              >
                <span className="text-[10px] uppercase text-muted-foreground">{log.dayLabel}</span>
                <span className="text-xs font-medium tabular-nums">
                  {new Date(log.date).getDate()}
                </span>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {formatDate(log.date)}
                </span>
                <StatusBadge status={log.status} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {period === '7days'
              ? '7-day attendance log'
              : period === 'monthly'
                ? `Monthly log — ${selectedMonth?.monthLabel ?? ''}`
                : 'Full attendance log'}
          </CardTitle>
          <CardDescription>
            {filteredLogs.length} school day{filteredLogs.length !== 1 ? 's' : ''} in this period
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <AttendanceLogTable logs={filteredLogs} />
        </CardContent>
      </Card>

      {period === 'monthly' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Compare all months
            </CardTitle>
            <CardDescription>Tap a month to view it above</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {monthlySummaries.map((m) => (
              <button
                key={m.monthKey}
                type="button"
                onClick={() => {
                  setSelectedMonthKey(m.monthKey)
                  setPeriod('monthly')
                }}
                className={cn(
                  'flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors hover:bg-muted/40',
                  m.monthKey === selectedMonthKey && 'border-primary/40 bg-primary/5',
                )}
              >
                <span className="font-medium">{m.monthLabel}</span>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>
                    {m.present + m.late}/{m.workingDays} days
                  </span>
                  <Badge variant={m.percentage >= 90 ? 'default' : 'secondary'}>
                    {m.percentage}%
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
