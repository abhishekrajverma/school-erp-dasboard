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
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import type { SubjectDto, ExamDto } from '@/lib/api/types/resources'
import { subjectSchema, examSchema, type SubjectFormData, type ExamFormData } from '@/lib/schemas'
import { exportToCsv } from '@/lib/export'
import { SchoolClassSelect } from '@/components/shared/school-class-select'
import { useSchoolClasses } from '@/hooks/use-school-classes'
import { useClasses, useSubjects, useExams, useTimetable, useTeachers } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'
import { toast } from 'sonner'

type Subject = SubjectDto
type Exam = ExamDto

export default function AcademicsPage() {
  const { data: classesData, isLoading: classesLoading, isError: classesError, error: classesErr, refetch: refetchClasses } = useClasses({ page: 1, pageSize: 100 })
  const { data: subjectsData, isLoading: subjectsLoading, isError: subjectsError, error: subjectsErr, refetch: refetchSubjects } = useSubjects({ page: 1, pageSize: 100 })
  const { data: examsData, isLoading: examsLoading, isError: examsError, error: examsErr, refetch: refetchExams } = useExams({ page: 1, pageSize: 100 })
  const { data: timetableData, isLoading: ttLoading, isError: ttError, error: ttErr, refetch: refetchTt } = useTimetable({ page: 1, pageSize: 100 })
  const { data: teachersData } = useTeachers({ page: 1, pageSize: 100 })
  const { classes: schoolClasses, sections: schoolSections } = useSchoolClasses()

  const classes = classesData?.items ?? []
  const subjects = subjectsData?.items ?? []
  const exams = examsData?.items ?? []
  const timetable = timetableData?.items ?? []
  const teachers = teachersData?.items ?? []

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
    { accessorKey: 'teacherName', header: 'Teacher', cell: ({ row }) => row.original.teacherName ?? '—' },
    { accessorKey: 'weeklyHours', header: 'Hours/Week' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'Edit', onClick: () => { setEditMode('subject'); setSelectedId(row.original.id); subjectForm.reset({ name: row.original.name, code: row.original.code, class: row.original.class, teacherId: row.original.teacherId ?? '', weeklyHours: row.original.weeklyHours, status: row.original.status as SubjectFormData['status'] }); setShowSubjectForm(true) } },
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

  const handleSubjectSave = () => {
    toast.info('Subject write API is not available on the backend yet')
    setShowSubjectForm(false)
    setSelectedId(null)
  }

  const handleExamSave = () => {
    toast.info('Exam write API is not available on the backend yet')
    setShowExamForm(false)
    setSelectedId(null)
  }

  const handleDelete = () => {
    toast.info('Delete API is not available on the backend yet')
    setShowDelete(false)
  }

  const ttSample = timetable[0]
  const isLoading = classesLoading || subjectsLoading || examsLoading || ttLoading
  const isError = classesError || subjectsError || examsError || ttError
  const error = classesErr ?? subjectsErr ?? examsErr ?? ttErr

  if (isLoading) return <ApiPageLoading rows={4} />
  if (isError) {
    return (
      <ApiPageError
        error={error}
        resourceName="academics"
        onRetry={() => { void refetchClasses(); void refetchSubjects(); void refetchExams(); void refetchTt() }}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Academics" description="Classes, sections, subjects, timetable, and exams." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Academics' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(subjects, 'subjects')}><Download className="h-4 w-4" />Export</Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Classes" value={classes.length > 0 ? classes.length : schoolClasses.length} icon={Layers} />
          <StatCard title="Subjects" value={subjects.length} icon={BookOpen} />
          <StatCard title="Scheduled Exams" value={exams.filter((e) => e.status === 'scheduled').length} icon={GraduationCap} />
          <StatCard title="Total Students" value={classes.reduce((a, c) => a + c.totalStudents, 0)} icon={Clock} />
        </motion.div>

        <Tabs tabs={[
          { id: 'classes', label: 'Classes', count: classes.length > 0 ? classes.length : schoolClasses.length },
          { id: 'subjects', label: 'Subjects', count: subjects.length },
          { id: 'timetable', label: 'Timetable' },
          { id: 'exams', label: 'Exams', count: exams.length },
        ]} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'classes' && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {classes.length === 0 && schoolClasses.length === 0 ? (
              <p className="col-span-full py-8 text-center text-sm text-muted-foreground">
                No classes configured. Add them in Settings → Master Data → Classes & sections.
              </p>
            ) : classes.length > 0 ? (
              classes.map((cls) => (
              <Card key={cls.id} className="hover:shadow-lg hover:shadow-primary/5 transition-all">
                <CardHeader><CardTitle className="text-base">{cls.name}</CardTitle><CardDescription>Section {cls.section}</CardDescription></CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Students</span><span className="font-medium">{cls.totalStudents}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Class Teacher</span><span>{cls.classTeacher ?? '—'}</span></div>
                </CardContent>
              </Card>
            ))
            ) : (
              schoolClasses.map((name) => (
                <Card key={name} className="hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <CardHeader>
                    <CardTitle className="text-base">{name}</CardTitle>
                    <CardDescription>Sections {schoolSections.join(', ')}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    From school master data
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'subjects' && (
          <>
            <div className="flex justify-end"><Button size="sm" className="gap-2" onClick={() => { setEditMode(null); setSelectedId(null); subjectForm.reset(); setShowSubjectForm(true) }}><Plus className="h-4 w-4" />Add Subject</Button></div>
            <DataTable columns={subjectColumns} data={subjects} searchKey="name" showRowSelection />
          </>
        )}

        {activeTab === 'timetable' && (
          ttSample ? (
            <Card>
              <CardHeader><CardTitle className="text-base">Timetable — {ttSample.class}-{ttSample.section} · {ttSample.day}</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timetable.filter((e) => e.class === ttSample.class && e.section === ttSample.section && e.day === ttSample.day).sort((a, b) => a.period - b.period).map((p) => (
                    <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border p-3 text-sm">
                      <span className="font-mono text-muted-foreground w-28">{p.startTime}–{p.endTime}</span>
                      <span className="font-medium flex-1">{p.subject}</span>
                      <span className="text-muted-foreground">{p.teacher}</span>
                      <Badge variant="outline">{p.room}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">No timetable entries available.</p>
          )
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
          <FormField label="Class">
            <SchoolClassSelect
              value={subjectForm.watch('class')}
              onValueChange={(v) => subjectForm.setValue('class', v)}
              extraClasses={[...new Set(subjects.map((s) => s.class).filter(Boolean))]}
            />
          </FormField>
          <FormField label="Teacher">
            <Select value={subjectForm.watch('teacherId')} onValueChange={(v) => subjectForm.setValue('teacherId', v)}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
            </Select>
          </FormField>
          <FormField label="Weekly Hours"><Input type="number" {...subjectForm.register('weeklyHours', { valueAsNumber: true })} /></FormField>
        </FormSection>
      </SlideOver>

      <SlideOver open={showExamForm} onClose={() => setShowExamForm(false)} title={selectedId ? 'Edit Exam' : 'Schedule Exam'} size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowExamForm(false)}>Cancel</Button><Button onClick={examForm.handleSubmit(handleExamSave)}>Save</Button></div>}>
        <FormSection title="Exam Details">
          <FormField label="Exam Name"><Input {...examForm.register('examName')} /></FormField>
          <FormField label="Subject"><Input {...examForm.register('subject')} /></FormField>
          <FormField label="Class">
            <SchoolClassSelect
              value={examForm.watch('class')}
              onValueChange={(v) => examForm.setValue('class', v)}
              extraClasses={[...new Set(exams.map((e) => e.class).filter(Boolean))]}
            />
          </FormField>
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
