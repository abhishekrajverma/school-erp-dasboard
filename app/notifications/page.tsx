'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Download, Bell, Send, Eye } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DataTable, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, FormSection, FormField } from '@/components/shared/page-components'
import { notificationsData } from '@/lib/erp-data'
import { notificationSchema, type NotificationFormData } from '@/lib/schemas'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type Notification = (typeof notificationsData)[0]

const typeStyles: Record<string, string> = {
  info: 'bg-primary/10 text-primary border-primary/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
}

export default function NotificationsPage() {
  const { toast } = useToast()
  const [items, setItems] = React.useState(notificationsData)
  const [showForm, setShowForm] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<Notification | null>(null)

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { title: '', message: '', type: 'info', targetAudience: 'all' },
  })

  const columns: ColumnDef<Notification>[] = [
    { accessorKey: 'title', header: 'Notification', cell: ({ row }) => <div><p className="font-medium">{row.original.title}</p><p className="text-xs text-muted-foreground line-clamp-1">{row.original.message}</p></div> },
    { accessorKey: 'type', header: 'Type', cell: ({ row }) => <Badge variant="outline" className={cn('capitalize', typeStyles[row.original.type])}>{row.original.type}</Badge> },
    { accessorKey: 'targetAudience', header: 'Audience', cell: ({ row }) => <span className="capitalize">{row.original.targetAudience}</span> },
    { accessorKey: 'sentAt', header: 'Sent' },
    { accessorKey: 'readCount', header: 'Read', cell: ({ row }) => <span>{row.original.readCount}/{row.original.totalRecipients}</span> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'View Stats', onClick: () => toast({ title: row.original.title, description: `${row.original.readCount} reads` }) },
      { label: 'Resend', onClick: () => toast({ title: 'Notification resent' }) },
      { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
    ]} /> },
  ]

  const handleSend = (data: NotificationFormData) => {
    setItems([{
      id: String(items.length + 1),
      ...data,
      sentAt: new Date().toISOString().split('T')[0],
      readCount: 0,
      totalRecipients: data.targetAudience === 'all' ? 3200 : 2847,
    }, ...items])
    setShowForm(false)
    form.reset()
    toast({ title: 'Notification sent', description: data.title })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Notifications" description="Send announcements to students, parents, and staff." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Notifications' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(items, 'notifications')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowForm(true)}><Plus className="h-4 w-4" />New Notification</Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Sent" value={items.length} icon={Send} />
          <StatCard title="Avg. Read Rate" value={`${Math.round(items.reduce((a, n) => a + n.readCount / n.totalRecipients, 0) / items.length * 100)}%`} icon={Eye} />
          <StatCard title="This Month" value={items.length} icon={Bell} />
        </div>

        <DataTable columns={columns} data={items} searchKey="title" showRowSelection />
      </div>

      <SlideOver open={showForm} onClose={() => setShowForm(false)} title="Send Notification" size="md" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleSend)} className="gap-2"><Send className="h-4 w-4" />Send</Button></div>}>
        <FormSection title="Message">
          <FormField label="Title" required className="sm:col-span-2"><Input {...form.register('title')} /></FormField>
          <FormField label="Message" required className="sm:col-span-2"><Textarea rows={4} {...form.register('message')} /></FormField>
          <FormField label="Type"><Input {...form.register('type')} placeholder="info | warning | success" /></FormField>
          <FormField label="Audience"><Input {...form.register('targetAudience')} placeholder="all | parents | staff" /></FormField>
        </FormSection>
      </SlideOver>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={() => { if (selected) { setItems(items.filter((n) => n.id !== selected.id)); setShowDelete(false) } }} title="Delete" description="Remove this notification?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
