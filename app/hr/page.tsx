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
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, FormSection, FormField, Tabs } from '@/components/shared/page-components'
import { teachersData, leaveRequestsData } from '@/lib/erp-data'
import { leaveSchema, type LeaveFormData } from '@/lib/schemas'
import type { ColumnDef } from '@tanstack/react-table'

type LeaveRequest = (typeof leaveRequestsData)[0]

export default function HRPage() {
  const [employees] = React.useState(teachersData)
  const [leaveRequests, setLeaveRequests] = React.useState(leaveRequestsData)
  const [activeTab, setActiveTab] = React.useState('all')
  const [showAddLeave, setShowAddLeave] = React.useState(false)
  const [showApproveConfirm, setShowApproveConfirm] = React.useState(false)
  const [showRejectConfirm, setShowRejectConfirm] = React.useState(false)
  const [selectedRequest, setSelectedRequest] = React.useState<LeaveRequest | null>(null)

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

  const handleAddLeave = (data: LeaveFormData) => {
    const employee = employees.find((e) => e.id === data.employeeId)
    if (!employee) return

    const start = new Date(data.startDate)
    const end = new Date(data.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    const newRequest: LeaveRequest = {
      id: String(leaveRequests.length + 1),
      employeeId: data.employeeId,
      employeeName: employee.name,
      department: employee.department,
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      days,
      reason: data.reason,
      status: 'pending',
      appliedOn: new Date().toISOString().split('T')[0],
      approvedBy: null,
      approvedOn: null,
    }

    setLeaveRequests([...leaveRequests, newRequest])
    setShowAddLeave(false)
    form.reset()
  }

  const handleApprove = () => {
    if (!selectedRequest) return
    setLeaveRequests(leaveRequests.map((r) =>
      r.id === selectedRequest.id
        ? { ...r, status: 'approved', approvedBy: 'Admin', approvedOn: new Date().toISOString().split('T')[0] }
        : r
    ))
    setShowApproveConfirm(false)
    setSelectedRequest(null)
  }

  const handleReject = () => {
    if (!selectedRequest) return
    setLeaveRequests(leaveRequests.map((r) =>
      r.id === selectedRequest.id
        ? { ...r, status: 'rejected', approvedBy: 'Admin', approvedOn: new Date().toISOString().split('T')[0] }
        : r
    ))
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
      cell: ({ row }) => <span className="text-sm truncate max-w-[200px] block">{row.original.reason}</span>,
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

  const employeeColumns: ColumnDef<typeof teachersData[0]>[] = [
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
      <SlideOver open={showAddLeave} onClose={() => { setShowAddLeave(false); form.reset() }} title="Apply for Leave" description="Submit a new leave request." size="md"
        footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowAddLeave(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleAddLeave)}>Submit Request</Button></div>}>
        <LeaveForm form={form} employees={employees} />
      </SlideOver>

      {/* Approve Confirmation */}
      <ConfirmDialog open={showApproveConfirm} onClose={() => { setShowApproveConfirm(false); setSelectedRequest(null) }} onConfirm={handleApprove} title="Approve Leave" description={`Approve leave request for ${selectedRequest?.employeeName} from ${selectedRequest?.startDate} to ${selectedRequest?.endDate}?`} confirmText="Approve" />

      {/* Reject Confirmation */}
      <ConfirmDialog open={showRejectConfirm} onClose={() => { setShowRejectConfirm(false); setSelectedRequest(null) }} onConfirm={handleReject} title="Reject Leave" description={`Reject leave request for ${selectedRequest?.employeeName}?`} confirmText="Reject" variant="destructive" />
    </DashboardLayout>
  )
}

function LeaveForm({ form, employees }: { form: ReturnType<typeof useForm<LeaveFormData>>; employees: typeof teachersData }) {
  const { register, formState: { errors }, setValue, watch } = form

  return (
    <div className="space-y-8">
      <FormSection title="Leave Details" description="Fill in the leave request details">
        <FormField label="Employee" error={errors.employeeId?.message} required className="sm:col-span-2">
          <Select value={watch('employeeId')} onValueChange={(v) => setValue('employeeId', v)}><SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger><SelectContent>{employees.map((e) => (<SelectItem key={e.id} value={e.id}>{e.name} - {e.department}</SelectItem>))}</SelectContent></Select>
        </FormField>
        <FormField label="Leave Type" error={errors.leaveType?.message} required>
          <Select value={watch('leaveType')} onValueChange={(v) => setValue('leaveType', v as LeaveFormData['leaveType'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="casual">Casual Leave</SelectItem><SelectItem value="sick">Sick Leave</SelectItem><SelectItem value="earned">Earned Leave</SelectItem><SelectItem value="maternity">Maternity Leave</SelectItem><SelectItem value="paternity">Paternity Leave</SelectItem><SelectItem value="unpaid">Unpaid Leave</SelectItem></SelectContent></Select>
        </FormField>
        <FormField label="Start Date" error={errors.startDate?.message} required><Input {...register('startDate')} type="date" /></FormField>
        <FormField label="End Date" error={errors.endDate?.message} required><Input {...register('endDate')} type="date" /></FormField>
        <FormField label="Reason" error={errors.reason?.message} required className="sm:col-span-2"><Textarea {...register('reason')} placeholder="Enter reason for leave" rows={4} /></FormField>
      </FormSection>
    </div>
  )
}
