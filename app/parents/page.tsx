'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Download, UserCircle, Mail, Phone, Users } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, FormSection, FormField } from '@/components/shared/page-components'
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import { parentSchema, type ParentFormData } from '@/lib/schemas'
import { exportToCsv } from '@/lib/export'
import type { ParentDto } from '@/lib/api/types/parents'
import {
  buildParentStudentLinks,
  countLinkedStudents,
  emptyParentFormValues,
  getParentChildrenLabels,
  toParentFormValues,
} from '@/lib/api/mappers/parents'
import { useParents, useCreateParent, useUpdateParent, useDeleteParent, useStudents } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'
import { useToast } from '@/hooks/use-toast'

type Parent = ParentDto

export default function ParentsPage() {
  const { toast } = useToast()
  const { data, isLoading, isError, error, refetch } = useParents({ page: 1, pageSize: 100 })
  const { data: studentsData } = useStudents({ page: 1, pageSize: 500 })
  const createParent = useCreateParent()
  const updateParent = useUpdateParent()
  const deleteParent = useDeleteParent()
  const parents = data?.items ?? []
  const students = studentsData?.items ?? []

  const studentNameById = React.useMemo(() => {
    const map = new Map<string, string>()
    for (const student of studentsData?.items ?? []) {
      map.set(student.id, student.name)
    }
    return map
  }, [studentsData?.items])

  const [showForm, setShowForm] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<Parent | null>(null)

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: emptyParentFormValues,
  })

  const selectedStudentIds = form.watch('studentIds') ?? []

  const openAddForm = () => {
    setSelected(null)
    form.reset(emptyParentFormValues)
    setShowForm(true)
  }

  const openEditForm = (parent: Parent) => {
    setSelected(parent)
    form.reset(toParentFormValues(parent))
    setShowForm(true)
  }

  const toggleStudentLink = (studentId: string) => {
    const current = form.getValues('studentIds') ?? []
    const next = current.includes(studentId)
      ? current.filter((id) => id !== studentId)
      : [...current, studentId]
    form.setValue('studentIds', next, { shouldDirty: true })
  }

  const columns: ColumnDef<Parent>[] = [
    {
      accessorKey: 'name',
      header: 'Parent',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarImage src={row.original.avatar ?? undefined} /><AvatarFallback>{row.original.firstName[0]}{row.original.lastName[0]}</AvatarFallback></Avatar>
          <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.occupation ?? '—'}</p></div>
        </div>
      ),
    },
    {
      accessorKey: 'children',
      header: 'Children',
      cell: ({ row }) => {
        const labels = getParentChildrenLabels(row.original, studentNameById)
        if (labels.length === 0) {
          return <span className="text-sm text-muted-foreground">—</span>
        }
        return labels.map((c) => (
          <Badge key={c} variant="secondary" className="mr-1">
            {c}
          </Badge>
        ))
      },
    },
    { accessorKey: 'email', header: 'Contact', cell: ({ row }) => <div className="text-sm"><p className="flex items-center gap-1"><Mail className="h-3 w-3" />{row.original.email}</p><p className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{row.original.phone}</p></div> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionMenu actions={[
          { label: 'Edit', onClick: () => openEditForm(row.original) },
          { label: 'Send Email', onClick: () => toast({ title: 'Email sent', description: row.original.email }) },
          { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
        ]} />
      ),
    },
  ]

  const handleSave = async (formData: ParentFormData) => {
    const links = buildParentStudentLinks(formData.studentIds ?? [], studentNameById)
    const parentName = `${formData.firstName} ${formData.lastName}`.trim()

    try {
      if (selected) {
        await updateParent.mutateAsync({
          id: selected.id,
          body: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            occupation: formData.occupation,
            address: formData.address,
            status: formData.status,
            studentIds: links.studentIds,
            children: links.children,
          },
        })
        toast({
          title: 'Parent updated',
          description:
            links.children.length > 0
              ? `${parentName} linked to ${links.children.length} student(s).`
              : parentName,
        })
      } else {
        await createParent.mutateAsync({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          occupation: formData.occupation,
          address: formData.address,
          status: formData.status,
          studentIds: links.studentIds,
          children: links.children,
        })
        toast({
          title: 'Parent created',
          description:
            links.children.length > 0
              ? `${parentName} linked to ${links.children.length} student(s).`
              : parentName,
        })
      }
      setShowForm(false)
      setSelected(null)
      form.reset(emptyParentFormValues)
    } catch (err) {
      if (isApiError(err) && err.status === 404 && selected) {
        setSelected(null)
        setShowForm(false)
        form.reset(emptyParentFormValues)
        await refetch()
        toast({
          title: 'Parent not found',
          description: 'That parent no longer exists. The list was refreshed.',
          variant: 'destructive',
        })
        return
      }
      toast({
        title: 'Could not save parent',
        description: isApiError(err) ? err.message : 'Failed to save parent',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    const deletedName = selected.name
    try {
      await deleteParent.mutateAsync(selected.id)
      setShowDelete(false)
      setSelected(null)
      toast({
        title: 'Parent deleted',
        description: `${deletedName} has been removed from the system.`,
      })
    } catch (err) {
      toast({
        title: 'Could not delete parent',
        description: isApiError(err) ? err.message : 'Failed to delete parent',
        variant: 'destructive',
      })
    }
  }

  if (isLoading) return <ApiPageLoading rows={3} />
  if (isError) {
    return (
      <ApiPageError
        message={isApiError(error) ? error.message : 'Failed to load parents from EduSync.'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Parents" description="Manage parent accounts and guardian information." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Parents' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(parents, 'parents')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={openAddForm}><Plus className="h-4 w-4" />Add Parent</Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Parents" value={parents.length} icon={UserCircle} />
          <StatCard title="Active" value={parents.filter((p) => p.status === 'active').length} changeType="positive" icon={UserCircle} />
          <StatCard title="Linked Students" value={parents.reduce((a, p) => a + countLinkedStudents(p), 0)} icon={UserCircle} />
        </motion.div>

        <DataTable columns={columns} data={parents} searchKey="name" searchPlaceholder="Search parents..." showRowSelection onExport={() => exportToCsv(parents, 'parents')} />
      </div>

      <SlideOver open={showForm} onClose={() => { setShowForm(false); setSelected(null) }} title={selected ? 'Edit Parent' : 'Add Parent'} size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleSave)} disabled={createParent.isPending || updateParent.isPending}>Save</Button></div>}>
        <div className="space-y-8">
        <FormSection title="Details">
          <FormField label="First Name" required><Input {...form.register('firstName')} /></FormField>
          <FormField label="Last Name" required><Input {...form.register('lastName')} /></FormField>
          <FormField label="Email" required><Input type="email" {...form.register('email')} /></FormField>
          <FormField label="Phone" required><Input {...form.register('phone')} /></FormField>
          <FormField label="Occupation"><Input {...form.register('occupation')} /></FormField>
          <FormField label="Address" required className="sm:col-span-2"><Input {...form.register('address')} /></FormField>
        </FormSection>

        <FormSection
          title="Linked Students"
          description="Select students from this school to link as children. Links appear in the Parents table and parent portal."
        >
          <div className="sm:col-span-2 space-y-3">
            {students.length === 0 ? (
              <div className="flex items-center gap-2 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                <Users className="h-4 w-4 shrink-0" />
                No students found for this tenant. Add students first, then link them here.
              </div>
            ) : (
              <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
                {students.map((student) => {
                  const checked = selectedStudentIds.includes(student.id)
                  return (
                    <label
                      key={student.id}
                      className="flex cursor-pointer items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleStudentLink(student.id)}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {student.class} · Roll {student.rollNo}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}

            {selectedStudentIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {selectedStudentIds.map((id) => {
                  const name = studentNameById.get(id)
                  if (!name) return null
                  return (
                    <Badge key={id} variant="secondary" className="gap-1">
                      {name}
                      <button
                        type="button"
                        className="ml-0.5 rounded-full hover:text-destructive"
                        onClick={() => toggleStudentLink(id)}
                        aria-label={`Remove ${name}`}
                      >
                        ×
                      </button>
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>
        </FormSection>
        </div>
      </SlideOver>

      <ConfirmDialog
        open={showDelete}
        onClose={() => {
          setShowDelete(false)
          setSelected(null)
        }}
        onConfirm={handleDelete}
        title="Delete Parent"
        description={`Are you sure you want to delete ${selected?.name ?? 'this parent'}? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        loading={deleteParent.isPending}
      />
    </DashboardLayout>
  )
}
