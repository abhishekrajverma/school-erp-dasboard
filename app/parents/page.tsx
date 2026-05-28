'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Download, UserCircle, Mail, Phone } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, FormSection, FormField } from '@/components/shared/page-components'
import { parentsData } from '@/lib/erp-data'
import { parentSchema, type ParentFormData } from '@/lib/schemas'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'

type Parent = (typeof parentsData)[0]

export default function ParentsPage() {
  const { toast } = useToast()
  const [parents, setParents] = React.useState(parentsData)
  const [showForm, setShowForm] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<Parent | null>(null)

  const form = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', occupation: '', address: '', status: 'active' },
  })

  const columns: ColumnDef<Parent>[] = [
    {
      accessorKey: 'name',
      header: 'Parent',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarImage src={row.original.avatar} /><AvatarFallback>{row.original.firstName[0]}{row.original.lastName[0]}</AvatarFallback></Avatar>
          <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground">{row.original.occupation}</p></div>
        </div>
      ),
    },
    { accessorKey: 'children', header: 'Children', cell: ({ row }) => row.original.children.map((c) => <Badge key={c} variant="secondary" className="mr-1">{c}</Badge>) },
    { accessorKey: 'email', header: 'Contact', cell: ({ row }) => <div className="text-sm"><p className="flex items-center gap-1"><Mail className="h-3 w-3" />{row.original.email}</p><p className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{row.original.phone}</p></div> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionMenu actions={[
          { label: 'Edit', onClick: () => { setSelected(row.original); form.reset({ firstName: row.original.firstName, lastName: row.original.lastName, email: row.original.email, phone: row.original.phone, occupation: row.original.occupation, address: row.original.address, status: row.original.status as ParentFormData['status'] }); setShowForm(true) } },
          { label: 'Send Email', onClick: () => toast({ title: 'Email sent', description: row.original.email }) },
          { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
        ]} />
      ),
    },
  ]

  const handleSave = (data: ParentFormData) => {
    const record = {
      id: selected?.id ?? String(parents.length + 1),
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone,
      occupation: data.occupation ?? '',
      address: data.address,
      children: selected?.children ?? [],
      studentIds: selected?.studentIds ?? [],
      status: data.status,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.firstName}`,
    }
    if (selected) setParents(parents.map((p) => (p.id === selected.id ? record : p)))
    else setParents([...parents, record])
    setShowForm(false)
    setSelected(null)
    form.reset()
    toast({ title: 'Parent saved' })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Parents" description="Manage parent accounts and guardian information." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Parents' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(parents, 'parents')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => { setSelected(null); form.reset(); setShowForm(true) }}><Plus className="h-4 w-4" />Add Parent</Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Parents" value={parents.length} icon={UserCircle} />
          <StatCard title="Active" value={parents.filter((p) => p.status === 'active').length} changeType="positive" icon={UserCircle} />
          <StatCard title="Linked Students" value={parents.reduce((a, p) => a + p.children.length, 0)} icon={UserCircle} />
        </motion.div>

        <DataTable columns={columns} data={parents} searchKey="name" searchPlaceholder="Search parents..." showRowSelection onExport={() => exportToCsv(parents, 'parents')} />
      </div>

      <SlideOver open={showForm} onClose={() => { setShowForm(false); setSelected(null) }} title={selected ? 'Edit Parent' : 'Add Parent'} size="md" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleSave)}>Save</Button></div>}>
        <FormSection title="Details">
          <FormField label="First Name" required><Input {...form.register('firstName')} /></FormField>
          <FormField label="Last Name" required><Input {...form.register('lastName')} /></FormField>
          <FormField label="Email" required><Input type="email" {...form.register('email')} /></FormField>
          <FormField label="Phone" required><Input {...form.register('phone')} /></FormField>
          <FormField label="Occupation"><Input {...form.register('occupation')} /></FormField>
          <FormField label="Address" required className="sm:col-span-2"><Input {...form.register('address')} /></FormField>
        </FormSection>
      </SlideOver>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={() => { if (selected) { setParents(parents.filter((p) => p.id !== selected.id)); setShowDelete(false); toast({ title: 'Parent deleted', variant: 'destructive' }) } }} title="Delete Parent" description="Remove this parent record?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
