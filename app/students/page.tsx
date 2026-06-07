'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Search,
  Plus,
  Download,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Users,
  Calendar,
  CreditCard,
  Upload,
  FileText,
  TrendingUp,
  BarChart3,
  UserPlus,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
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
import { studentSchema, type StudentFormData } from '@/lib/schemas'
import { cn } from '@/lib/utils'
import type { ColumnDef } from '@tanstack/react-table'
import type { StudentDto } from '@/lib/api/types/students'
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent, useClasses, useParents, useCreateParent, useUpdateParent } from '@/hooks/api'
import { Skeleton } from '@/components/ui/skeleton'
import { toCreateStudentRequest, toUpdateStudentRequest } from '@/lib/api/mappers/students'
import { syncParentFromStudent } from '@/lib/api/sync/parent-from-student'
import { useToast } from '@/hooks/use-toast'
import { useMasterData } from '@/hooks/use-master-data'
import { useSchoolClasses } from '@/hooks/use-school-classes'
import { SchoolClassSelect } from '@/components/shared/school-class-select'
import { admissionNumberPlaceholder, formatAdmissionNumber } from '@/lib/master-data/format'
import { isApiError } from '@/lib/api/interceptors/errors'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'

type Student = StudentDto

const attendanceChartData = [
  { month: 'Jan', attendance: 94 },
  { month: 'Feb', attendance: 96 },
  { month: 'Mar', attendance: 92 },
  { month: 'Apr', attendance: 95 },
  { month: 'May', attendance: 93 },
  { month: 'Jun', attendance: 97 },
]

const performanceData = [
  { subject: 'Math', marks: 85 },
  { subject: 'Science', marks: 78 },
  { subject: 'English', marks: 92 },
  { subject: 'History', marks: 88 },
  { subject: 'Computer', marks: 95 },
]

export default function StudentsPage() {
  const { toast } = useToast()
  const { data: studentsResponse, isLoading, isError, error, refetch, isFetching } = useStudents({
    page: 1,
    pageSize: 100,
  })
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()
  const { data: parentsResponse, refetch: refetchParents } = useParents({ page: 1, pageSize: 100 })
  const createParent = useCreateParent()
  const updateParent = useUpdateParent()
  const students = studentsResponse?.items ?? []
  const parents = parentsResponse?.items ?? []
  const { data: masterData } = useMasterData()
  const { mergeWith: mergeSchoolClasses } = useSchoolClasses()

  const openAddStudentForm = () => {
    form.reset({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      admissionNumber: formatAdmissionNumber(masterData, students.length),
      class: '',
      section: '',
      bloodGroup: undefined,
      address: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      emergencyContact: '',
      medicalNotes: '',
      status: 'active',
    })
    setShowAddForm(true)
  }

  const [searchQuery, setSearchQuery] = React.useState('')
  const [classFilter, setClassFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [activeTab, setActiveTab] = React.useState('all')

  // Modal states
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [showEditForm, setShowEditForm] = React.useState(false)
  const [showProfile, setShowProfile] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null)

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male',
      admissionNumber: '',
      class: '',
      section: '',
      bloodGroup: undefined,
      address: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      emergencyContact: '',
      medicalNotes: '',
      status: 'active',
    },
  })

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.includes(searchQuery)
    const matchesClass = classFilter === 'all' || student.class === classFilter
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'active' && student.status === 'active') ||
      (activeTab === 'inactive' && student.status === 'inactive') ||
      (activeTab === 'pending' && student.feeStatus === 'pending') ||
      (activeTab === 'overdue' && student.feeStatus === 'overdue')
    return matchesSearch && matchesClass && matchesStatus && matchesTab
  })

  const uniqueClasses = React.useMemo(() => {
    const fromStudents = [...new Set(students.map((s) => s.class).filter(Boolean))]
    return mergeSchoolClasses(fromStudents)
  }, [students, mergeSchoolClasses])

  const handleAddStudent = async (data: StudentFormData) => {
    const studentName = `${data.firstName} ${data.lastName}`.trim()
    try {
      const created = await createStudent.mutateAsync(
        toCreateStudentRequest(data, { rollNoSeed: students.length }),
      )
      try {
        const freshParents = (await refetchParents()).data?.items ?? parents
        await syncParentFromStudent(
          data,
          created.id,
          freshParents,
          (body) => createParent.mutateAsync(body),
          (args) => updateParent.mutateAsync(args),
        )
      } catch {
        toast({
          title: 'Student added',
          description: `${studentName} was saved, but the parent could not be linked. Add them from the Parents page.`,
          variant: 'destructive',
        })
        setShowAddForm(false)
        form.reset()
        return
      }
      setShowAddForm(false)
      form.reset()
      toast({
        title: 'Student added',
        description: `${studentName} and guardian details were saved. Check the Parents page.`,
      })
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to add student'
      toast({
        title: 'Could not add student',
        description: message,
        variant: 'destructive',
      })
    }
  }

  const handleEditStudent = async (data: StudentFormData) => {
    if (!selectedStudent) return
    try {
      await updateStudent.mutateAsync({
        id: selectedStudent.id,
        body: toUpdateStudentRequest(data),
      })
      try {
        const freshParents = (await refetchParents()).data?.items ?? parents
        await syncParentFromStudent(
          data,
          selectedStudent.id,
          freshParents,
          (body) => createParent.mutateAsync(body),
          (args) => updateParent.mutateAsync(args),
        )
      } catch {
        toast({
          title: 'Student updated',
          description: 'Student saved, but parent link could not be updated.',
          variant: 'destructive',
        })
        setShowEditForm(false)
        setSelectedStudent(null)
        form.reset()
        return
      }
      setShowEditForm(false)
      setSelectedStudent(null)
      form.reset()
      toast({
        title: 'Student updated',
        description: `${data.firstName} ${data.lastName}`.trim() + ' and guardian details were saved.',
      })
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to update student'
      toast({
        title: 'Could not update student',
        description: message,
        variant: 'destructive',
      })
    }
  }

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return
    const deletedName = selectedStudent.name
    try {
      await deleteStudent.mutateAsync(selectedStudent.id)
      setShowDeleteConfirm(false)
      setSelectedStudent(null)
      toast({
        title: 'Student deleted',
        description: `${deletedName} has been removed from the system.`,
      })
    } catch (err) {
      const message = isApiError(err) ? err.message : 'Failed to delete student'
      toast({
        title: 'Could not delete student',
        description: message,
        variant: 'destructive',
      })
    }
  }

  const openEditForm = (student: Student) => {
    setSelectedStudent(student)
    form.reset({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender as 'male' | 'female' | 'other',
      admissionNumber: student.admissionNo,
      class: student.class.split('-')[0],
      section: student.section,
      bloodGroup: student.bloodGroup as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
      address: student.address ?? '',
      parentName: student.parentName ?? '',
      parentPhone: student.parentPhone ?? '',
      parentEmail: student.parentEmail ?? '',
      status: student.status as 'active' | 'inactive',
    })
    setShowEditForm(true)
  }

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: 'name',
      header: 'Student',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={row.original.avatar ?? undefined} />
            <AvatarFallback>
              {row.original.name.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'class',
      header: 'Class',
      cell: ({ row }) => <Badge variant="secondary">{row.original.class}</Badge>,
    },
    {
      accessorKey: 'rollNo',
      header: 'Roll No',
      cell: ({ row }) => <span className="font-mono text-sm">{row.original.rollNo}</span>,
    },
    {
      accessorKey: 'parentName',
      header: 'Parent',
      cell: ({ row }) => (
        <div>
          <p className="text-sm">{row.original.parentName}</p>
          <p className="text-xs text-muted-foreground">{row.original.parentPhone}</p>
        </div>
      ),
    },
    {
      accessorKey: 'attendance',
      header: 'Attendance',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Progress value={row.original.attendance} className="h-2 w-16" />
          <span className="text-sm">{row.original.attendance}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'feeStatus',
      header: 'Fee Status',
      cell: ({ row }) => <StatusBadge status={row.original.feeStatus} />,
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
                setSelectedStudent(row.original)
                setShowProfile(true)
              },
            },
            { label: 'Edit Details', onClick: () => openEditForm(row.original) },
            { label: 'Send Email', onClick: () => {} },
            {
              label: 'Delete Student',
              onClick: () => {
                setSelectedStudent(row.original)
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
    total: students.length,
    active: students.filter((s) => s.status === 'active').length,
    avgAttendance: students.length
      ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)
      : 0,
    pendingFees: students.filter((s) => s.feeStatus === 'pending' || s.feeStatus === 'overdue').length,
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
        resourceName="students"
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Student Management"
          description="Manage student records, admissions, and academic performance."
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Students' }]}
        >
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2" onClick={openAddStudentForm}>
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </PageHeader>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            title="Total Students"
            value={stats.total}
            change="+12% from last month"
            changeType="positive"
            icon={GraduationCap}
          />
          <StatCard
            title="Active Students"
            value={stats.active}
            change={`${Math.round((stats.active / stats.total) * 100)}% active`}
            changeType="positive"
            icon={Users}
          />
          <StatCard
            title="Avg. Attendance"
            value={stats.avgAttendance}
            suffix="%"
            change="+2.3% from last week"
            changeType="positive"
            icon={Calendar}
          />
          <StatCard
            title="Pending Fees"
            value={stats.pendingFees}
            change={`${stats.pendingFees} students`}
            changeType="negative"
            icon={CreditCard}
          />
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs
            tabs={[
              { id: 'all', label: 'All Students', count: students.length },
              { id: 'active', label: 'Active', count: students.filter((s) => s.status === 'active').length },
              { id: 'inactive', label: 'Inactive', count: students.filter((s) => s.status === 'inactive').length },
              { id: 'pending', label: 'Fee Pending', count: students.filter((s) => s.feeStatus === 'pending').length },
              { id: 'overdue', label: 'Fee Overdue', count: students.filter((s) => s.feeStatus === 'overdue').length },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </motion.div>

        {/* Data Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataTable
            columns={columns}
            data={filteredStudents}
            searchKey="name"
            searchPlaceholder="Search by name, email, or roll number..."
            filterColumns={[
              {
                key: 'class',
                label: 'Class',
                options: uniqueClasses.map((c) => ({ label: c, value: c })),
              },
              {
                key: 'status',
                label: 'Status',
                options: [
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ],
              },
            ]}
            showRowSelection
            onExport={() => console.log('Exporting...')}
          />
        </motion.div>
      </div>

      {/* Add Student Slide Over */}
      <SlideOver
        open={showAddForm}
        onClose={() => {
          setShowAddForm(false)
          form.reset()
        }}
        title="Add New Student"
        description="Fill in the student details to create a new record."
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(handleAddStudent)}>Add Student</Button>
          </div>
        }
      >
        <StudentForm form={form} />
      </SlideOver>

      {/* Edit Student Slide Over */}
      <SlideOver
        open={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setSelectedStudent(null)
          form.reset()
        }}
        title="Edit Student"
        description="Update student information."
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEditForm(false)}>
              Cancel
            </Button>
            <Button onClick={form.handleSubmit(handleEditStudent)}>Save Changes</Button>
          </div>
        }
      >
        <StudentForm form={form} />
      </SlideOver>

      {/* Student Profile Slide Over */}
      <SlideOver
        open={showProfile}
        onClose={() => {
          setShowProfile(false)
          setSelectedStudent(null)
        }}
        title="Student Profile"
        description={selectedStudent?.name || ''}
        size="xl"
      >
        {selectedStudent && <StudentProfile student={selectedStudent} />}
      </SlideOver>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedStudent(null)
        }}
        onConfirm={handleDeleteStudent}
        title="Delete Student"
        description={`Are you sure you want to delete ${selectedStudent?.name}? This action cannot be undone and will remove all associated records.`}
        confirmText="Delete"
        variant="destructive"
        loading={deleteStudent.isPending}
      />
    </DashboardLayout>
  )
}

// Student Form Component
function StudentForm({ form }: { form: ReturnType<typeof useForm<StudentFormData>> }) {
  const { register, formState: { errors }, setValue, watch } = form
  const { data: masterData } = useMasterData()
  const { sections: masterSections } = useSchoolClasses()
  const { data: classesResponse } = useClasses({ page: 1, pageSize: 100 })
  const classOptions = classesResponse?.items ?? []
  const apiClassNames = React.useMemo(() => classOptions.map((c) => c.name), [classOptions])
  const selectedClassName = watch('class')
  const selectedSection = watch('section')
  const selectedClassMeta = classOptions.find((c) => c.name === selectedClassName)
  const sectionOptions =
    selectedClassMeta?.sections && selectedClassMeta.sections.length > 0
      ? selectedClassMeta.sections
      : masterSections
  const admissionPlaceholder = admissionNumberPlaceholder(masterData)

  React.useEffect(() => {
    if (!selectedClassName) return
    if (selectedSection && !sectionOptions.includes(selectedSection)) {
      setValue('section', '')
    }
  }, [selectedClassName, selectedSection, sectionOptions, setValue])

  return (
    <div className="space-y-8">
      <FormSection title="Personal Information" description="Basic details about the student">
        <FormField label="First Name" error={errors.firstName?.message} required>
          <Input {...register('firstName')} placeholder="Enter first name" />
        </FormField>
        <FormField label="Last Name" error={errors.lastName?.message} required>
          <Input {...register('lastName')} placeholder="Enter last name" />
        </FormField>
        <FormField label="Email" error={errors.email?.message} required>
          <Input {...register('email')} type="email" placeholder="student@school.edu" />
        </FormField>
        <FormField label="Phone" error={errors.phone?.message} required>
          <Input {...register('phone')} placeholder="+91 98765 43210" />
        </FormField>
        <FormField label="Date of Birth" error={errors.dateOfBirth?.message} required>
          <Input {...register('dateOfBirth')} type="date" />
        </FormField>
        <FormField label="Gender" error={errors.gender?.message} required>
          <Select value={watch('gender')} onValueChange={(v) => setValue('gender', v as 'male' | 'female' | 'other')}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Blood Group" error={errors.bloodGroup?.message}>
          <Select value={watch('bloodGroup')} onValueChange={(v) => setValue('bloodGroup', v as StudentFormData['bloodGroup'])}>
            <SelectTrigger>
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Address" error={errors.address?.message} required className="sm:col-span-2">
          <Textarea {...register('address')} placeholder="Enter full address" />
        </FormField>
      </FormSection>

      <FormSection title="Academic Information" description="Class and admission details">
        <FormField label="Admission Number" error={errors.admissionNumber?.message} required>
          <Input {...register('admissionNumber')} placeholder={admissionPlaceholder} />
        </FormField>
        <FormField label="Class" error={errors.class?.message} required>
          <SchoolClassSelect
            value={watch('class')}
            onValueChange={(v) => setValue('class', v)}
            extraClasses={apiClassNames}
          />
        </FormField>
        <FormField label="Section" error={errors.section?.message} required>
          <Select value={watch('section')} onValueChange={(v) => setValue('section', v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select section" />
            </SelectTrigger>
            <SelectContent>
              {sectionOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s.length === 1 ? `Section ${s}` : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Status" error={errors.status?.message}>
          <Select value={watch('status')} onValueChange={(v) => setValue('status', v as 'active' | 'inactive')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>

      <FormSection title="Parent/Guardian Information" description="Contact details for parent or guardian">
        <FormField label="Parent/Guardian Name" error={errors.parentName?.message} required>
          <Input {...register('parentName')} placeholder="Enter parent name" />
        </FormField>
        <FormField label="Parent Phone" error={errors.parentPhone?.message} required>
          <Input {...register('parentPhone')} placeholder="+91 98765 43200" />
        </FormField>
        <FormField label="Parent Email" error={errors.parentEmail?.message}>
          <Input {...register('parentEmail')} type="email" placeholder="parent@email.com" />
        </FormField>
        <FormField label="Emergency Contact" error={errors.emergencyContact?.message}>
          <Input {...register('emergencyContact')} placeholder="Emergency contact number" />
        </FormField>
      </FormSection>

      <FormSection title="Additional Information" description="Medical notes and other details">
        <FormField label="Medical Notes" error={errors.medicalNotes?.message} className="sm:col-span-2">
          <Textarea {...register('medicalNotes')} placeholder="Any medical conditions, allergies, etc." />
        </FormField>
      </FormSection>
    </div>
  )
}

// Student Profile Component
function StudentProfile({ student }: { student: Student }) {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-4 pb-6 border-b border-border">
        <Avatar className="h-20 w-20">
          <AvatarImage src={student.avatar ?? undefined} />
          <AvatarFallback className="text-xl">
            {student.name.split(' ').map((n) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{student.name}</h3>
          <p className="text-muted-foreground">{student.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={student.status} />
            <Badge variant="secondary">{student.class}</Badge>
            <Badge variant="outline">Roll No: {student.rollNo}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button variant="outline" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{student.attendance}%</p>
              <p className="text-sm text-muted-foreground">Attendance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">85%</p>
              <p className="text-sm text-muted-foreground">Avg. Marks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-center">
              <StatusBadge status={student.feeStatus} />
              <p className="text-sm text-muted-foreground mt-1">Fee Status</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attendanceChartData}>
                <defs>
                  <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" />
                <XAxis dataKey="month" stroke="var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card))',
                    border: '1px solid var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="var(--primary))"
                  fill="url(#attendanceGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Academic Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Academic Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" />
                <XAxis dataKey="subject" stroke="var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card))',
                    border: '1px solid var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="marks" fill="var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{student.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium capitalize">{student.gender}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Blood Group</p>
              <p className="font-medium">{student.bloodGroup}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Admission No</p>
              <p className="font-medium">{student.admissionNo}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Address</p>
              <p className="font-medium">{student.address}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parent Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Parent/Guardian Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Parent Name</p>
              <p className="font-medium">{student.parentName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{student.parentPhone}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{student.parentEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
