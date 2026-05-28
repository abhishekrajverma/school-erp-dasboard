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
import { attendanceRecordsData, attendanceSummary, studentsData } from '@/lib/erp-data'
import { attendanceSchema, type AttendanceFormData } from '@/lib/schemas'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type AttendanceRecord = (typeof attendanceRecordsData)[0]

const heatmapMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const heatmapData = heatmapMonths.map((month, mi) =>
  Array.from({ length: 20 }, (_, di) => ({
    month,
    day: di + 1,
    attendance: 72 + ((mi * 7 + di * 3) % 28),
  }))
).flat()

const studentSummary = studentsData.map((s) => ({
  id: s.id,
  name: s.name,
  class: s.class,
  present: Math.round((s.attendance / 100) * 24),
  absent: Math.round(((100 - s.attendance) / 100) * 24),
  late: s.attendance > 90 ? 1 : 2,
  percentage: s.attendance,
}))

export default function AttendancePage() {
  const { toast } = useToast()
  const [records, setRecords] = React.useState(attendanceRecordsData)
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

  const handleAdd = (data: AttendanceFormData) => {
    const student = studentsData.find((s) => s.id === data.entityId)
    const newRecord: AttendanceRecord = {
      id: String(records.length + 1),
      entityType: data.entityType,
      entityId: data.entityId,
      name: student?.name ?? 'Unknown',
      class: student?.class ?? '—',
      date: data.date,
      status: data.status,
      checkIn: data.checkInTime ?? '08:45',
      checkOut: data.checkOutTime ?? '03:30',
      remarks: data.remarks ?? '',
    }
    setRecords([...records, newRecord])
    setShowAdd(false)
    form.reset()
    toast({ title: 'Attendance marked' })
  }

  const handleEdit = (data: AttendanceFormData) => {
    if (!selected) return
    setRecords(records.map((r) => r.id === selected.id ? { ...r, status: data.status, date: data.date, remarks: data.remarks ?? '', checkIn: data.checkInTime ?? r.checkIn, checkOut: data.checkOutTime ?? r.checkOut } : r))
    setShowEdit(false)
    setSelected(null)
    toast({ title: 'Attendance updated' })
  }

  const handleDelete = () => {
    if (!selected) return
    setRecords(records.filter((r) => r.id !== selected.id))
    setShowDelete(false)
    setSelected(null)
    toast({ title: 'Record deleted', variant: 'destructive' })
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
          { label: 'Edit', onClick: () => { setSelected(row.original); form.reset({ entityType: row.original.entityType, entityId: row.original.entityId, date: row.original.date, status: row.original.status as AttendanceFormData['status'], remarks: row.original.remarks }); setShowEdit(true) } },
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

        <Card>
          <CardHeader><CardTitle className="text-base">Attendance Heatmap</CardTitle><CardDescription>Daily attendance % (last 6 months)</CardDescription></CardHeader>
          <CardContent className="space-y-2 overflow-x-auto">
            {heatmapMonths.map((month) => (
              <div key={month} className="flex items-center gap-2">
                <span className="w-8 text-xs text-muted-foreground">{month}</span>
                <div className="flex gap-0.5">
                  {heatmapData.filter((d) => d.month === month).map((d) => (
                    <div key={`${month}-${d.day}`} className={cn('h-3 w-3 rounded-sm', getHeatColor(d.attendance))} title={`${d.attendance}%`} />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Tabs tabs={[
          { id: 'student', label: 'Student Attendance', count: records.filter((r) => r.entityType === 'student').length },
          { id: 'teacher', label: 'Teacher Attendance', count: records.filter((r) => r.entityType === 'teacher').length },
        ]} activeTab={entityTab} onChange={(t) => setEntityTab(t as 'student' | 'teacher')} />

        <DataTable columns={columns} data={filtered} searchKey="name" searchPlaceholder="Search by name..." showRowSelection onExport={() => exportToCsv(filtered, 'attendance')} />

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
      </div>

      <SlideOver open={showAdd || showEdit} onClose={() => { setShowAdd(false); setShowEdit(false); setSelected(null); form.reset() }} title={showEdit ? 'Edit Attendance' : 'Mark Attendance'} size="md" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => { setShowAdd(false); setShowEdit(false) }}>Cancel</Button><Button onClick={form.handleSubmit(showEdit ? handleEdit : handleAdd)}>Save</Button></div>}>
        <div className="space-y-4">
          <FormField label="Student / Teacher">
            <Select value={form.watch('entityId')} onValueChange={(v) => form.setValue('entityId', v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{studentsData.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
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
