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
  recentFeePayments,
  upcomingExams,
  teacherAttendance,
  pendingSalaryApprovals,
  schoolNotices,
  recentAdmissions,
  transportData,
  todaysClasses,
} from '@/lib/data'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">{title}</CardTitle>
                {description && (
                  <CardDescription className="text-xs">{description}</CardDescription>
                )}
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

export function RecentFeePaymentsWidget() {
  return (
    <WidgetCard
      title="Recent Fee Payments"
      icon={CreditCard}
      action={{ label: 'View all' }}
      delay={0.3}
    >
      <ScrollArea className="h-[240px] pr-3">
        <div className="space-y-3">
          {recentFeePayments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${payment.student}`} />
                  <AvatarFallback>{payment.student.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{payment.student}</p>
                  <p className="text-xs text-muted-foreground">Class {payment.class}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">₹{payment.amount.toLocaleString()}</p>
                <Badge
                  variant={payment.status === 'completed' ? 'default' : 'secondary'}
                  className="text-[10px]"
                >
                  {payment.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </WidgetCard>
  )
}

export function UpcomingExamsWidget() {
  return (
    <WidgetCard
      title="Upcoming Exams"
      icon={Calendar}
      action={{ label: 'View schedule' }}
      delay={0.35}
    >
      <ScrollArea className="h-[240px] pr-3">
        <div className="space-y-3">
          {upcomingExams.map((exam) => (
            <div
              key={exam.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
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
                <p className="text-xs text-muted-foreground">{exam.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </WidgetCard>
  )
}

export function TeacherAttendanceWidget() {
  const statusIcons = {
    present: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    absent: <XCircle className="h-4 w-4 text-red-500" />,
    late: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  }

  return (
    <WidgetCard
      title="Teacher Attendance"
      description="Today"
      icon={UserCheck}
      action={{ label: 'View all' }}
      delay={0.4}
    >
      <ScrollArea className="h-[240px] pr-3">
        <div className="space-y-3">
          {teacherAttendance.map((teacher) => (
            <div
              key={teacher.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name}`} />
                  <AvatarFallback>{teacher.name.split(' ').slice(-1)[0][0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{teacher.name}</p>
                  <p className="text-xs text-muted-foreground">{teacher.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{teacher.time}</span>
                {statusIcons[teacher.status as keyof typeof statusIcons]}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </WidgetCard>
  )
}

export function PendingSalaryWidget() {
  return (
    <WidgetCard
      title="Salary Approvals"
      description="Pending"
      icon={Clock}
      action={{ label: 'Approve all' }}
      delay={0.45}
    >
      <ScrollArea className="h-[240px] pr-3">
        <div className="space-y-3">
          {pendingSalaryApprovals.map((salary) => (
            <div
              key={salary.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${salary.name}`} />
                  <AvatarFallback>{salary.name.split(' ').slice(-1)[0][0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{salary.name}</p>
                  <p className="text-xs text-muted-foreground">{salary.month}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">₹{salary.amount.toLocaleString()}</p>
                <Badge
                  variant={salary.status === 'approved' ? 'default' : 'secondary'}
                  className="text-[10px]"
                >
                  {salary.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </WidgetCard>
  )
}

export function SchoolNoticesWidget() {
  const priorityColors = {
    high: 'bg-red-500/10 text-red-500',
    medium: 'bg-yellow-500/10 text-yellow-500',
    low: 'bg-green-500/10 text-green-500',
  }

  return (
    <WidgetCard
      title="School Notices"
      icon={Megaphone}
      action={{ label: 'View all' }}
      delay={0.5}
    >
      <ScrollArea className="h-[240px] pr-3">
        <div className="space-y-3">
          {schoolNotices.map((notice) => (
            <div
              key={notice.id}
              className="p-3 rounded-lg bg-muted/50 space-y-2"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium">{notice.title}</p>
                <Badge
                  variant="outline"
                  className={cn('text-[10px]', priorityColors[notice.priority as keyof typeof priorityColors])}
                >
                  {notice.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{notice.date}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </WidgetCard>
  )
}

export function RecentAdmissionsWidget() {
  return (
    <WidgetCard
      title="Recent Admissions"
      icon={UserPlus}
      action={{ label: 'View all' }}
      delay={0.55}
    >
      <ScrollArea className="h-[240px] pr-3">
        <div className="space-y-3">
          {recentAdmissions.map((admission) => (
            <div
              key={admission.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${admission.name}`} />
                  <AvatarFallback>{admission.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{admission.name}</p>
                  <p className="text-xs text-muted-foreground">Class {admission.class}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">{admission.date}</p>
                <p className="text-xs text-muted-foreground">{admission.guardian}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </WidgetCard>
  )
}

export function TransportTrackingWidget() {
  const statusColors = {
    active: 'bg-green-500',
    maintenance: 'bg-yellow-500',
    inactive: 'bg-red-500',
  }

  return (
    <WidgetCard
      title="Transport Status"
      icon={Bus}
      action={{ label: 'Track all' }}
      delay={0.6}
    >
      <ScrollArea className="h-[240px] pr-3">
        <div className="space-y-3">
          {transportData.map((transport) => (
            <div
              key={transport.id}
              className="p-3 rounded-lg bg-muted/50 space-y-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{transport.route}</p>
                <div className="flex items-center gap-1.5">
                  <div className={cn('h-2 w-2 rounded-full', statusColors[transport.status as keyof typeof statusColors])} />
                  <span className="text-xs capitalize text-muted-foreground">{transport.status}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {transport.bus}
                </span>
                <span>{transport.students} students</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </WidgetCard>
  )
}

export function TodaysClassesWidget() {
  return (
    <WidgetCard
      title="Today's Classes"
      icon={BookOpen}
      action={{ label: 'Full schedule' }}
      delay={0.65}
    >
      <ScrollArea className="h-[240px] pr-3">
        <div className="space-y-3">
          {todaysClasses.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{cls.subject}</p>
                  <p className="text-xs text-muted-foreground">Class {cls.class} • {cls.teacher}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{cls.time}</p>
                <p className="text-xs text-muted-foreground">{cls.room}</p>
              </div>
            </div>
          ))}
        </div>
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
