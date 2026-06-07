'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  CreditCard,
  Calendar,
  UserCheck,
  Clock,
  Megaphone,
  UserPlus,
  Bus,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  MapPin,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  useFees,
  useExams,
  useLeaveRequests,
  usePayroll,
  useNotifications,
  useAdmissions,
  useTransportRoutes,
  useTimetable,
} from '@/hooks/api'

function WidgetCard({
  title,
  description,
  icon: Icon,
  children,
  action,
  delay = 0,
}: {
  title: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  action?: { label: string; onClick?: () => void }
  delay?: number
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {description && <CardDescription className="text-xs">{description}</CardDescription>}
              </div>
            </div>
            {action && (
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                {action.label}
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  )
}

function EmptyWidgetState({ message }: { message: string }) {
  return <p className="py-8 text-center text-sm text-muted-foreground">{message}</p>
}

export function RecentFeePaymentsWidget() {
  const { data, isLoading } = useFees({ page: 1, pageSize: 20 })
  const payments = (data?.items ?? []).filter((f) => f.status === 'paid' || f.paid > 0).slice(0, 5)

  return (
    <WidgetCard title="Recent Fee Payments" icon={CreditCard} action={{ label: 'View all' }} delay={0.3}>
      <ScrollArea className="h-[240px] pr-3">
        {isLoading ? (
          <EmptyWidgetState message="Loading payments…" />
        ) : payments.length === 0 ? (
          <EmptyWidgetState message="No recent payments" />
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${payment.studentName}`} />
                    <AvatarFallback>{payment.studentName.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{payment.studentName}</p>
                    <p className="text-xs text-muted-foreground">Class {payment.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{payment.paid.toLocaleString()}</p>
                  <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'} className="text-[10px]">
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  )
}

export function UpcomingExamsWidget() {
  const { data, isLoading } = useExams({ page: 1, pageSize: 5 })
  const today = new Date().toISOString().split('T')[0]
  const exams = (data?.items ?? [])
    .filter((e) => e.status === 'scheduled' && e.date >= today)
    .slice(0, 5)

  return (
    <WidgetCard title="Upcoming Exams" icon={Calendar} action={{ label: 'View schedule' }} delay={0.35}>
      <ScrollArea className="h-[240px] pr-3">
        {isLoading ? (
          <EmptyWidgetState message="Loading exams…" />
        ) : exams.length === 0 ? (
          <EmptyWidgetState message="No upcoming exams" />
        ) : (
          <div className="space-y-3">
            {exams.map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{exam.subject}</p>
                    <p className="text-xs text-muted-foreground">Class {exam.class}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{exam.date}</p>
                  <p className="text-xs text-muted-foreground">{exam.startTime}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  )
}

export function TeacherAttendanceWidget() {
  const { data, isLoading } = useLeaveRequests({ page: 1, pageSize: 5 })
  const requests = (data?.items ?? []).slice(0, 5)

  return (
    <WidgetCard title="Leave Requests" description="Recent" icon={UserCheck} action={{ label: 'View all' }} delay={0.4}>
      <ScrollArea className="h-[240px] pr-3">
        {isLoading ? (
          <EmptyWidgetState message="Loading leave requests…" />
        ) : requests.length === 0 ? (
          <EmptyWidgetState message="No leave requests" />
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.employeeName}`} />
                    <AvatarFallback>{req.employeeName.split(' ').slice(-1)[0][0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{req.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{req.department}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] capitalize">{req.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  )
}

export function PendingSalaryWidget() {
  const { data, isLoading } = usePayroll({ page: 1, pageSize: 5 })
  const pending = (data?.items ?? []).filter((r) => r.status === 'pending' || r.status === 'approved').slice(0, 5)

  return (
    <WidgetCard title="Salary Approvals" description="Pending" icon={Clock} action={{ label: 'Approve all' }} delay={0.45}>
      <ScrollArea className="h-[240px] pr-3">
        {isLoading ? (
          <EmptyWidgetState message="Loading payroll…" />
        ) : pending.length === 0 ? (
          <EmptyWidgetState message="No pending approvals" />
        ) : (
          <div className="space-y-3">
            {pending.map((salary) => (
              <div key={salary.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${salary.employeeName}`} />
                    <AvatarFallback>{salary.employeeName.split(' ').slice(-1)[0][0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{salary.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{salary.month}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">₹{salary.netSalary.toLocaleString()}</p>
                  <Badge variant={salary.status === 'approved' ? 'default' : 'secondary'} className="text-[10px]">
                    {salary.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  )
}

export function SchoolNoticesWidget() {
  const { data, isLoading } = useNotifications({ page: 1, pageSize: 5 })
  const notices = data?.items ?? []

  const priorityColors = {
    high: 'bg-red-500/10 text-red-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    low: 'bg-green-500/10 text-green-500',
    info: 'bg-primary/10 text-primary',
    warning: 'bg-yellow-500/10 text-yellow-500',
    success: 'bg-green-500/10 text-green-500',
    error: 'bg-destructive/10 text-destructive',
  }

  return (
    <WidgetCard title="School Notices" icon={Megaphone} action={{ label: 'View all' }} delay={0.5}>
      <ScrollArea className="h-[240px] pr-3">
        {isLoading ? (
          <EmptyWidgetState message="Loading notices…" />
        ) : notices.length === 0 ? (
          <EmptyWidgetState message="No notices" />
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => (
              <div key={notice.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium">{notice.title}</p>
                  <Badge variant="outline" className={cn('text-[10px]', priorityColors[notice.type as keyof typeof priorityColors] ?? priorityColors.info)}>
                    {notice.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{notice.sentAt}</p>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  )
}

export function RecentAdmissionsWidget() {
  const { data, isLoading } = useAdmissions({ page: 1, pageSize: 5 })
  const admissions = data?.items ?? []

  return (
    <WidgetCard title="Recent Admissions" icon={UserPlus} action={{ label: 'View all' }} delay={0.55}>
      <ScrollArea className="h-[240px] pr-3">
        {isLoading ? (
          <EmptyWidgetState message="Loading admissions…" />
        ) : admissions.length === 0 ? (
          <EmptyWidgetState message="No recent admissions" />
        ) : (
          <div className="space-y-3">
            {admissions.map((admission) => (
              <div key={admission.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${admission.applicantName}`} />
                    <AvatarFallback>{admission.applicantName.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{admission.applicantName}</p>
                    <p className="text-xs text-muted-foreground">Class {admission.classSought}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">{admission.createdAt.split('T')[0]}</p>
                  <Badge variant="secondary" className="text-[10px] capitalize">{admission.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  )
}

export function TransportTrackingWidget() {
  const { data, isLoading } = useTransportRoutes({ page: 1, pageSize: 5 })
  const routes = data?.items ?? []

  const statusColors = {
    active: 'bg-green-500',
    maintenance: 'bg-yellow-500',
    inactive: 'bg-red-500',
  }

  return (
    <WidgetCard title="Transport Status" icon={Bus} action={{ label: 'Track all' }} delay={0.6}>
      <ScrollArea className="h-[240px] pr-3">
        {isLoading ? (
          <EmptyWidgetState message="Loading routes…" />
        ) : routes.length === 0 ? (
          <EmptyWidgetState message="No transport routes" />
        ) : (
          <div className="space-y-3">
            {routes.map((transport) => (
              <div key={transport.id} className="p-3 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{transport.routeName}</p>
                  <div className="flex items-center gap-1.5">
                    <div className={cn('h-2 w-2 rounded-full', statusColors[transport.status as keyof typeof statusColors] ?? statusColors.inactive)} />
                    <span className="text-xs capitalize text-muted-foreground">{transport.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {transport.vehicleNumber}
                  </span>
                  <span>{transport.totalStudents} students</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  )
}

export function TodaysClassesWidget() {
  const { data, isLoading } = useTimetable({ page: 1, pageSize: 100 })
  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const classes = (data?.items ?? []).filter((e) => e.day === dayName).slice(0, 5)

  return (
    <WidgetCard title="Today's Classes" icon={BookOpen} action={{ label: 'Full schedule' }} delay={0.65}>
      <ScrollArea className="h-[240px] pr-3">
        {isLoading ? (
          <EmptyWidgetState message="Loading schedule…" />
        ) : classes.length === 0 ? (
          <EmptyWidgetState message="No classes scheduled today" />
        ) : (
          <div className="space-y-3">
            {classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cls.subject}</p>
                    <p className="text-xs text-muted-foreground">Class {cls.class}-{cls.section} · {cls.teacher}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{cls.startTime}</p>
                  <p className="text-xs text-muted-foreground">{cls.room}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </WidgetCard>
  )
}

export function WidgetsSection() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <RecentFeePaymentsWidget />
      <UpcomingExamsWidget />
      <TeacherAttendanceWidget />
      <PendingSalaryWidget />
      <SchoolNoticesWidget />
      <RecentAdmissionsWidget />
      <TransportTrackingWidget />
      <TodaysClassesWidget />
    </div>
  )
}
