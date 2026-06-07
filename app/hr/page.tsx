'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Plus,
  Download,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Eye,
  X,
  FileText,
  ArrowRight,
  Paperclip,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/admission/file-upload'
import type { UploadedFileMeta } from '@/lib/admission/types'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PageHeader, StatCard, FormSection, FormField, Tabs } from '@/components/shared/page-components'
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import type { LeaveRequestDto } from '@/lib/api/types/resources'
import type { TeacherDto } from '@/lib/api/types/teachers'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { leaveSchema, type LeaveFormData } from '@/lib/schemas'
import { useLeaveRequests, useTeachers } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'
import { toast } from 'sonner'
import type { ColumnDef } from '@tanstack/react-table'

const LEAVE_TYPES_REQUIRING_PROOF = ['sick', 'maternity', 'paternity'] as const

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function resetLeaveForm(
  form: ReturnType<typeof useForm<LeaveFormData>>,
  setProofDocument: (file: UploadedFileMeta | null) => void,
  setProofError: (error: string | null) => void,
) {
  form.reset()
  setProofDocument(null)
  setProofError(null)
}

type LeaveRequest = LeaveRequestDto

export default function HRPage() {
  const { data: leaveData, isLoading, isError, error, refetch } = useLeaveRequests({ page: 1, pageSize: 100 })
  const { data: teachersData } = useTeachers({ page: 1, pageSize: 100 })
  const leaveRequests = leaveData?.items ?? []
  const employees = teachersData?.items ?? []

  const [activeTab, setActiveTab] = React.useState('all')
  const [showAddLeave, setShowAddLeave] = React.useState(false)
  const [showApproveConfirm, setShowApproveConfirm] = React.useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = React.useState(false)
  const [showLeaveDetail, setShowLeaveDetail] = React.useState(false)
  const [selectedRequest, setSelectedRequest] = React.useState<LeaveRequest | null>(null)
  const [detailRequest, setDetailRequest] = React.useState<LeaveRequest | null>(null)
  const [proofDocument, setProofDocument] = React.useState<UploadedFileMeta | null>(null)
  const [proofError, setProofError] = React.useState<string | null>(null)

  const openLeaveDetail = (request: LeaveRequest) => {
    setDetailRequest(request)
    setShowLeaveDetail(true)
  }

  const form = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      employeeId: '',
      leaveType: 'casual',
      startDate: '',
      endDate: '',
      reason: '',
      status: 'pending',
    },
  })

  const filteredRequests = leaveRequests.filter((req) => {
    if (activeTab === 'all') return true
    return req.status === activeTab
  })

  const handleAddLeave = (_data: LeaveFormData) => {
    toast.info('Leave write API is not available on the backend yet')
    setShowAddLeave(false)
    resetLeaveForm(form, setProofDocument, setProofError)
  }

  const handleApprove = () => {
    toast.info('Leave approval API is not available on the backend yet')
    setShowApproveConfirm(false)
    setSelectedRequest(null)
  }

  const handleReject = () => {
    toast.info('Leave rejection API is not available on the backend yet')
    setShowRejectConfirm(false)
    setSelectedRequest(null)
  }

  const leaveColumns: ColumnDef<LeaveRequest>[] = [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.employeeName}`} />
            <AvatarFallback>{row.original.employeeName.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.employeeName}</p>
            <p className="text-xs text-muted-foreground">{row.original.department}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'leaveType',
      header: 'Type',
      cell: ({ row }) => <Badge variant="secondary" className="capitalize">{row.original.leaveType}</Badge>,
    },
    {
      accessorKey: 'startDate',
      header: 'From',
    },
    {
      accessorKey: 'endDate',
      header: 'To',
    },
    {
      accessorKey: 'days',
      header: 'Days',
      cell: ({ row }) => <span className="font-medium">{row.original.days}</span>,
    },
    {
      accessorKey: 'reason',
      header: 'Reason',
      cell: ({ row }) => (
        <LeaveReasonCell
          reason={row.original.reason}
          onView={() => openLeaveDetail(row.original)}
        />
      ),
    },
    {
      accessorKey: 'appliedOn',
      header: 'Applied On',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => row.original.status === 'pending' && (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" className="h-7 text-success hover:text-success" onClick={() => { setSelectedRequest(row.original); setShowApproveConfirm(true) }}>
            <CheckCircle className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-destructive hover:text-destructive" onClick={() => { setSelectedRequest(row.original); setShowRejectConfirm(true) }}>
            <XCircle className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  const employeeColumns: ColumnDef<TeacherDto>[] = [
    {
      accessorKey: 'name',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.avatar} />
            <AvatarFallback>{row.original.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.employeeId}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => <Badge variant="secondary">{row.original.department}</Badge>,
    },
    {
      accessorKey: 'subject',
      header: 'Role',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
    },
    {
      accessorKey: 'joiningDate',
      header: 'Joined',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
  ]

  const stats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === 'active').length,
    pendingLeaves: leaveRequests.filter((r) => r.status === 'pending').length,
    approvedLeaves: leaveRequests.filter((r) => r.status === 'approved').length,
  }

  if (isLoading) return <ApiPageLoading />
  if (isError) {
    return (
      <ApiPageError
        message={isApiError(error) ? error.message : 'Failed to load HR data from EduSync.'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="HR Management"
          description="Manage employees, leave requests, and attendance."
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'HR Management' }]}
        >
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAddLeave(true)}><Plus className="h-4 w-4" />Apply Leave</Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Employees" value={stats.totalEmployees} change="+3 this month" changeType="positive" icon={Users} />
          <StatCard title="Active Employees" value={stats.activeEmployees} change={`${Math.round((stats.activeEmployees / stats.totalEmployees) * 100)}%`} changeType="positive" icon={Briefcase} />
          <StatCard title="Pending Leaves" value={stats.pendingLeaves} change="Requires approval" changeType="neutral" icon={Clock} />
          <StatCard title="Approved Leaves" value={stats.approvedLeaves} change="This month" changeType="positive" icon={CheckCircle} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs
            tabs={[
              { id: 'all', label: 'All Leaves', count: leaveRequests.length },
              { id: 'pending', label: 'Pending', count: stats.pendingLeaves },
              { id: 'approved', label: 'Approved', count: stats.approvedLeaves },
              { id: 'rejected', label: 'Rejected', count: leaveRequests.filter((r) => r.status === 'rejected').length },
              { id: 'employees', label: 'Employees', count: employees.length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {activeTab === 'employees' ? (
            <DataTable
              columns={employeeColumns}
              data={employees}
              searchKey="name"
              searchPlaceholder="Search employees..."
              filterColumns={[
                { key: 'department', label: 'Department', options: [...new Set(employees.map((e) => e.department))].map((d) => ({ label: d, value: d })) },
                { key: 'status', label: 'Status', options: [{ label: 'Active', value: 'active' }, { label: 'On Leave', value: 'on-leave' }] },
              ]}
            />
          ) : (
            <DataTable
              columns={leaveColumns}
              data={filteredRequests}
              searchKey="employeeName"
              searchPlaceholder="Search by employee name..."
              filterColumns={[
                { key: 'leaveType', label: 'Type', options: [{ label: 'Casual', value: 'casual' }, { label: 'Sick', value: 'sick' }, { label: 'Earned', value: 'earned' }] },
              ]}
            />
          )}
        </motion.div>
      </div>

      {/* Apply Leave */}
      <SlideOver
        open={showAddLeave}
        onClose={() => {
          setShowAddLeave(false)
          resetLeaveForm(form, setProofDocument, setProofError)
        }}
        title="Apply for Leave"
        description="Submit a new leave request with supporting documents."
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddLeave(false)
                resetLeaveForm(form, setProofDocument, setProofError)
              }}
            >
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(handleAddLeave)}>Submit Request</Button>
          </div>
        }
      >
        <LeaveForm
          form={form}
          employees={employees}
          proofDocument={proofDocument}
          proofError={proofError}
          onProofChange={(file) => {
            setProofDocument(file)
            setProofError(null)
          }}
        />
      </SlideOver>

      {/* Leave reason & details */}
      <LeaveDetailDialog
        request={detailRequest}
        open={showLeaveDetail}
        onClose={() => { setShowLeaveDetail(false); setDetailRequest(null) }}
      />

      {/* Approve Confirmation */}
      <ConfirmDialog open={showApproveConfirm} onClose={() => { setShowApproveConfirm(false); setSelectedRequest(null) }} onConfirm={handleApprove} title="Approve Leave" description={selectedRequest ? `Approve leave for ${selectedRequest.employeeName} (${selectedRequest.startDate} to ${selectedRequest.endDate})? Reason: ${selectedRequest.reason}` : ''} confirmText="Approve" />

      {/* Reject Confirmation */}
      <ConfirmDialog open={showRejectConfirm} onClose={() => { setShowRejectConfirm(false); setSelectedRequest(null) }} onConfirm={handleReject} title="Reject Leave" description={selectedRequest ? `Reject leave for ${selectedRequest.employeeName}? Reason: ${selectedRequest.reason}` : ''} confirmText="Reject" variant="destructive" />
    </DashboardLayout>
  )
}

const REASON_PREVIEW_LENGTH = 48

function LeaveReasonCell({ reason, onView }: { reason: string; onView: () => void }) {
  const isTruncated = reason.length > REASON_PREVIEW_LENGTH
  const preview = isTruncated ? `${reason.slice(0, REASON_PREVIEW_LENGTH)}…` : reason

  return (
    <div className="max-w-[240px]">
      <p className="text-sm leading-snug text-muted-foreground line-clamp-2">{preview}</p>
      <button
        type="button"
        onClick={onView}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
      >
        <Eye className="h-3 w-3" />
        View details
      </button>
    </div>
  )
}

function LeaveDetailDialog({
  request,
  open,
  onClose,
}: {
  request: LeaveRequest | null
  open: boolean
  onClose: () => void
}) {
  if (!request) return null

  const leaveTypeLabels: Record<LeaveRequest['leaveType'], string> = {
    casual: 'Casual Leave',
    sick: 'Sick Leave',
    earned: 'Earned Leave',
    maternity: 'Maternity Leave',
    paternity: 'Paternity Leave',
    unpaid: 'Unpaid Leave',
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden rounded-2xl border-border/60 p-0 shadow-2xl sm:max-w-lg"
      >
        <div className="relative border-b border-border/60 bg-linear-to-br from-primary/10 via-background to-background px-6 py-5">
          <div className="flex items-start gap-4 pr-10">
            <Avatar className="h-14 w-14 shrink-0 shadow-md ring-2 ring-background">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.employeeName}`}
              />
              <AvatarFallback className="text-base font-semibold">
                {request.employeeName.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <DialogHeader className="space-y-1.5 text-left">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                {request.employeeName}
              </DialogTitle>
              <DialogDescription className="text-sm">
                {request.department} · {leaveTypeLabels[request.leaveType]}
              </DialogDescription>
              <div className="pt-0.5">
                <StatusBadge status={request.status} />
              </div>
            </DialogHeader>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="rounded-xl border border-border/60 bg-muted/25 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              Leave period
            </div>
            <div className="flex items-stretch gap-2 sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">From</p>
                <p className="mt-0.5 text-sm font-semibold tracking-tight tabular-nums">
                  {formatDate(request.startDate)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-center justify-center gap-1.5 px-1">
                <div className="hidden h-px w-10 bg-border sm:block" />
                <Badge variant="secondary" className="whitespace-nowrap px-2 text-[10px] font-semibold">
                  {request.days} day{request.days !== 1 ? 's' : ''}
                </Badge>
                <ArrowRight className="h-4 w-4 text-primary/70" />
                <div className="hidden h-px w-10 bg-border sm:block" />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">To</p>
                <p className="mt-0.5 text-sm font-semibold tracking-tight tabular-nums">
                  {formatDate(request.endDate)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 bg-card p-3.5 transition-colors hover:border-primary/20">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Applied</p>
              <p className="mt-0.5 text-sm font-semibold tabular-nums">{formatDate(request.appliedOn)}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-card p-3.5 transition-colors hover:border-primary/20">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Type</p>
              <p className="mt-0.5 text-sm font-semibold leading-snug">
                {leaveTypeLabels[request.leaveType]}
              </p>
            </div>
          </div>

          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
              <p className="text-sm font-semibold tracking-tight">Reason</p>
            </div>
            <div
              className={cn(
                'max-h-52 overflow-y-auto rounded-xl border border-primary/15 bg-linear-to-br from-primary/8 to-transparent',
                'px-4 py-3.5 text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap',
                'shadow-inner shadow-primary/5'
              )}
            >
              {request.reason}
            </div>
          </div>

          {request.proofDocument && (
            <div>
              <div className="mb-2.5 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                  <Paperclip className="h-3.5 w-3.5 text-primary" />
                </div>
                <p className="text-sm font-semibold tracking-tight">Proof document</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{request.proofDocument}</p>
                </div>
                {request.proofDocument.startsWith('http') && (
                  <Button variant="outline" size="sm" className="shrink-0 rounded-full" asChild>
                    <a href={request.proofDocument} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 border-t border-border/60 bg-muted/25 px-6 py-4 sm:justify-end">
          <Button variant="outline" className="rounded-full px-5" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function LeaveForm({
  form,
  employees,
  proofDocument,
  proofError,
  onProofChange,
}: {
  form: ReturnType<typeof useForm<LeaveFormData>>
  employees: TeacherDto[]
  proofDocument: UploadedFileMeta | null
  proofError: string | null
  onProofChange: (file: UploadedFileMeta | null) => void
}) {
  const { register, formState: { errors }, setValue, watch } = form
  const leaveType = watch('leaveType')
  const proofRequired = LEAVE_TYPES_REQUIRING_PROOF.includes(
    leaveType as (typeof LEAVE_TYPES_REQUIRING_PROOF)[number],
  )

  return (
    <div className="space-y-8">
      <FormSection title="Leave Details" description="Fill in the leave request details">
        <FormField label="Employee" error={errors.employeeId?.message} required className="sm:col-span-2">
          <Select value={watch('employeeId')} onValueChange={(v) => setValue('employeeId', v)}><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent>{employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name} - {e.department}</SelectItem>))}</SelectContent></Select>
        </FormField>
        <FormField label="Leave Type" error={errors.leaveType?.message} required className="sm:col-span-2">
          <Select value={leaveType} onValueChange={(v) => setValue('leaveType', v as LeaveFormData['leaveType'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="casual">Casual Leave</SelectItem><SelectItem value="sick">Sick Leave</SelectItem><SelectItem value="earned">Earned Leave</SelectItem><SelectItem value="maternity">Maternity Leave</SelectItem><SelectItem value="paternity">Paternity Leave</SelectItem><SelectItem value="unpaid">Unpaid Leave</SelectItem></SelectContent></Select>
        </FormField>
        <FormField label="Start Date" error={errors.startDate?.message} required>
          <Input {...register('startDate')} type="date" />
        </FormField>
        <FormField label="End Date" error={errors.endDate?.message} required>
          <Input {...register('endDate')} type="date" />
        </FormField>
        <FormField label="Reason" error={errors.reason?.message} required className="sm:col-span-2">
          <Textarea {...register('reason')} placeholder="Enter reason for leave" rows={4} />
        </FormField>
      </FormSection>

      <FormSection
        title="Supporting documents"
        description={
          proofRequired
            ? 'Upload proof (medical certificate, prescription, or hospital document). Required for this leave type.'
            : 'Optional: upload appointment letter, travel ticket, or other supporting proof.'
        }
      >
        <div className="sm:col-span-2">
          <FileUpload
            id="leave-proof-upload"
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
