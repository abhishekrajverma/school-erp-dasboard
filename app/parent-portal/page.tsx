'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Bus, CalendarCheck, CreditCard, Users } from 'lucide-react'
import { PortalGuard } from '@/components/portal/portal-guard'
import { PortalLayout } from '@/components/portal/portal-layout'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, StatCard, Tabs } from '@/components/shared/page-components'
import { StatusBadge } from '@/components/shared/data-table'
import { getSession } from '@/lib/auth'
import { formatCurrency, formatDate } from '@/lib/format'
import { ChildAttendancePanel } from '@/components/parent-portal/child-attendance-panel'
import { ParentFeesPanel } from '@/components/parent-portal/parent-fees-panel'
import { ParentTransportPanel } from '@/components/parent-portal/parent-transport-panel'
import { ParentNoticesPanel } from '@/components/parent-portal/parent-notices-panel'
import { getParentNoticesRich } from '@/lib/parent-notices'
import { getChildTransportDetails, hasTransportOptIn } from '@/lib/parent-transport'
import {
  getParentById,
  getParentChildren,
  getChildDailyAttendanceLog,
  getChildExams,
} from '@/lib/parent-portal'
import { getParentChildFees, summarizeParentFees } from '@/lib/parent-fees'

export default function ParentPortalPage() {
  return (
    <PortalGuard allowedRoles={['parent']}>
      <ParentPortalContent />
    </PortalGuard>
  )
}

function ParentPortalContent() {
  const session = getSession()
  const parentId = session?.userId ?? ''
  const [activeTab, setActiveTab] = React.useState('overview')
  const [selectedChildId, setSelectedChildId] = React.useState('')

  const parent = getParentById(parentId)
  const children = getParentChildren(parentId)

  React.useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id)
    }
  }, [children, selectedChildId])

  const selectedChild = children.find((c) => c.id === selectedChildId) ?? children[0]
  const childFeesSummary = selectedChild
    ? summarizeParentFees(getParentChildFees(selectedChild.id))
    : null
  const childDailyLog = selectedChild ? getChildDailyAttendanceLog(selectedChild.id) : []
  const childExams = selectedChild ? getChildExams(selectedChild.class) : []
  const childTransport = selectedChild ? getChildTransportDetails(selectedChild.id) : null
  const parentNotices = getParentNoticesRich()
  const upcomingPtm = parentNotices.find((n) => n.type === 'ptm')

  const totalPendingAll = children.reduce((sum, child) => {
    return sum + summarizeParentFees(getParentChildFees(child.id)).pending
  }, 0)

  if (!parent) {
    return (
      <PortalLayout>
        <p className="text-muted-foreground">Parent account not found.</p>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <PageHeader
          title="Parent Portal"
          description="Track attendance, fees, transport, and school updates for your children."
          breadcrumbs={[{ label: 'My Portal' }]}
        />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center"
        >
          <Avatar className="h-16 w-16 ring-2 ring-primary/20">
            <AvatarImage src={parent.avatar} alt={parent.name} />
            <AvatarFallback>{parent.firstName[0]}{parent.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h2 className="text-lg font-semibold">{parent.name}</h2>
            <p className="text-sm text-muted-foreground">
              {parent.occupation} · {children.length} linked{' '}
              {children.length === 1 ? 'student' : 'students'}
            </p>
            <p className="text-xs text-muted-foreground">{parent.phone} · {parent.email}</p>
          </div>
        </motion.div>

        {children.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChildId(child.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  selectedChild?.id === child.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border hover:bg-muted'
                }`}
              >
                {child.name} ({child.class})
              </button>
            ))}
          </div>
        )}

        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'children', label: 'My Children', count: children.length },
            { id: 'fees', label: 'Fees' },
            { id: 'attendance', label: 'Attendance' },
            { id: 'transport', label: 'Transport' },
            { id: 'notices', label: 'Notices', count: parentNotices.length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === 'overview' && selectedChild && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Children" value={children.length} icon={Users} />
              <StatCard
                title="Selected student"
                value={selectedChild.name.split(' ').slice(-1)[0]}
                icon={Users}
              />
              <StatCard
                title="Attendance"
                value={`${selectedChild.attendance}%`}
                icon={CalendarCheck}
              />
              <StatCard
                title="Total pending fees"
                value={formatCurrency(totalPendingAll)}
                icon={CreditCard}
              />
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick summary — {selectedChild.name}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Class:</span> {selectedChild.class}
                </p>
                <p>
                  <span className="text-muted-foreground">Fee status:</span>{' '}
                  <StatusBadge status={selectedChild.feeStatus} />
                </p>
                <p>
                  <span className="text-muted-foreground">Upcoming exams:</span>{' '}
                  {childExams.filter((e) => e.status === 'scheduled').length}
                </p>
                <p>
                  <span className="text-muted-foreground">Parent phone:</span> {parent.phone}
                </p>
              </CardContent>
            </Card>
            {childFeesSummary && childFeesSummary.pending > 0 && (
              <Card className="border-primary/20">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                  <div>
                    <p className="font-medium">Fees due for {selectedChild.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(childFeesSummary.pending)} outstanding
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => setActiveTab('fees')}
                  >
                    Pay fees →
                  </button>
                </CardContent>
              </Card>
            )}
            {upcomingPtm && (
              <Card className="border-violet-500/25 bg-violet-500/5">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300">
                      Upcoming PTM
                    </p>
                    <p className="font-medium">{upcomingPtm.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {upcomingPtm.details.find((d) => d.label === 'Date')?.value ??
                        formatDate(upcomingPtm.eventDate)}
                      {' · '}
                      {upcomingPtm.details.find((d) => d.label === 'Meeting hours')?.value ??
                        'See notices for timing'}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => setActiveTab('notices')}
                  >
                    Full details →
                  </button>
                </CardContent>
              </Card>
            )}
            {childTransport && (
              <Card className="border-primary/15">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                      <Bus className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{childTransport.route.routeName}</p>
                      <p className="text-sm text-muted-foreground">
                        {childTransport.vehicle.vehicleNumber} · Pickup {childTransport.pickupStop.morningPickup} at{' '}
                        {childTransport.pickupStop.name}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => setActiveTab('transport')}
                  >
                    Track bus →
                  </button>
                </CardContent>
              </Card>
            )}
            {childDailyLog[0] && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Today&apos;s attendance</CardTitle>
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => setActiveTab('attendance')}
                  >
                    View full log
                  </button>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{formatDate(childDailyLog[0].date)}</p>
                    <p className="text-sm text-muted-foreground">
                      {childDailyLog[0].checkIn
                        ? `${childDailyLog[0].checkIn} – ${childDailyLog[0].checkOut ?? '—'}`
                        : childDailyLog[0].remarks || 'No punch recorded'}
                    </p>
                  </div>
                  <StatusBadge status={childDailyLog[0].status} />
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === 'children' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {children.map((child) => (
              <Card key={child.id}>
                <CardHeader className="flex flex-row gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={child.avatar} />
                    <AvatarFallback>{child.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{child.name}</CardTitle>
                    <CardDescription>
                      Class {child.class} · Roll {child.rollNo}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant="outline">Attendance {child.attendance}%</Badge>
                  <StatusBadge status={child.feeStatus} />
                  <StatusBadge status={child.status} />
                  {hasTransportOptIn(child.id) ? (
                    <Badge variant="secondary" className="gap-1">
                      <Bus className="h-3 w-3" />
                      Transport
                    </Badge>
                  ) : (
                    <Badge variant="outline">No transport</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'fees' && selectedChild && parent && (
          <ParentFeesPanel
            studentId={selectedChild.id}
            studentName={selectedChild.name}
            parentId={parent.id}
            parentName={parent.name}
          />
        )}

        {activeTab === 'attendance' && selectedChild && (
          <ChildAttendancePanel
            studentId={selectedChild.id}
            studentName={selectedChild.name}
          />
        )}

        {activeTab === 'transport' && selectedChild && (
          <ParentTransportPanel
            studentId={selectedChild.id}
            studentName={selectedChild.name}
          />
        )}

        {activeTab === 'notices' && (
          <ParentNoticesPanel onNavigateToFees={() => setActiveTab('fees')} />
        )}
      </div>
    </PortalLayout>
  )
}
