'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Plus,
  Download,
  Mail,
  Phone,
  Users,
  Briefcase,
  Calendar,
  Award,
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
import { ApiPageError } from '@/components/shared/api-page-state'
import { PageHeader, StatCard, FormSection, FormField, Tabs } from '@/components/shared/page-components'
import { teacherSchema, type TeacherFormData } from '@/lib/schemas'
import type { ColumnDef } from '@tanstack/react-table'
import type { TeacherDto } from '@/lib/api/types/teachers'
import { useTeachers, useCreateTeacher, useUpdateTeacher } from '@/hooks/api'
import { Skeleton } from '@/components/ui/skeleton'

type Teacher = TeacherDto

export default function TeachersPage() {
  const { data: teachersResponse, isLoading, isError, error, refetch, isFetching } = useTeachers({
    page: 1,
    pageSize: 100,
  })
  const createTeacher = useCreateTeacher()
  const updateTeacher = useUpdateTeacher()
  const teachers = teachersResponse?.items ?? []

  const [activeTab, setActiveTab] = React.useState('all')
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [showEditForm, setShowEditForm] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [selectedTeacher, setSelectedTeacher] = React.useState<Teacher | null>(null)

  const form = useForm<TeacherFormData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      employeeId: '',
      department: '',
      subject: '',
      qualification: '',
      experience: 0,
      joiningDate: '',
      salary: 0,
      address: '',
      status: 'active',
    },
  })

  const filteredTeachers = teachers.filter((teacher) => {
    if (activeTab === 'all') return true
    return teacher.status === activeTab
  })

  const departments = [...new Set(teachers.map((t) => t.department))]

  const handleAddTeacher = async (data: TeacherFormData) => {
    try {
      await createTeacher.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        employeeId: data.employeeId,
        department: data.department,
        subject: data.subject,
        qualification: data.qualification,
        experience: data.experience,
        joiningDate: data.joiningDate,
        salary: data.salary,
        status: data.status,
      })
      setShowAddForm(false)
      form.reset()
    } catch {
      // mutation error
    }
  }

  const handleEditTeacher = async (data: TeacherFormData) => {
    if (!selectedTeacher) return
    try {
      await updateTeacher.mutateAsync({
        id: selectedTeacher.id,
        body: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          subject: data.subject,
          qualification: data.qualification,
          experience: data.experience,
          salary: data.salary,
          status: data.status,
        },
      })
      setShowEditForm(false)
      setSelectedTeacher(null)
      form.reset()
    } catch {
      // mutation error
    }
  }

  const handleDeleteTeacher = () => {
    setShowDeleteConfirm(false)
    setSelectedTeacher(null)
  }

  const openEditForm = (teacher: Teacher) => {
    setSelectedTeacher(teacher)
    form.reset({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      employeeId: teacher.employeeId,
      department: teacher.department,
      subject: teacher.subject,
      qualification: teacher.qualification,
      experience: teacher.experience,
      joiningDate: teacher.joiningDate,
      salary: teacher.salary,
      status: teacher.status as 'active' | 'on-leave' | 'terminated',
    })
    setShowEditForm(true)
  }

  const columns: ColumnDef<Teacher>[] = [
    {
      accessorKey: 'name',
      header: 'Teacher',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
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
      header: 'Subject',
    },
    {
      accessorKey: 'qualification',
      header: 'Qualification',
      cell: ({ row }) => <span className="text-sm">{row.original.qualification}</span>,
    },
    {
      accessorKey: 'experience',
      header: 'Experience',
      cell: ({ row }) => <span>{row.original.experience} years</span>,
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => (
        <span className="font-medium">Rs.{row.original.salary.toLocaleString()}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionMenu
          actions={[
            {
              label: 'View Profile',
              onClick: () => {
                setSelectedTeacher(row.original)
                setShowProfile(true)
              },
            },
            { label: 'Edit Details', onClick: () => openEditForm(row.original) },
            { label: 'Assign Classes', onClick: () => {} },
            {
              label: 'Delete Teacher',
              onClick: () => {
                setSelectedTeacher(row.original)
                setShowDeleteConfirm(true)
              },
              destructive: true,
            },
          ]}
        />
      ),
    },
  ]

  const stats = {
    total: teachers.length,
    active: teachers.filter((t) => t.status === 'active').length,
    onLeave: teachers.filter((t) => t.status === 'on-leave').length,
    totalSalary: teachers.reduce((acc, t) => acc + t.salary, 0),
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </DashboardLayout>
    )
  }

  if (isError) {
    return (
      <ApiPageError
        error={error}
        resourceName="teachers"
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Teacher Management"
          description="Manage teacher profiles, assignments, and payroll."
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Teachers' }]}
        >
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4" />
            Add Teacher
          </Button>
        </PageHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard title="Total Teachers" value={stats.total} change="+3 this month" changeType="positive" icon={Users} />
          <StatCard title="Active Teachers" value={stats.active} change={`${Math.round((stats.active / stats.total) * 100)}% active`} changeType="positive" icon={Briefcase} />
          <StatCard title="On Leave" value={stats.onLeave} change="2 pending approvals" changeType="neutral" icon={Calendar} />
          <StatCard title="Monthly Payroll" value={stats.totalSalary} prefix="Rs." change="On schedule" changeType="neutral" icon={Award} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs
            tabs={[
              { id: 'all', label: 'All Teachers', count: teachers.length },
              { id: 'active', label: 'Active', count: stats.active },
              { id: 'on-leave', label: 'On Leave', count: stats.onLeave },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <DataTable
            columns={columns}
            data={filteredTeachers}
            searchKey="name"
            searchPlaceholder="Search by name or employee ID..."
            filterColumns={[{ key: 'department', label: 'Department', options: departments.map((d) => ({ label: d, value: d })) }]}
            showRowSelection
            onExport={() => {}}
          />
        </motion.div>
      </div>

      <SlideOver open={showAddForm} onClose={() => { setShowAddForm(false); form.reset() }} title="Add New Teacher" description="Fill in the teacher details." size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleAddTeacher)}>Add Teacher</Button></div>}>
        <TeacherForm form={form} />
      </SlideOver>

      <SlideOver open={showEditForm} onClose={() => { setShowEditForm(false); setSelectedTeacher(null); form.reset() }} title="Edit Teacher" description="Update teacher information." size="lg"
        footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowEditForm(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleEditTeacher)}>Save Changes</Button></div>}>
        <TeacherForm form={form} />
      </SlideOver>

      <SlideOver open={showProfile} onClose={() => { setShowProfile(false); setSelectedTeacher(null) }} title="Teacher Profile" description={selectedTeacher?.name || ''} size="xl">
        {selectedTeacher && <TeacherProfile teacher={selectedTeacher} />}
      </SlideOver>

      <ConfirmDialog open={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setSelectedTeacher(null) }} onConfirm={handleDeleteTeacher} title="Delete Teacher" description={`Are you sure you want to delete ${selectedTeacher?.name}? This action cannot be undone.`} confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}

function TeacherForm({ form }: { form: ReturnType<typeof useForm<TeacherFormData>> }) {
  const { register, formState: { errors }, setValue, watch } = form

  return (
    <div className="space-y-8">
      <FormSection title="Personal Information" description="Basic details about the teacher">
        <FormField label="First Name" error={errors.firstName?.message} required><Input {...register('firstName')} placeholder="Enter first name" /></FormField>
        <FormField label="Last Name" error={errors.lastName?.message} required><Input {...register('lastName')} placeholder="Enter last name" /></FormField>
        <FormField label="Email" error={errors.email?.message} required><Input {...register('email')} type="email" placeholder="teacher@school.edu" /></FormField>
        <FormField label="Phone" error={errors.phone?.message} required><Input {...register('phone')} placeholder="+91 98765 12340" /></FormField>
        <FormField label="Date of Birth" error={errors.dateOfBirth?.message} required><Input {...register('dateOfBirth')} type="date" /></FormField>
        <FormField label="Gender" error={errors.gender?.message} required>
          <Select value={watch('gender')} onValueChange={(v) => setValue('gender', v as 'male' | 'female' | 'other')}><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger><SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select>
        </FormField>
        <FormField label="Address" error={errors.address?.message} required className="sm:col-span-2"><Textarea {...register('address')} placeholder="Enter full address" /></FormField>
      </FormSection>

      <FormSection title="Employment Details" description="Job-related information">
        <FormField label="Employee ID" error={errors.employeeId?.message} required><Input {...register('employeeId')} placeholder="EMP001" /></FormField>
        <FormField label="Department" error={errors.department?.message} required>
          <Select value={watch('department')} onValueChange={(v) => setValue('department', v)}><SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger><SelectContent>{['Science', 'Mathematics', 'English', 'History', 'Commerce', 'Computer Science'].map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}</SelectContent></Select>
        </FormField>
        <FormField label="Subject" error={errors.subject?.message} required><Input {...register('subject')} placeholder="e.g., Physics" /></FormField>
        <FormField label="Qualification" error={errors.qualification?.message} required><Input {...register('qualification')} placeholder="e.g., M.Sc. Physics" /></FormField>
        <FormField label="Experience (years)" error={errors.experience?.message} required><Input {...register('experience', { valueAsNumber: true })} type="number" min="0" /></FormField>
        <FormField label="Joining Date" error={errors.joiningDate?.message} required><Input {...register('joiningDate')} type="date" /></FormField>
        <FormField label="Monthly Salary" error={errors.salary?.message} required><Input {...register('salary', { valueAsNumber: true })} type="number" min="0" /></FormField>
        <FormField label="Status" error={errors.status?.message}>
          <Select value={watch('status')} onValueChange={(v) => setValue('status', v as 'active' | 'on-leave' | 'terminated')}><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="on-leave">On Leave</SelectItem><SelectItem value="terminated">Terminated</SelectItem></SelectContent></Select>
        </FormField>
      </FormSection>
    </div>
  )
}

function TeacherProfile({ teacher }: { teacher: Teacher }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 pb-6 border-b border-border">
        <Avatar className="h-20 w-20"><AvatarImage src={teacher.avatar} /><AvatarFallback className="text-xl">{teacher.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{teacher.name}</h3>
          <p className="text-muted-foreground">{teacher.email}</p>
          <div className="flex items-center gap-2 mt-2"><StatusBadge status={teacher.status} /><Badge variant="secondary">{teacher.department}</Badge><Badge variant="outline">{teacher.employeeId}</Badge></div>
        </div>
        <div className="flex gap-2"><Button variant="outline" size="sm"><Mail className="h-4 w-4 mr-2" />Email</Button><Button variant="outline" size="sm"><Phone className="h-4 w-4 mr-2" />Call</Button></div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4"><div className="text-center"><p className="text-2xl font-bold text-primary">{teacher.experience}</p><p className="text-sm text-muted-foreground">Years Experience</p></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-center"><p className="text-2xl font-bold text-primary">{teacher.classes.length}</p><p className="text-sm text-muted-foreground">Assigned Classes</p></div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-center"><p className="text-2xl font-bold text-primary">Rs.{teacher.salary.toLocaleString()}</p><p className="text-sm text-muted-foreground">Monthly Salary</p></div></CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle className="text-base">Professional Details</CardTitle></CardHeader><CardContent><div className="grid grid-cols-2 gap-4 text-sm"><div><p className="text-muted-foreground">Subject</p><p className="font-medium">{teacher.subject}</p></div><div><p className="text-muted-foreground">Qualification</p><p className="font-medium">{teacher.qualification}</p></div><div><p className="text-muted-foreground">Joining Date</p><p className="font-medium">{teacher.joiningDate}</p></div><div><p className="text-muted-foreground">Phone</p><p className="font-medium">{teacher.phone}</p></div></div></CardContent></Card>

      <Card><CardHeader><CardTitle className="text-base">Assigned Classes</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{teacher.classes.length > 0 ? teacher.classes.map((cls) => (<Badge key={cls} variant="secondary">{cls}</Badge>)) : <p className="text-sm text-muted-foreground">No classes assigned yet</p>}</div></CardContent></Card>
    </div>
  )
}
