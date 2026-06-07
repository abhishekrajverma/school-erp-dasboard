'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  BookOpen,
  Calendar,
  GraduationCap,
  Landmark,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
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
  useAdmissions,
  useDashboard,
  useExams,
  useLeaveRequests,
  useNotifications,
} from '@/hooks/api'
import { useAuth } from '@/components/providers/auth-provider'
import {
  getPrincipalPortalTabFromSearch,
  getPrincipalPortalTabHref,
  PRINCIPAL_PORTAL_TABS,
  type PrincipalPortalTabId,
} from '@/lib/principal-portal-nav'

export default function PrincipalPortalPage() {
  return (
    <PortalGuard allowedRoles={['principal']}>
      <React.Suspense fallback={null}>
        <PrincipalPortalContent />
      </React.Suspense>
    </PortalGuard>
  )
}

function PrincipalPortalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = getPrincipalPortalTabFromSearch(searchParams.get('tab'))

  const setActiveTab = React.useCallback(
    (tab: PrincipalPortalTabId) => {
      router.replace(getPrincipalPortalTabHref(tab), { scroll: false })
    },
    [router],
  )

  const { user } = useAuth()
  const dashboardQuery = useDashboard()
  const leaveQuery = useLeaveRequests()
  const admissionsQuery = useAdmissions()
  const examsQuery = useExams()
  const noticesQuery = useNotifications()

  const profile = {
    name: user?.name ?? 'Principal',
    email: user?.email ?? '',
    role: 'Principal',
    avatar: null as string | null,
  }
  const stats = dashboardQuery.data?.stats ?? {
    totalStudents: 0,
    totalTeachers: 0,
    pendingFees: 0,
    monthlyRevenue: 0,
    attendancePercentage: 0,
    salaryPaid: 0,
    transportRoutes: 0,
    newAdmissions: 0,
  }
  const pendingLeaves = (leaveQuery.data?.items ?? []).filter((l) => l.status === 'pending')
  const notices = noticesQuery.data?.items ?? []
  const upcomingExams = (examsQuery.data?.items ?? []).filter((e) => e.status === 'scheduled')
  const scheduledExamCount = upcomingExams.length
  const recentAdmissions = admissionsQuery.data?.items ?? []
  const recentPayments: { id: string; studentName: string; amount: number; paidAt: string }[] = []

  return (
    <PortalLayout>
      <div className="space-y-6">
        <PageHeader
          title="Principal Portal"
          description="School-wide overview, academics, staff, and finance at a glance."
          breadcrumbs={[{ label: 'Principal Office' }]}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"
        >
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{profile.name}</h2>
              <Badge variant="secondary" className="gap-1">
                <Landmark className="h-3 w-3" />
                {profile.role}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        </motion.div>

        <Tabs
          tabs={PRINCIPAL_PORTAL_TABS.map((tab) => ({
            id: tab.id,
            label: tab.label,
            ...(tab.id === 'staff' && pendingLeaves.length > 0
              ? { count: pendingLeaves.length }
              : {}),
            ...(tab.id === 'notices' ? { count: notices.length } : {}),
          }))}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as PrincipalPortalTabId)}
        />

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Active students"
                value={stats.totalStudents}
                icon={GraduationCap}
              />
              <StatCard title="Teaching staff" value={stats.totalTeachers} icon={Users} />
              <StatCard
                title="Attendance today"
                value={`${stats.attendancePercentage}%`}
                icon={UserCheck}
              />
              <StatCard
                title="Pending fees"
                value={formatCurrency(stats.pendingFees)}
                icon={Wallet}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Needs your attention
                  </CardTitle>
                  <CardDescription>Items awaiting principal review</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('staff')}
                    className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="text-sm font-medium">Leave requests pending</span>
                    <Badge>{pendingLeaves.length}</Badge>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('finance')}
                    className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="text-sm font-medium">Outstanding fee collection</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(stats.pendingFees)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('academics')}
                    className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="text-sm font-medium">Scheduled exams</span>
                    <Badge variant="outline">{scheduledExamCount}</Badge>
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    This month
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-muted-foreground">Revenue:</span>{' '}
                    <span className="font-medium">{formatCurrency(stats.monthlyRevenue)}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">New admissions:</span>{' '}
                    <span className="font-medium">{stats.newAdmissions}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Transport routes:</span>{' '}
                    <span className="font-medium">{stats.transportRoutes}</span>
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'academics' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard title="Scheduled exams" value={scheduledExamCount} icon={BookOpen} />
              <StatCard title="New admissions (Jun)" value={stats.newAdmissions} icon={GraduationCap} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming exams</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {upcomingExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{exam.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          Class {exam.class} · {exam.startTime}
                        </p>
                      </div>
                      <Badge variant="outline">{formatDate(exam.date)}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent admissions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentAdmissions.map((admission) => (
                    <div
                      key={admission.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{admission.applicantName}</p>
                        <p className="text-xs text-muted-foreground">
                          Class {admission.classSought} · {admission.status}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(admission.createdAt)}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'staff' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard title="Pending leave" value={pendingLeaves.length} icon={Calendar} />
              <StatCard title="Payroll (month)" value={formatCurrency(stats.salaryPaid)} icon={Wallet} />
            </div>
            {pendingLeaves.length > 0 && (
              <Card className="border-amber-500/25">
                <CardHeader>
                  <CardTitle className="text-base">Pending leave approvals</CardTitle>
                  <CardDescription>Review with HR before final sign-off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingLeaves.map((leave) => (
                    <div
                      key={leave.id}
                      className="rounded-lg border border-border p-3 text-sm space-y-1"
                    >
                      <p className="font-medium">{leave.employeeName}</p>
                      <p className="text-muted-foreground capitalize">
                        {leave.leaveType} · {formatDate(leave.startDate)} –{' '}
                        {formatDate(leave.endDate)} ({leave.days} days)
                      </p>
                      <p className="text-xs line-clamp-2">{leave.reason}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'finance' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Monthly revenue"
                value={formatCurrency(stats.monthlyRevenue)}
                icon={TrendingUp}
              />
              <StatCard
                title="Pending collection"
                value={formatCurrency(stats.pendingFees)}
                icon={Wallet}
              />
              <StatCard
                title="Salary disbursed"
                value={formatCurrency(stats.salaryPaid)}
                icon={Users}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent fee payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentPayments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    Payment history loads from the fees API when available.
                  </p>
                ) : (
                  recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
                    >
                      <div>
                        <p className="font-medium text-sm">{payment.studentName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.paidAt)}
                        </p>
                      </div>
                      <span className="font-medium text-sm">
                        {formatCurrency(payment.amount)}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === 'notices' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">School notices</CardTitle>
                <CardDescription>Circulars and announcements for the school community</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-4"
                  >
                    <div>
                      <p className="font-medium">{notice.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDate(notice.sentAt)}
                      </p>
                    </div>
                    <Badge variant="secondary">{notice.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </PortalLayout>
  )
}
