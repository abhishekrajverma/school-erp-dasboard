'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Download, FileText, Calendar, CheckCircle2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, Tabs, FormSection, FormField } from '@/components/shared/page-components'
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import { examSchema, type ExamFormData } from '@/lib/schemas'
import { exportToCsv } from '@/lib/export'
import type { ExamDto } from '@/lib/api/types/resources'
import { useExams } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'
import { toast } from 'sonner'

type Exam = ExamDto

export default function ExamsPage() {
  const { data, isLoading, isError, error, refetch } = useExams({ page: 1, pageSize: 100 })
  const exams = data?.items ?? []

  const [tab, setTab] = React.useState('all')
  const [showForm, setShowForm] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<Exam | null>(null)

  const form = useForm<ExamFormData>({ resolver: zodResolver(examSchema), defaultValues: { examName: '', examType: 'mid_term', subject: '', class: '', date: '', startTime: '09:00', duration: 180, totalMarks: 100, passingMarks: 35 } })

  const filtered = exams.filter((e) => tab === 'all' || e.status === tab)

  const columns: ColumnDef<Exam>[] = [
    { accessorKey: 'examName', header: 'Exam' },
    { accessorKey: 'subject', header: 'Subject' },
    { accessorKey: 'class', header: 'Class', cell: ({ row }) => <Badge variant="secondary">{row.original.class}</Badge> },
    { accessorKey: 'date', header: 'Date', cell: ({ row }) => <span>{row.original.date} · {row.original.startTime}</span> },
    { accessorKey: 'studentsCount', header: 'Students' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'Edit', onClick: () => { setSelected(row.original); form.reset({ examName: row.original.examName, examType: row.original.examType as ExamFormData['examType'], subject: row.original.subject, class: row.original.class, date: row.original.date, startTime: row.original.startTime, duration: row.original.duration, totalMarks: row.original.totalMarks, passingMarks: row.original.passingMarks }); setShowForm(true) } },
      { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
    ]} /> },
  ]

  const handleSave = () => {
    toast.info('Exam write API is not available on the backend yet')
    setShowForm(false)
    setSelected(null)
  }

  if (isLoading) return <ApiPageLoading rows={3} />
  if (isError) {
    return (
      <ApiPageError error={error} resourceName="exams" onRetry={() => refetch()} />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Exams" description="Exam schedules, grade management, and performance tracking." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Exams' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(exams, 'exams')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => { setSelected(null); form.reset(); setShowForm(true) }}><Plus className="h-4 w-4" />Schedule Exam</Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Scheduled" value={exams.filter((e) => e.status === 'scheduled').length} icon={Calendar} />
          <StatCard title="Completed" value={exams.filter((e) => e.status === 'completed').length} icon={CheckCircle2} />
          <StatCard title="Total Exams" value={exams.length} icon={FileText} />
        </div>

        <Tabs tabs={[
          { id: 'all', label: 'All', count: exams.length },
          { id: 'scheduled', label: 'Scheduled', count: exams.filter((e) => e.status === 'scheduled').length },
          { id: 'completed', label: 'Completed', count: exams.filter((e) => e.status === 'completed').length },
        ]} activeTab={tab} onChange={setTab} />

        <DataTable columns={columns} data={filtered} searchKey="examName" showRowSelection />
      </div>

      <SlideOver open={showForm} onClose={() => setShowForm(false)} title={selected ? 'Edit Exam' : 'Schedule Exam'} size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleSave)}>Save</Button></div>}>
        <FormSection title="Exam">
          <FormField label="Name"><Input {...form.register('examName')} /></FormField>
          <FormField label="Subject"><Input {...form.register('subject')} /></FormField>
          <FormField label="Class"><Input {...form.register('class')} /></FormField>
          <FormField label="Date"><Input type="date" {...form.register('date')} /></FormField>
          <FormField label="Time"><Input {...form.register('startTime')} /></FormField>
          <FormField label="Duration"><Input type="number" {...form.register('duration', { valueAsNumber: true })} /></FormField>
        </FormSection>
      </SlideOver>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={() => { setShowDelete(false); toast.info('Exam delete API is not available on the backend yet') }} title="Delete Exam" description="Remove this exam?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
