'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Bus, CalendarCheck, CreditCard, Loader2, Users } from 'lucide-react'
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
import { ParentProfilePanel } from '@/components/parent-portal/parent-profile-panel'
import {
  getParentProfileDetails,
  getParentProfilePhotoUrl,
  loadParentProfilePhotos,
} from '@/lib/parent-profile'
import { summarizeParentFees } from '@/lib/parent-fees'
import {
  useExams,
  useNotifications,
  useParentChildAttendance,
  useParentChildFees,
  useParentChildTransport,
  useParentChildren,
  useParentProfile,
} from '@/hooks/api'
import {
  getParentPortalTabFromSearch,
  getParentPortalTabHref,
  PARENT_PORTAL_TABS,
  type ParentPortalTabId,
} from '@/lib/parent-portal-nav'

export default function ParentPortalPage() {
  return (
    <PortalGuard allowedRoles={['parent']}>
      <React.Suspense fallback={null}>
        <ParentPortalContent />
      </React.Suspense>
    </PortalGuard>
  )
}

function ParentPortalContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const session = getSession()
  const parentId = session?.userId ?? ''
  const activeTab = getParentPortalTabFromSearch(searchParams.get('tab'))
  const [selectedChildId, setSelectedChildId] = React.useState('')
  const [profileVersion, setProfileVersion] = React.useState(0)

  const refreshProfile = React.useCallback(() => {
    setProfileVersion((v) => v + 1)
    window.dispatchEvent(new Event('edusync-parent-profile-updated'))
  }, [])

  const setActiveTab = React.useCallback(
    (tab: ParentPortalTabId) => {
      router.replace(getParentPortalTabHref(tab), { scroll: false })
    },
    [router],
  )

  const parentQuery = useParentProfile()
  const childrenQuery = useParentChildren()
  const parent = parentQuery.data
  const children = childrenQuery.data ?? []
  const selectedChild = children.find((c) => c.id === selectedChildId) ?? children[0]

  const childFeesQuery = useParentChildFees(selectedChild?.id ?? '')
  const childAttendanceQuery = useParentChildAttendance(selectedChild?.id ?? '')
  const childTransportQuery = useParentChildTransport(selectedChild?.id ?? '')
  const childExamsQuery = useExams(
    selectedChild ? ({ className: selectedChild.class } as never) : undefined,
  )
  const noticesQuery = useNotifications({ targetAudience: 'parents' } as never)

  const profilePhotos = React.useMemo(() => loadParentProfilePhotos(), [profileVersion])
  const profileDetails = React.useMemo(
    () => (parent ? getParentProfileDetails(parent.id, parent) : null),
    [parent, profileVersion],
  )
  const profilePhotoUrl = parent
    ? getParentProfilePhotoUrl(parent.id, profilePhotos, parent.avatar ?? undefined)
    : ''

  const childFeesSummary = selectedChild
    ? summarizeParentFees((childFeesQuery.data ?? []) as never)
    : null
  const childDailyLog = (childAttendanceQuery.data ?? []).slice(0, 1)
  const childExams = childExamsQuery.data?.items ?? []
  const childTransport = childTransportQuery.data
  const parentNotices = noticesQuery.data?.items ?? []
  const upcomingPtm = parentNotices.find((n) => n.type === 'ptm')

  const totalPendingAll = childFeesSummary?.pending ?? 0

  React.useEffect(() => {
    if (children.length > 0 && !selectedChildId) {
      setSelectedChildId(children[0].id)
    }
  }, [children, selectedChildId])

  if (parentQuery.isLoading || childrenQuery.isLoading) {
    return (
      <PortalLayout>
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PortalLayout>
    )
  }

  if (parentQuery.isError || !parent) {
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
            <AvatarImage src={profilePhotoUrl} alt={parent.name} />
            <AvatarFallback>{parent.firstName[0]}{parent.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <h2 className="text-lg font-semibold">{parent.name}</h2>
            <p className="text-sm text-muted-foreground">
              {profileDetails?.occupation ?? parent.occupation} · {children.length} linked{' '}
              {children.length === 1 ? 'student' : 'students'}
            </p>
            <p className="text-xs text-muted-foreground">
              {profileDetails?.phone ?? parent.phone} · {parent.email}
            </p>
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
          tabs={PARENT_PORTAL_TABS.map((tab) => ({
            id: tab.id,
            label: tab.label,
            ...(tab.id === 'children' ? { count: children.length } : {}),
            ...(tab.id === 'notices' ? { count: parentNotices.length } : {}),
          }))}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as ParentPortalTabId)}
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
                      {formatDate(upcomingPtm.sentAt)}
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
                        {childTransport.vehicle?.vehicleNumber ?? '—'} · Pickup{' '}
                        {childTransport.pickupStop?.morningPickup ?? childTransport.route.morningTime} at{' '}
                        {childTransport.pickupStop?.name ?? childTransport.route.startPoint}
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
                  <StatusBadge status={child.feeStatus ?? 'pending'} />
                  <StatusBadge status={child.status} />
                  <Badge variant="outline">View transport tab</Badge>
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
          <ParentNoticesPanel
            notices={parentNotices}
            isLoading={noticesQuery.isLoading}
            onNavigateToFees={() => setActiveTab('fees')}
          />
        )}

        {activeTab === 'profile' && (
          <ParentProfilePanel
            parentId={parentId}
            onPhotoUpdated={refreshProfile}
            onDetailsUpdated={refreshProfile}
          />
        )}
      </div>
    </PortalLayout>
  )
}
