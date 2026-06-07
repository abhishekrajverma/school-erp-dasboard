'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Clock,
  FileText,
  Loader2,
} from 'lucide-react'
import { PortalGuard } from '@/components/portal/portal-guard'
import { PortalLayout } from '@/components/portal/portal-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, StatCard, Tabs } from '@/components/shared/page-components'
import { StatusBadge } from '@/components/shared/data-table'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  useNotifications,
  useStudentPortalAttendance,
  useStudentPortalExams,
  useStudentPortalFees,
  useStudentPortalLibraryIssues,
  useStudentPortalTimetable,
  useStudentProfile,
} from '@/hooks/api'

function formatTimetableTime(startTime: string, endTime: string) {
  return `${startTime} – ${endTime}`
}

export default function StudentPortalPage() {
  return (
    <PortalGuard allowedRoles={['student']}>
      <StudentPortalContent />
    </PortalGuard>
  )
}

function StudentPortalContent() {
  const [activeTab, setActiveTab] = React.useState('overview')

  const profileQuery = useStudentProfile()
  const feesQuery = useStudentPortalFees()
  const attendanceQuery = useStudentPortalAttendance()
  const examsQuery = useStudentPortalExams()
  const timetableQuery = useStudentPortalTimetable()
  const libraryQuery = useStudentPortalLibraryIssues()
  const noticesQuery = useNotifications({ targetAudience: 'students' } as never)

  const student = profileQuery.data
  const fees = feesQuery.data ?? []
  const attendance = attendanceQuery.data ?? []
  const exams = examsQuery.data ?? []
  const timetable = timetableQuery.data ?? []
  const bookIssues = libraryQuery.data ?? []
  const notices = noticesQuery.data?.items ?? []

  const isLoading =
    profileQuery.isLoading ||
    feesQuery.isLoading ||
    attendanceQuery.isLoading

  const totalPending = fees.reduce((sum, f) => sum + f.pending, 0)
  const presentDays = attendance.filter(
    (a) => a.status === 'present' || a.status === 'late',
  ).length

  if (isLoading) {
    return (
      <PortalLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PortalLayout>
    )
  }

  if (profileQuery.isError || !student) {
    return (
      <PortalLayout>
        <p className="text-muted-foreground">
          {profileQuery.error instanceof Error
            ? profileQuery.error.message
            : 'Student account not found.'}
        </p>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <PageHeader
          title="Student Portal"
          description="Your attendance, fees, exams, and class schedule."
          breadcrumbs={[{ label: 'My Portal' }]}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"
        >
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={student.avatar ?? undefined} alt={student.name} />
            <AvatarFallback>
              {student.firstName[0]}
              {student.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h2 className="text-lg font-semibold">{student.name}</h2>
            <p className="text-sm text-muted-foreground">
              Class {student.class} · Roll {student.rollNo} · {student.admissionNo}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Attendance {student.attendance}%</Badge>
              {student.feeStatus ? <StatusBadge status={student.feeStatus} /> : null}
            </div>
          </div>
        </motion.div>

        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'attendance', label: 'Attendance' },
            { id: 'fees', label: 'Fees' },
            { id: 'schedule', label: 'Schedule' },
            { id: 'exams', label: 'Exams' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Attendance" value={`${student.attendance}%`} icon={CalendarCheck} />
              <StatCard
                title="Fee status"
                value={student.feeStatus ?? '—'}
                icon={CreditCard}
              />
              <StatCard title="Pending fees" value={formatCurrency(totalPending)} icon={CreditCard} />
              <StatCard
                title="Upcoming exams"
                value={exams.filter((e) => e.status === 'scheduled').length}
                icon={FileText}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {notices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No notices at this time.</p>
                ) : (
                  notices.map((n) => (
                    <div
                      key={n.id}
                      className="flex justify-between rounded-lg border border-border p-3 text-sm"
                    >
                      <span>{n.title}</span>
                      <Badge variant="secondary">{formatDate(n.sentAt)}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'attendance' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your attendance</CardTitle>
              <CardDescription>
                {presentDays} of {attendance.length} recent records marked present/late
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {attendance.length === 0 ? (
                <p className="text-sm text-muted-foreground">No attendance records yet.</p>
              ) : (
                attendance.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                  >
                    <span className="text-sm font-medium">{formatDate(r.date)}</span>
                    <StatusBadge status={r.status} />
                    <span className="text-xs text-muted-foreground">
                      {r.checkIn ? `${r.checkIn} – ${r.checkOut ?? '—'}` : r.remarks || '—'}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-4">
            {fees.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No fee records found.
                </CardContent>
              </Card>
            ) : (
              fees.map((f) => (
                <Card key={f.id}>
                  <CardHeader className="flex flex-row justify-between">
                    <div>
                      <CardTitle className="text-base">{f.invoiceNo}</CardTitle>
                      <CardDescription>Due {formatDate(f.dueDate)}</CardDescription>
                    </div>
                    <StatusBadge status={f.status} />
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-semibold">{formatCurrency(f.totalFee)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Paid</p>
                      <p className="font-semibold text-success">{formatCurrency(f.paid)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pending</p>
                      <p className="font-semibold">{formatCurrency(f.pending)}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'schedule' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Class {student.class} timetable
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {timetable.length === 0 ? (
                <p className="text-sm text-muted-foreground">No timetable entries found.</p>
              ) : (
                timetable.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 rounded-lg border border-border p-3"
                  >
                    <span className="font-mono text-sm text-muted-foreground w-28">
                      {formatTimetableTime(p.startTime, p.endTime)}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{p.subject}</p>
                      <p className="text-xs text-muted-foreground">{p.teacher}</p>
                    </div>
                    <Badge variant="outline">{p.room}</Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'exams' && (
          <div className="space-y-4">
            {exams.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No exams scheduled.
                </CardContent>
              </Card>
            ) : (
              exams.map((e) => (
                <Card key={e.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                    <div>
                      <p className="font-medium">{e.examName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(e.date)} · {e.startTime} · {e.room ?? '—'}
                      </p>
                    </div>
                    <StatusBadge status={e.status} />
                  </CardContent>
                </Card>
              ))
            )}
            {bookIssues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {bookIssues.map((b) => (
                    <div key={b.id} className="flex justify-between rounded-lg border p-3 text-sm">
                      <span>{b.bookTitle}</span>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
