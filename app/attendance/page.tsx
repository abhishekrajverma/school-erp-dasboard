'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Download, CalendarDays, CheckCircle2, XCircle, Clock, Users, TrendingUp } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, Tabs, FormSection, FormField } from '@/components/shared/page-components'
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import { attendanceSchema, type AttendanceFormData } from '@/lib/schemas'
import type { AttendanceRecordDto } from '@/lib/api/types/attendance'
import { exportToCsv } from '@/lib/export'
import { useAttendanceRecords, useDashboard, useStudents } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type AttendanceRecord = AttendanceRecordDto

export default function AttendancePage() {
  const { data, isLoading, isError, error, refetch } = useAttendanceRecords({ page: 1, pageSize: 100 })
  const { data: dashboardData } = useDashboard()
  const { data: studentsData } = useStudents({ page: 1, pageSize: 100 })
  const records = data?.items ?? []
  const attendanceSummary = dashboardData?.attendanceSummary ?? {
    today: { present: 0, absent: 0, late: 0, total: 0 },
    thisWeek: { avgAttendance: 0, improvement: 0 },
    thisMonth: { avgAttendance: 0, workingDays: 0 },
  }

  const [entityTab, setEntityTab] = React.useState<'student' | 'teacher'>('student')
  const [showAdd, setShowAdd] = React.useState(false)
  const [showEdit, setShowEdit] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<AttendanceRecord | null>(null)

  const form = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { entityType: 'student', entityId: '', date: new Date().toISOString().split('T')[0], status: 'present', remarks: '' },
  })

  const filtered = records.filter((r) => r.entityType === entityTab)

  const studentSummary = React.useMemo(() => {
    const byStudent = new Map<string, { id: string; name: string; class: string; present: number; absent: number; late: number }>()
    for (const r of records.filter((x) => x.entityType === 'student')) {
      const existing = byStudent.get(r.entityId) ?? { id: r.entityId, name: r.name, class: r.class, present: 0, absent: 0, late: 0 }
      if (r.status === 'present') existing.present++
      else if (r.status === 'late') existing.late++
      else existing.absent++
      byStudent.set(r.entityId, existing)
    }
    return [...byStudent.values()].map((s) => {
      const total = s.present + s.absent + s.late
      return { ...s, percentage: total ? Math.round((s.present / total) * 100) : 0 }
    })
  }, [records])

  const heatmapData = (dashboardData?.studentAttendance ?? []).flatMap((day) => [
    { month: day.day.slice(0, 3), day: 1, attendance: day.present + day.absent > 0 ? Math.round((day.present / (day.present + day.absent)) * 100) : 0 },
  ])
  const heatmapMonths = [...new Set(heatmapData.map((d) => d.month))]

  const handleAdd = () => {
    toast.info('Attendance write API is not available on the backend yet')
    setShowAdd(false)
    form.reset()
  }

  const handleEdit = () => {
    toast.info('Attendance write API is not available on the backend yet')
    setShowEdit(false)
    setSelected(null)
  }

  const handleDelete = () => {
    toast.info('Attendance delete API is not available on the backend yet')
    setShowDelete(false)
    setSelected(null)
  }

  const columns: ColumnDef<AttendanceRecord>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.entityId}`} /><AvatarFallback>{row.original.name[0]}</AvatarFallback></Avatar>
          <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.class}</p></div>
        </div>
      ),
    },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'checkIn', header: 'Check In', cell: ({ row }) => row.original.checkIn ?? '—' },
    { accessorKey: 'checkOut', header: 'Check Out', cell: ({ row }) => row.original.checkOut ?? '—' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: 'remarks', header: 'Remarks', cell: ({ row }) => <span className="text-sm text-muted-foreground truncate max-w-[120px]">{row.original.remarks || '—'}</span> },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionMenu actions={[
          { label: 'Edit', onClick: () => { setSelected(row.original); form.reset({ entityType: row.original.entityType as AttendanceFormData['entityType'], entityId: row.original.entityId, date: row.original.date, status: row.original.status as AttendanceFormData['status'], remarks: row.original.remarks ?? '' }); setShowEdit(true) } },
          { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
        ]} />
      ),
    },
  ]

  const getHeatColor = (pct: number) => {
    if (pct >= 95) return 'bg-green-500'
    if (pct >= 85) return 'bg-green-400'
    if (pct >= 75) return 'bg-yellow-400'
    return 'bg-orange-400'
  }

  if (isLoading) return <ApiPageLoading />
  if (isError) {
    return (
      <ApiPageError
        message={isApiError(error) ? error.message : 'Failed to load attendance from EduSync.'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Attendance Management" description="Daily attendance, analytics, heatmaps, and reports." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Attendance' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(records, 'attendance')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => { form.setValue('entityType', entityTab); setShowAdd(true) }}><Plus className="h-4 w-4" />Mark Attendance</Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Present Today" value={attendanceSummary.today.present} change={`${attendanceSummary.today.total} total`} changeType="positive" icon={CheckCircle2} />
          <StatCard title="Absent Today" value={attendanceSummary.today.absent} icon={XCircle} changeType="negative" />
          <StatCard title="Late Arrivals" value={attendanceSummary.today.late} icon={Clock} />
          <StatCard title="Monthly Avg." value={`${attendanceSummary.thisMonth.avgAttendance}%`} change={`+${attendanceSummary.thisWeek.improvement}% this week`} changeType="positive" icon={TrendingUp} />
        </motion.div>

        {heatmapMonths.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Attendance Heatmap</CardTitle><CardDescription>Daily attendance from dashboard data</CardDescription></CardHeader>
            <CardContent className="space-y-2 overflow-x-auto">
              {heatmapMonths.map((month) => (
                <div key={month} className="flex items-center gap-2">
                  <span className="w-8 text-xs text-muted-foreground">{month}</span>
                  <div className="flex gap-0.5">
                    {heatmapData.filter((d) => d.month === month).map((d, i) => (
                      <div key={`${month}-${i}`} className={cn('h-3 w-3 rounded-sm', getHeatColor(d.attendance))} title={`${d.attendance}%`} />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Tabs tabs={[
          { id: 'student', label: 'Student Attendance', count: records.filter((r) => r.entityType === 'student').length },
          { id: 'teacher', label: 'Teacher Attendance', count: records.filter((r) => r.entityType === 'teacher').length },
        ]} activeTab={entityTab} onChange={(t) => setEntityTab(t as 'student' | 'teacher')} />

        <DataTable columns={columns} data={filtered} searchKey="name" searchPlaceholder="Search by name..." showRowSelection onExport={() => exportToCsv(filtered, 'attendance')} />

        {studentSummary.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Student Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {studentSummary.slice(0, 8).map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div><p className="text-sm font-medium">{s.name}</p><Badge variant="secondary" className="mt-1">{s.class}</Badge></div>
                    <div className="text-right"><p className="text-lg font-bold">{s.percentage}%</p><p className="text-xs text-muted-foreground">{s.present}P · {s.absent}A</p></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <SlideOver open={showAdd || showEdit} onClose={() => { setShowAdd(false); setShowEdit(false); setSelected(null); form.reset() }} title={showEdit ? 'Edit Attendance' : 'Mark Attendance'} size="md" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => { setShowAdd(false); setShowEdit(false) }}>Cancel</Button><Button onClick={form.handleSubmit(showEdit ? handleEdit : handleAdd)}>Save</Button></div>}>
        <div className="space-y-4">
          <FormField label="Student / Teacher">
            <Select value={form.watch('entityId')} onValueChange={(v) => form.setValue('entityId', v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{(studentsData?.items ?? []).map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
          <FormField label="Date"><Input type="date" {...form.register('date')} /></FormField>
          <FormField label="Status">
            <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v as AttendanceFormData['status'])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {['present', 'absent', 'late', 'half-day', 'on-leave'].map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Check In"><Input type="time" {...form.register('checkInTime')} /></FormField>
          <FormField label="Remarks"><Input {...form.register('remarks')} /></FormField>
        </div>
      </SlideOver>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Delete Record" description="Remove this attendance entry?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
