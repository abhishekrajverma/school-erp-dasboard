'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Download, BookOpen, Layers, Clock, GraduationCap } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, Tabs, FormSection, FormField } from '@/components/shared/page-components'
import { classesData, subjectsData, examsData, timetableData, teachersData } from '@/lib/erp-data'
import { subjectSchema, examSchema, type SubjectFormData, type ExamFormData } from '@/lib/schemas'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'

type Subject = (typeof subjectsData)[0]
type Exam = (typeof examsData)[0]

export default function AcademicsPage() {
  const { toast } = useToast()
  const [subjects, setSubjects] = React.useState(subjectsData)
  const [exams, setExams] = React.useState(examsData)
  const [activeTab, setActiveTab] = React.useState('classes')
  const [showSubjectForm, setShowSubjectForm] = React.useState(false)
  const [showExamForm, setShowExamForm] = React.useState(false)
  const [editMode, setEditMode] = React.useState<'subject' | 'exam' | null>(null)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [showDelete, setShowDelete] = React.useState(false)

  const subjectForm = useForm<SubjectFormData>({ resolver: zodResolver(subjectSchema), defaultValues: { name: '', code: '', class: '', teacherId: '', weeklyHours: 4, status: 'active' } })
  const examForm = useForm<ExamFormData>({ resolver: zodResolver(examSchema), defaultValues: { examName: '', examType: 'mid_term', subject: '', class: '', date: '', startTime: '09:00', duration: 180, totalMarks: 100, passingMarks: 35 } })

  const subjectColumns: ColumnDef<Subject>[] = [
    { accessorKey: 'name', header: 'Subject', cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground font-mono">{row.original.code}</p></div> },
    { accessorKey: 'class', header: 'Class', cell: ({ row }) => <Badge variant="secondary">{row.original.class}</Badge> },
    { accessorKey: 'teacherName', header: 'Teacher' },
    { accessorKey: 'weeklyHours', header: 'Hours/Week' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'Edit', onClick: () => { setEditMode('subject'); setSelectedId(row.original.id); subjectForm.reset(row.original as unknown as SubjectFormData); setShowSubjectForm(true) } },
      { label: 'Delete', onClick: () => { setEditMode('subject'); setSelectedId(row.original.id); setShowDelete(true) }, destructive: true },
    ]} /> },
  ]

  const examColumns: ColumnDef<Exam>[] = [
    { accessorKey: 'examName', header: 'Exam' },
    { accessorKey: 'subject', header: 'Subject' },
    { accessorKey: 'class', header: 'Class', cell: ({ row }) => <Badge variant="secondary">{row.original.class}</Badge> },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'Edit', onClick: () => { setEditMode('exam'); setSelectedId(row.original.id); examForm.reset({ examName: row.original.examName, examType: row.original.examType as ExamFormData['examType'], subject: row.original.subject, class: row.original.class, date: row.original.date, startTime: row.original.startTime, duration: row.original.duration, totalMarks: row.original.totalMarks, passingMarks: row.original.passingMarks }); setShowExamForm(true) } },
      { label: 'Delete', onClick: () => { setEditMode('exam'); setSelectedId(row.original.id); setShowDelete(true) }, destructive: true },
    ]} /> },
  ]

  const handleSubjectSave = (data: SubjectFormData) => {
    const teacher = teachersData.find((t) => t.id === data.teacherId)
    if (selectedId && editMode === 'subject') {
      setSubjects(subjects.map((s) => s.id === selectedId ? { ...s, ...data, teacherName: teacher?.name ?? s.teacherName } : s))
    } else {
      setSubjects([...subjects, { id: String(subjects.length + 1), ...data, teacherName: teacher?.name ?? '' }])
    }
    setShowSubjectForm(false)
    setSelectedId(null)
    toast({ title: 'Subject saved' })
  }

  const handleExamSave = (data: ExamFormData) => {
    if (selectedId && editMode === 'exam') {
      setExams(exams.map((e) => e.id === selectedId ? { ...e, ...data, studentsCount: e.studentsCount } : e))
    } else {
      setExams([...exams, { id: String(exams.length + 1), ...data, room: 'TBD', status: 'scheduled' as const, studentsCount: 40 }])
    }
    setShowExamForm(false)
    setSelectedId(null)
    toast({ title: 'Exam saved' })
  }

  const handleDelete = () => {
    if (editMode === 'subject') setSubjects(subjects.filter((s) => s.id !== selectedId))
    if (editMode === 'exam') setExams(exams.filter((e) => e.id !== selectedId))
    setShowDelete(false)
    toast({ title: 'Deleted', variant: 'destructive' })
  }

  const tt = timetableData[0]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Academics" description="Classes, sections, subjects, timetable, and exams." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Academics' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(subjects, 'subjects')}><Download className="h-4 w-4" />Export</Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Classes" value={classesData.length} icon={Layers} />
          <StatCard title="Subjects" value={subjects.length} icon={BookOpen} />
          <StatCard title="Scheduled Exams" value={exams.filter((e) => e.status === 'scheduled').length} icon={GraduationCap} />
          <StatCard title="Total Students" value={classesData.reduce((a, c) => a + c.totalStudents, 0)} icon={Clock} />
        </motion.div>

        <Tabs tabs={[
          { id: 'classes', label: 'Classes', count: classesData.length },
          { id: 'subjects', label: 'Subjects', count: subjects.length },
          { id: 'timetable', label: 'Timetable' },
          { id: 'exams', label: 'Exams', count: exams.length },
        ]} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'classes' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classesData.map((cls) => (
              <Card key={cls.id} className="hover:shadow-lg hover:shadow-primary/5 transition-all">
                <CardHeader><CardTitle className="text-base">{cls.name}</CardTitle><CardDescription>Sections: {cls.sections.join(', ')}</CardDescription></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Students</span><span className="font-medium">{cls.totalStudents}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Class Teacher</span><span>{cls.classTeacher}</span></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'subjects' && (
          <>
            <div className="flex justify-end"><Button size="sm" className="gap-2" onClick={() => { setEditMode(null); setSelectedId(null); subjectForm.reset(); setShowSubjectForm(true) }}><Plus className="h-4 w-4" />Add Subject</Button></div>
            <DataTable columns={subjectColumns} data={subjects} searchKey="name" showRowSelection />
          </>
        )}

        {activeTab === 'timetable' && tt && (
          <Card>
            <CardHeader><CardTitle className="text-base">Timetable — {tt.class} · {tt.day}</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tt.periods.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-3 text-sm">
                    <span className="font-mono text-muted-foreground w-28">{p.time}</span>
                    <span className="font-medium flex-1">{p.subject}</span>
                    <span className="text-muted-foreground">{p.teacher}</span>
                    <Badge variant="outline">{p.room}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'exams' && (
          <>
            <div className="flex justify-end"><Button size="sm" className="gap-2" onClick={() => { setEditMode(null); examForm.reset(); setShowExamForm(true) }}><Plus className="h-4 w-4" />Schedule Exam</Button></div>
            <DataTable columns={examColumns} data={exams} searchKey="examName" showRowSelection />
          </>
        )}
      </div>

      <SlideOver open={showSubjectForm} onClose={() => setShowSubjectForm(false)} title={selectedId ? 'Edit Subject' : 'Add Subject'} size="md" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowSubjectForm(false)}>Cancel</Button><Button onClick={subjectForm.handleSubmit(handleSubjectSave)}>Save</Button></div>}>
        <FormSection title="Subject">
          <FormField label="Name"><Input {...subjectForm.register('name')} /></FormField>
          <FormField label="Code"><Input {...subjectForm.register('code')} /></FormField>
          <FormField label="Class"><Input {...subjectForm.register('class')} /></FormField>
          <FormField label="Teacher">
            <Select value={subjectForm.watch('teacherId')} onValueChange={(v) => subjectForm.setValue('teacherId', v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{teachersData.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
          <FormField label="Weekly Hours"><Input type="number" {...subjectForm.register('weeklyHours', { valueAsNumber: true })} /></FormField>
        </FormSection>
      </SlideOver>

      <SlideOver open={showExamForm} onClose={() => setShowExamForm(false)} title={selectedId ? 'Edit Exam' : 'Schedule Exam'} size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowExamForm(false)}>Cancel</Button><Button onClick={examForm.handleSubmit(handleExamSave)}>Save</Button></div>}>
        <FormSection title="Exam Details">
          <FormField label="Exam Name"><Input {...examForm.register('examName')} /></FormField>
          <FormField label="Subject"><Input {...examForm.register('subject')} /></FormField>
          <FormField label="Class"><Input {...examForm.register('class')} /></FormField>
          <FormField label="Date"><Input type="date" {...examForm.register('date')} /></FormField>
          <FormField label="Start Time"><Input {...examForm.register('startTime')} /></FormField>
          <FormField label="Duration (min)"><Input type="number" {...examForm.register('duration', { valueAsNumber: true })} /></FormField>
          <FormField label="Total Marks"><Input type="number" {...examForm.register('totalMarks', { valueAsNumber: true })} /></FormField>
        </FormSection>
      </SlideOver>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Confirm Delete" description="Remove this record?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
