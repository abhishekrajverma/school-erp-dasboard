'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Calendar,
  CalendarCheck,
  Clock,
  Plus,
  Wallet,
  BookOpen,
  User,
  Bell,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  Download,
  LogIn,
  Send,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { PortalGuard } from '@/components/portal/portal-guard'
import { PortalLayout } from '@/components/portal/portal-layout'
import { getSession } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/admission/file-upload'
import { ProfilePhotoUpload } from '@/components/teacher-portal/profile-photo-upload'
import type { UploadedFileMeta } from '@/lib/admission/types'
import { DataTable, StatusBadge } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { PageHeader, StatCard, FormSection, FormField, Tabs } from '@/components/shared/page-components'
import { type LeaveRequest } from '@/lib/erp-data'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  teacherSelfLeaveSchema,
  teacherProfileUpdateSchema,
  type TeacherSelfLeaveFormData,
  type TeacherProfileUpdateFormData,
} from '@/lib/schemas'
import {
  getTeacherById,
  getTeacherLeaves,
  getTeacherPayroll,
  getTeacherTodaysClasses,
  getTeacherTimetable,
  getTeacherBookIssues,
  getTeacherTodayAttendance,
  getStaffNotices,
  getLeaveBalance,
  getTeacherProfilePhotoUrl,
  loadTeacherProfilePhotos,
  removeTeacherProfilePhoto,
  saveTeacherProfilePhoto,
  teacherAttendanceLogs,
  teacherDutyRequestsData,
  type TeacherDutyRequest,
} from '@/lib/teacher-portal'
import { useToast } from '@/hooks/use-toast'

const LEAVE_TYPES_REQUIRING_PROOF = ['sick', 'maternity', 'paternity'] as const

const leaveTypeLabels: Record<string, string> = {
  casual: 'Casual',
  sick: 'Sick',
  earned: 'Earned',
  maternity: 'Maternity',
  paternity: 'Paternity',
  unpaid: 'Unpaid',
}

export default function TeacherPortalPage() {
  return (
    <PortalGuard allowedRoles={['teacher']}>
      <TeacherPortalContent />
    </PortalGuard>
  )
}

function TeacherPortalContent() {
  const session = getSession()
  const teacherId = session?.userId ?? ''
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState('overview')
  const [leaveRequests, setLeaveRequests] = React.useState<LeaveRequest[]>([])
  const [dutyRequests, setDutyRequests] = React.useState(teacherDutyRequestsData)
  const [showApplyLeave, setShowApplyLeave] = React.useState(false)
  const [proofDocument, setProofDocument] = React.useState<UploadedFileMeta | null>(null)
  const [proofError, setProofError] = React.useState<string | null>(null)
  const [checkedInToday, setCheckedInToday] = React.useState(false)
  const [profileSaved, setProfileSaved] = React.useState(false)
  const [profilePhotos, setProfilePhotos] = React.useState<Record<string, string>>({})

  const teacher = getTeacherById(teacherId)
  const profilePhotoUrl = teacher
    ? getTeacherProfilePhotoUrl(teacherId, profilePhotos, teacher.avatar)
    : ''
  const leaveBalance = getLeaveBalance(teacherId)
  const payroll = getTeacherPayroll(teacherId)
  const todayClasses = teacher ? getTeacherTodaysClasses(teacher.name) : []
  const mySchedule = teacher ? getTeacherTimetable(teacher.name) : []
  const bookIssues = getTeacherBookIssues(teacherId)
  const todayAttendance = getTeacherTodayAttendance(teacherId)
  const attendanceLog = teacherAttendanceLogs[teacherId] ?? []
  const myDutyRequests = dutyRequests.filter((r) => r.teacherId === teacherId)
  const notices = getStaffNotices()

  React.useEffect(() => {
    setProfilePhotos(loadTeacherProfilePhotos())
  }, [])

  React.useEffect(() => {
    if (!teacherId) return
    setLeaveRequests(getTeacherLeaves(teacherId))
    setCheckedInToday(false)
    setProfileSaved(false)
  }, [teacherId])

  const leaveForm = useForm<TeacherSelfLeaveFormData>({
    resolver: zodResolver(teacherSelfLeaveSchema),
    defaultValues: { leaveType: 'casual', startDate: '', endDate: '', reason: '' },
  })

  const profileForm = useForm<TeacherProfileUpdateFormData>({
    resolver: zodResolver(teacherProfileUpdateSchema),
    defaultValues: {
      phone: teacher?.phone ?? '',
      emergencyContact: '',
      address: '456 Rose Garden, Mumbai',
    },
  })

  React.useEffect(() => {
    if (teacher) {
      profileForm.reset({
        phone: teacher.phone,
        emergencyContact: teacher.phone,
        address: '456 Rose Garden, Mumbai',
      })
    }
  }, [teacher, profileForm])

  const handleApplyLeave = (data: TeacherSelfLeaveFormData) => {
    if (!teacher) return

    const requiresProof = LEAVE_TYPES_REQUIRING_PROOF.includes(
      data.leaveType as (typeof LEAVE_TYPES_REQUIRING_PROOF)[number],
    )
    if (requiresProof && !proofDocument) {
      setProofError('Upload proof document (medical certificate, etc.)')
      return
    }

    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const newRequest: LeaveRequest = {
      id: String(Date.now()),
      employeeId: teacher.id,
      employeeName: teacher.name,
      department: teacher.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      approvedBy: null,
      approvedOn: null,
      proofDocument: proofDocument
        ? {
            name: proofDocument.name,
            size: proofDocument.size,
            type: proofDocument.type,
            lastModified: proofDocument.lastModified,
            previewUrl: proofDocument.previewUrl,
          }
        : null,
    }

    setLeaveRequests((prev) => [newRequest, ...prev])
    setShowApplyLeave(false)
    leaveForm.reset()
    setProofDocument(null)
    setProofError(null)
    toast({
      title: 'Leave submitted',
      description: 'Your request is pending approval from HR.',
    })
  }

  const handleCheckIn = () => {
    setCheckedInToday(true)
    toast({
      title: 'Checked in',
      description: `Marked present at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
    })
  }

  const handleProfilePhotoChange = (dataUrl: string | null) => {
    if (!teacher) return
    if (dataUrl) {
      setProfilePhotos((prev) => ({ ...prev, [teacherId]: dataUrl }))
      saveTeacherProfilePhoto(teacherId, dataUrl)
      toast({
        title: 'Profile photo updated',
        description: 'Your new photo is visible across the portal.',
      })
    } else {
      removeTeacherProfilePhoto(teacherId)
      setProfilePhotos((prev) => {
        const next = { ...prev }
        delete next[teacherId]
        return next
      })
      toast({
        title: 'Profile photo removed',
        description: 'Reverted to the default school photo.',
      })
    }
  }

  const handleProfileSave = (data: TeacherProfileUpdateFormData) => {
    void data
    setProfileSaved(true)
    toast({
      title: 'Profile updated',
      description: 'Your contact details and profile photo have been saved.',
    })
  }

  const handleNewDutyRequest = () => {
    const newReq: TeacherDutyRequest = {
      id: String(Date.now()),
      teacherId,
      type: 'certificate',
      title: 'General request',
      details: 'Submitted from teacher portal',
      status: 'pending',
      submittedOn: new Date().toISOString().split('T')[0],
    }
    setDutyRequests((prev) => [newReq, ...prev])
    toast({ title: 'Request submitted', description: 'Admin will review your request shortly.' })
  }

  const leaveColumns: ColumnDef<LeaveRequest>[] = [
    {
      accessorKey: 'leaveType',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {leaveTypeLabels[row.original.leaveType] ?? row.original.leaveType}
        </Badge>
      ),
    },
    { accessorKey: 'startDate', header: 'From', cell: ({ row }) => formatDate(row.original.startDate) },
    { accessorKey: 'endDate', header: 'To', cell: ({ row }) => formatDate(row.original.endDate) },
    { accessorKey: 'days', header: 'Days' },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <span className="line-clamp-1 max-w-[200px] text-sm text-muted-foreground">
          {row.original.reason}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'appliedOn',
      header: 'Applied',
      cell: ({ row }) => formatDate(row.original.appliedOn),
    },
  ]

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'pending').length
  const remainingCasual = leaveBalance.casual.total - leaveBalance.casual.used
  const remainingSick = leaveBalance.sick.total - leaveBalance.sick.used
  const remainingEarned = leaveBalance.earned.total - leaveBalance.earned.used

  if (!teacher) {
    return (
      <PortalLayout>
        <p className="p-8 text-muted-foreground">Teacher account not found.</p>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <PageHeader
          title="My Portal"
          description="Apply for leave, view schedule, payslips, and manage your profile — all in one place."
          breadcrumbs={[{ label: 'My Portal' }]}
        >
          <Button size="sm" className="gap-2" onClick={() => setShowApplyLeave(true)}>
            <Plus className="h-4 w-4" />
            Apply Leave
          </Button>
        </PageHeader>

        {/* Profile banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"
        >
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className="relative shrink-0 rounded-full ring-2 ring-primary/20 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Edit profile photo"
          >
            <Avatar className="h-16 w-16">
              <AvatarImage src={profilePhotoUrl} alt={teacher.name} />
              <AvatarFallback>{teacher.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
            </Avatar>
          </button>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{teacher.name}</h2>
              <Badge variant="outline">{teacher.employeeId}</Badge>
              <StatusBadge status={teacher.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              {teacher.department} · {teacher.subject} · {teacher.classes.join(', ')}
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {teacher.email}
              </span>
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {teacher.phone}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setActiveTab('attendance')}>
              <CalendarCheck className="h-4 w-4 mr-1.5" />
              Attendance
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveTab('payslips')}>
              <Wallet className="h-4 w-4 mr-1.5" />
              Payslips
            </Button>
          </div>
        </motion.div>

        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'leave', label: 'Leave', count: leaveRequests.length },
            { id: 'attendance', label: 'Attendance' },
            { id: 'schedule', label: 'Schedule' },
            { id: 'payslips', label: 'Payslips' },
            { id: 'requests', label: 'Requests', count: myDutyRequests.length },
            { id: 'profile', label: 'Profile' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {/* Overview */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Leave balance (Casual)"
                value={remainingCasual}
                suffix={` / ${leaveBalance.casual.total}`}
                changeType="neutral"
                icon={Calendar}
              />
              <StatCard
                title="Pending requests"
                value={pendingLeaves}
                change={pendingLeaves ? 'Awaiting HR' : 'None'}
                changeType="neutral"
                icon={Clock}
              />
              <StatCard
                title="Classes today"
                value={todayClasses.length}
                icon={GraduationCap}
              />
              <StatCard
                title="Latest payslip"
                value={payroll[0] ? formatCurrency(payroll[0].netSalary) : '—'}
                change={payroll[0]?.status ?? ''}
                changeType="positive"
                icon={Wallet}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Today&apos;s classes
                  </CardTitle>
                  <CardDescription>Your teaching schedule for today</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {todayClasses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No classes scheduled for you today.</p>
                  ) : (
                    todayClasses.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div>
                          <p className="font-medium">{c.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            {c.class} · {c.room}
                          </p>
                        </div>
                        <Badge variant="outline">{c.time}</Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    School notices
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <p className="text-sm font-medium">{n.title}</p>
                      <Badge
                        variant={n.priority === 'high' ? 'destructive' : 'secondary'}
                        className="text-[10px]"
                      >
                        {n.priority}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Apply for leave', icon: Calendar, tab: 'leave', action: () => setShowApplyLeave(true) },
                  { label: 'Mark attendance', icon: LogIn, tab: 'attendance' },
                  { label: 'View payslip', icon: Download, tab: 'payslips' },
                  { label: 'Submit request', icon: Send, tab: 'requests', action: handleNewDutyRequest },
                ].map((item) => (
                  <Button
                    key={item.label}
                    variant="outline"
                    className="h-auto flex-col gap-2 py-4"
                    onClick={() => {
                      setActiveTab(item.tab)
                      item.action?.()
                    }}
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Leave */}
        {activeTab === 'leave' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Casual', balance: leaveBalance.casual, remaining: remainingCasual },
                { label: 'Sick', balance: leaveBalance.sick, remaining: remainingSick },
                { label: 'Earned', balance: leaveBalance.earned, remaining: remainingEarned },
              ].map((item) => (
                <Card key={item.label}>
                  <CardContent className="pt-5">
                    <p className="text-sm text-muted-foreground">{item.label} leave</p>
                    <p className="mt-1 text-2xl font-bold">
                      {item.remaining}
                      <span className="text-sm font-normal text-muted-foreground">
                        {' '}
                        / {item.balance.total} days left
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.balance.used} used this year
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DataTable
              columns={leaveColumns}
              data={leaveRequests}
              searchKey="reason"
              searchPlaceholder="Search your leave requests..."
            />
          </motion.div>
        )}

        {/* Attendance */}
        {activeTab === 'attendance' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Today</CardTitle>
                <CardDescription>Mark your check-in for the current school day</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {checkedInToday || todayAttendance?.status === 'present' ? (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle2 className="h-5 w-5" />
                      <span className="font-medium">
                        Present
                        {todayAttendance?.time && !checkedInToday
                          ? ` · ${todayAttendance.time}`
                          : checkedInToday
                            ? ' · Just checked in'
                            : ''}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">You have not checked in yet today.</p>
                  )}
                </div>
                <Button
                  disabled={checkedInToday || teacher.status === 'on-leave'}
                  onClick={handleCheckIn}
                  className="gap-2"
                >
                  <LogIn className="h-4 w-4" />
                  Check in now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent attendance</CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceLog.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No attendance history for this demo teacher.</p>
                ) : (
                  <div className="space-y-2">
                    {attendanceLog.map((log) => (
                      <div
                        key={log.date}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                      >
                        <span className="text-sm font-medium tabular-nums">{formatDate(log.date)}</span>
                        <StatusBadge status={log.status} />
                        <span className="text-xs text-muted-foreground">
                          {log.checkIn ? `${log.checkIn} – ${log.checkOut ?? '—'}` : 'No punch'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Schedule */}
        {activeTab === 'schedule' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Weekly timetable (Monday sample)
                </CardTitle>
                <CardDescription>Classes assigned to you · Rooms and periods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {mySchedule.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No periods found in the sample timetable for {teacher.name}.
                  </p>
                ) : (
                  mySchedule.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 rounded-lg border border-border p-4"
                    >
                      <span className="font-mono text-sm text-muted-foreground w-28">{p.time}</span>
                      <div className="flex-1">
                        <p className="font-medium">{p.subject}</p>
                        <p className="text-sm text-muted-foreground">{teacher.classes.join(', ')}</p>
                      </div>
                      <Badge variant="outline">{p.room}</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned classes</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {teacher.classes.map((cls) => (
                  <Badge key={cls} variant="secondary">
                    {cls}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Payslips */}
        {activeTab === 'payslips' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {payroll.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No payslip records found.
                </CardContent>
              </Card>
            ) : (
              payroll.map((record) => (
                <Card key={record.id}>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {record.month} {record.year}
                      </CardTitle>
                      <CardDescription>
                        Net salary ·{' '}
                        <StatusBadge status={record.status} />
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Gross</p>
                        <p className="font-semibold">{formatCurrency(record.grossSalary)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Deductions</p>
                        <p className="font-semibold text-destructive">
                          −{formatCurrency(record.totalDeductions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Net pay</p>
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(record.netSalary)}
                        </p>
                      </div>
                    </div>
                    {record.paymentDate && (
                      <p className="mt-3 text-xs text-muted-foreground">
                        Paid on {formatDate(record.paymentDate)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </motion.div>
        )}

        {/* Requests */}
        {activeTab === 'requests' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-end">
              <Button className="gap-2" onClick={handleNewDutyRequest}>
                <Plus className="h-4 w-4" />
                New request
              </Button>
            </div>
            <div className="space-y-3">
              {myDutyRequests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                    <div>
                      <p className="font-medium">{req.title}</p>
                      <p className="text-sm text-muted-foreground">{req.details}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {req.type.replace('_', ' ')} · {formatDate(req.submittedOn)}
                      </p>
                    </div>
                    <StatusBadge status={req.status} />
                  </CardContent>
                </Card>
              ))}
            </div>
            {bookIssues.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Library books issued</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {bookIssues.map((b) => (
                    <div
                      key={b.id}
                      className="flex justify-between rounded-lg border border-border p-3 text-sm"
                    >
                      <span>{b.bookTitle}</span>
                      <StatusBadge status={b.status} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Profile */}
        {activeTab === 'profile' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile & contact
                </CardTitle>
                <CardDescription>
                  Upload your photo and update contact details. Saved locally in this demo.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={profileForm.handleSubmit(handleProfileSave)}
                  className="space-y-8 max-w-xl"
                >
                  <FormSection
                    title="Profile photo"
                    description="Used on your portal, ID card, and staff directory"
                  >
                    <div className="sm:col-span-2">
                      <ProfilePhotoUpload
                        id="teacher-profile-photo"
                        name={teacher.name}
                        photoUrl={profilePhotoUrl}
                        fallbackInitials={teacher.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                        hasCustomPhoto={Boolean(profilePhotos[teacherId])}
                        onChange={handleProfilePhotoChange}
                      />
                    </div>
                  </FormSection>
                  <FormSection title="Contact" description="Keep your phone and emergency contact up to date">
                    <FormField
                      label="Phone"
                      error={profileForm.formState.errors.phone?.message}
                      required
                    >
                      <Input {...profileForm.register('phone')} />
                    </FormField>
                    <FormField
                      label="Emergency contact"
                      error={profileForm.formState.errors.emergencyContact?.message}
                      required
                    >
                      <Input {...profileForm.register('emergencyContact')} />
                    </FormField>
                    <FormField
                      label="Address"
                      error={profileForm.formState.errors.address?.message}
                      required
                      className="sm:col-span-2"
                    >
                      <Textarea {...profileForm.register('address')} rows={3} />
                    </FormField>
                  </FormSection>
                  <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-sm">
                    <p className="font-medium flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Read-only (contact HR to change)
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      {teacher.email}
                    </p>
                    <p className="text-muted-foreground">
                      Qualification: {teacher.qualification} · {teacher.experience} years experience
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5" />
                      Joined {formatDate(teacher.joiningDate)}
                    </p>
                  </div>
                  <Button type="submit" disabled={profileSaved}>
                    {profileSaved ? 'Saved' : 'Save changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      <SlideOver
        open={showApplyLeave}
        onClose={() => {
          setShowApplyLeave(false)
          leaveForm.reset()
          setProofDocument(null)
          setProofError(null)
        }}
        title="Apply for leave"
        description="Submit a leave request to HR. Sick and maternity/paternity leave require proof."
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowApplyLeave(false)
                leaveForm.reset()
                setProofDocument(null)
                setProofError(null)
              }}
            >
              Cancel
            </Button>
            <Button onClick={leaveForm.handleSubmit(handleApplyLeave)}>Submit request</Button>
          </div>
        }
      >
        <TeacherLeaveForm
          form={leaveForm}
          proofDocument={proofDocument}
          proofError={proofError}
          onProofChange={(file) => {
            setProofDocument(file)
            setProofError(null)
          }}
          remaining={{
            casual: remainingCasual,
            sick: remainingSick,
            earned: remainingEarned,
          }}
        />
      </SlideOver>
    </PortalLayout>
  )
}

function TeacherLeaveForm({
  form,
  proofDocument,
  proofError,
  onProofChange,
  remaining,
}: {
  form: ReturnType<typeof useForm<TeacherSelfLeaveFormData>>
  proofDocument: UploadedFileMeta | null
  proofError: string | null
  onProofChange: (file: UploadedFileMeta | null) => void
  remaining: { casual: number; sick: number; earned: number }
}) {
  const { register, formState: { errors }, setValue, watch } = form
  const leaveType = watch('leaveType')
  const proofRequired = LEAVE_TYPES_REQUIRING_PROOF.includes(
    leaveType as (typeof LEAVE_TYPES_REQUIRING_PROOF)[number],
  )

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-border bg-muted/25 p-3 text-xs text-muted-foreground">
        <p>
          Balance: Casual {remaining.casual} · Sick {remaining.sick} · Earned {remaining.earned}{' '}
          days
        </p>
      </div>
      <FormSection title="Leave details" description="Select dates and type">
        <FormField label="Leave type" error={errors.leaveType?.message} required className="sm:col-span-2">
          <Select
            value={leaveType}
            onValueChange={(v) => setValue('leaveType', v as TeacherSelfLeaveFormData['leaveType'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Casual leave</SelectItem>
              <SelectItem value="sick">Sick leave</SelectItem>
              <SelectItem value="earned">Earned leave</SelectItem>
              <SelectItem value="maternity">Maternity leave</SelectItem>
              <SelectItem value="paternity">Paternity leave</SelectItem>
              <SelectItem value="unpaid">Unpaid leave</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Start date" error={errors.startDate?.message} required>
          <Input {...register('startDate')} type="date" />
        </FormField>
        <FormField label="End date" error={errors.endDate?.message} required>
          <Input {...register('endDate')} type="date" />
        </FormField>
        <FormField label="Reason" error={errors.reason?.message} required className="sm:col-span-2">
          <Textarea {...register('reason')} placeholder="Explain why you need leave" rows={4} />
        </FormField>
      </FormSection>
      <FormSection
        title="Supporting documents"
        description={
          proofRequired
            ? 'Required for this leave type.'
            : 'Optional supporting document.'
        }
      >
        <div className="sm:col-span-2">
          <FileUpload
            id="teacher-leave-proof"
            label="Proof document"
            description="JPG, PNG, or PDF · Max 10 MB"
            required={proofRequired}
            value={proofDocument}
            onChange={onProofChange}
            error={proofError ?? undefined}
          />
        </div>
      </FormSection>
    </div>
  )
}
