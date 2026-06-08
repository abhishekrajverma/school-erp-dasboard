'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Building2,
  CheckCircle2,
  ClipboardList,
  Mail,
  Phone,
  School,
  User,
} from 'lucide-react'
import { CompanyLayout } from '@/components/company/company-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PageHeader, StatCard, Tabs } from '@/components/shared/page-components'
import { companyApi } from '@/lib/api/company'
import type { PlanKey, SchoolEnquiry, ManagedSchool } from '@/lib/company/types'
import { pricing } from '@/lib/landing/content'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const enquiryStatusClass: Record<SchoolEnquiry['status'], string> = {
  new: 'bg-primary/10 text-primary',
  contacted: 'bg-amber-500/10 text-amber-600',
  approved: 'bg-emerald-500/10 text-emerald-600',
  rejected: 'bg-destructive/10 text-destructive',
}

const schoolStatusClass: Record<ManagedSchool['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-600',
  live: 'bg-emerald-500/10 text-emerald-600',
  suspended: 'bg-destructive/10 text-destructive',
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CompanyDashboardPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen" />}>
      <CompanyDashboardContent />
    </React.Suspense>
  )
}

function CompanyDashboardContent() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') ?? 'overview'
  const [assignEnquiry, setAssignEnquiry] = React.useState<SchoolEnquiry | null>(null)
  const [selectedPlan, setSelectedPlan] = React.useState<PlanKey>('professional')
  const [selectedSchool, setSelectedSchool] = React.useState<ManagedSchool | null>(null)
  const [schoolPlan, setSchoolPlan] = React.useState<PlanKey>('professional')

  const dashboardQuery = useQuery({
    queryKey: ['company', 'dashboard'],
    queryFn: () => companyApi.dashboard(),
  })

  const enquiriesQuery = useQuery({
    queryKey: ['company', 'enquiries'],
    queryFn: () => companyApi.enquiries(),
  })

  const overview = dashboardQuery.data?.overview
  const schools = dashboardQuery.data?.schools ?? []
  const enquiries = enquiriesQuery.data?.enquiries ?? dashboardQuery.data?.enquiries ?? []

  const invalidateAll = () => {
    void queryClient.invalidateQueries({ queryKey: ['company'] })
  }

  const activateMutation = useMutation({
    mutationFn: ({ enquiryId, planKey }: { enquiryId: string; planKey: PlanKey }) =>
      companyApi.activateSchool(enquiryId, planKey),
    onSuccess: (result) => {
      toast({
        title: 'School activated',
        description: `${result.school.name} is live on ${result.school.planName}.`,
      })
      setAssignEnquiry(null)
      invalidateAll()
    },
    onError: (error: Error) => {
      toast({ title: 'Activation failed', description: error.message, variant: 'destructive' })
    },
  })

  const assignPlanMutation = useMutation({
    mutationFn: ({ schoolId, planKey }: { schoolId: string; planKey: PlanKey }) =>
      companyApi.assignPlan(schoolId, planKey),
    onSuccess: (result) => {
      toast({
        title: 'Plan updated',
        description: `${result.school.name} is now on ${result.school.planName}.`,
      })
      setSelectedSchool(null)
      invalidateAll()
    },
  })

  const statusMutation = useMutation({
    mutationFn: ({
      schoolId,
      status,
    }: {
      schoolId: string
      status: ManagedSchool['status']
    }) => companyApi.updateSchoolStatus(schoolId, status),
    onSuccess: () => {
      toast({ title: 'School status updated' })
      invalidateAll()
    },
  })

  const markContactedMutation = useMutation({
    mutationFn: (id: string) => companyApi.updateEnquiry(id, { status: 'contacted' }),
    onSuccess: () => {
      toast({ title: 'Enquiry marked as contacted' })
      invalidateAll()
    },
  })

  return (
    <CompanyLayout>
      <div className="space-y-6">
        <PageHeader
          title="Company Dashboard"
          description="Review landing-page enquiries, track live schools, and assign plans after a school agrees to buy."
          breadcrumbs={[{ label: 'EduSync Company' }, { label: 'Dashboard' }]}
        />

        <Tabs
          tabs={[
            { id: 'overview', label: 'Overview' },
            { id: 'enquiries', label: 'Enquiries' },
            { id: 'schools', label: 'Schools' },
          ]}
          activeTab={activeTab}
          onChange={(tab) => {
            router.push(tab === 'overview' ? '/company' : `/company?tab=${tab}`)
          }}
        />

        {activeTab === 'overview' && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total enquiries"
                value={overview?.totalEnquiries ?? 0}
                icon={ClipboardList}
                change={`${overview?.newEnquiries ?? 0} new`}
              />
              <StatCard
                title="Live schools"
                value={overview?.liveSchools ?? 0}
                icon={School}
                changeType="positive"
                change="Active tenants"
              />
              <StatCard
                title="Pending schools"
                value={overview?.pendingSchools ?? 0}
                icon={Building2}
              />
              <StatCard
                title="Professional plan"
                value={overview?.byPlan.professional ?? 0}
                icon={CheckCircle2}
                change="Live schools"
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Latest enquiries</CardTitle>
                <CardDescription>Most recent schools from the landing get-started flow.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {enquiries.slice(0, 5).map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 p-3"
                  >
                    <div>
                      <p className="font-medium">{enquiry.schoolName}</p>
                      <p className="text-xs text-muted-foreground">
                        {enquiry.planName} · {enquiry.city} · {formatDate(enquiry.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className={cn('capitalize', enquiryStatusClass[enquiry.status])}>
                      {enquiry.status}
                    </Badge>
                  </div>
                ))}
                {enquiries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No enquiries yet.</p>
                ) : null}
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === 'enquiries' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pricing enquiries</CardTitle>
              <CardDescription>
                Schools that chose a plan on the landing page and submitted their details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        No enquiries yet. They will appear here when someone completes the landing
                        get-started flow.
                      </TableCell>
                    </TableRow>
                  ) : (
                    enquiries.map((enquiry) => (
                      <TableRow key={enquiry.id}>
                        <TableCell>
                          <div className="font-medium">{enquiry.schoolName}</div>
                          <div className="text-xs text-muted-foreground">
                            {enquiry.city}, {enquiry.state} · {enquiry.studentStrength} students
                          </div>
                        </TableCell>
                        <TableCell>{enquiry.planName}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {enquiry.schoolEmail}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {enquiry.contactNumber}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {enquiry.principalName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('capitalize', enquiryStatusClass[enquiry.status])}>
                            {enquiry.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDate(enquiry.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {enquiry.status === 'new' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markContactedMutation.mutate(enquiry.id)}
                              >
                                Mark contacted
                              </Button>
                            ) : null}
                            {enquiry.status !== 'approved' ? (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setAssignEnquiry(enquiry)
                                  setSelectedPlan(enquiry.planKey)
                                }}
                              >
                                Assign plan
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === 'schools' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Managed schools</CardTitle>
              <CardDescription>
                Schools you have activated with a plan. Only assigned schools should get ERP access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School</TableHead>
                    <TableHead>Tenant ID</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Activated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell>
                        <div className="font-medium">{school.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {school.schoolEmail} · {school.city}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{school.id}</TableCell>
                      <TableCell>{school.planName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('capitalize', schoolStatusClass[school.status])}>
                          {school.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {school.activatedAt ? formatDate(school.activatedAt) : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedSchool(school)
                              setSchoolPlan(school.planKey)
                            }}
                          >
                            Change plan
                          </Button>
                          {school.status === 'live' ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                statusMutation.mutate({ schoolId: school.id, status: 'suspended' })
                              }
                            >
                              Suspend
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                statusMutation.mutate({ schoolId: school.id, status: 'live' })
                              }
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={Boolean(assignEnquiry)} onOpenChange={(open) => !open && setAssignEnquiry(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign plan & activate school</DialogTitle>
            <DialogDescription>
              {assignEnquiry
                ? `Activate ${assignEnquiry.schoolName} after they agree to buy. This creates their tenant and marks the enquiry approved.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <p className="text-sm font-medium">Plan</p>
            <Select value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as PlanKey)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pricing.map((plan) => (
                  <SelectItem key={plan.key} value={plan.key}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignEnquiry(null)}>
              Cancel
            </Button>
            <Button
              disabled={!assignEnquiry || activateMutation.isPending}
              onClick={() =>
                assignEnquiry &&
                activateMutation.mutate({ enquiryId: assignEnquiry.id, planKey: selectedPlan })
              }
            >
              {activateMutation.isPending ? 'Activating…' : 'Activate school'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedSchool)} onOpenChange={(open) => !open && setSelectedSchool(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change school plan</DialogTitle>
            <DialogDescription>
              {selectedSchool
                ? `Update the subscription plan for ${selectedSchool.name}.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <Select value={schoolPlan} onValueChange={(value) => setSchoolPlan(value as PlanKey)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pricing.map((plan) => (
                <SelectItem key={plan.key} value={plan.key}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedSchool(null)}>
              Cancel
            </Button>
            <Button
              disabled={!selectedSchool || assignPlanMutation.isPending}
              onClick={() =>
                selectedSchool &&
                assignPlanMutation.mutate({ schoolId: selectedSchool.id, planKey: schoolPlan })
              }
            >
              Save plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CompanyLayout>
  )
}
