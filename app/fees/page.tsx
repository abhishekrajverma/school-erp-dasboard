'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Plus,
  Download,
  DollarSign,
  Clock,
  XCircle,
  CheckCircle2,
  TrendingUp,
  FileText,
  Receipt,
  Award,
  AlertTriangle,
} from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
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
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { PageHeader, StatCard, Tabs, FormSection, FormField } from '@/components/shared/page-components'
import { feeRecordsData, monthlyFeeCollection, studentsData, type FeeRecord } from '@/lib/erp-data'
import { feeRecordSchema, type FeeRecordFormData } from '@/lib/schemas'
import { formatCurrency } from '@/lib/format'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'

const outstandingByClass = [
  { class: '8-B', amount: 42000 },
  { class: '9-C', amount: 121000 },
  { class: '10-A', amount: 0 },
  { class: '11-B', amount: 0 },
  { class: '12-A', amount: 0 },
]

export default function FeesPage() {
  const { toast } = useToast()
  const [records, setRecords] = React.useState<FeeRecord[]>(feeRecordsData)
  const [activeTab, setActiveTab] = React.useState('all')
  const [showAdd, setShowAdd] = React.useState(false)
  const [showEdit, setShowEdit] = React.useState(false)
  const [showDetail, setShowDetail] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<FeeRecord | null>(null)

  const form = useForm<FeeRecordFormData>({
    resolver: zodResolver(feeRecordSchema),
    defaultValues: {
      studentName: '',
      class: '',
      feeType: 'tuition',
      totalFee: 0,
      paid: 0,
      discount: 0,
      fine: 0,
      dueDate: '',
      status: 'pending',
    },
  })

  const filtered = records.filter((r) => {
    if (activeTab === 'all') return true
    if (activeTab === 'scholarship') return r.discount > 0
    if (activeTab === 'fines') return r.fine > 0
    return r.status === activeTab
  })

  const totalCollected = records.reduce((a, r) => a + r.paid, 0)
  const totalPending = records.reduce((a, r) => a + r.pending, 0)
  const overdueAmount = records.filter((r) => r.status === 'overdue').reduce((a, r) => a + r.pending, 0)

  const handleAdd = (data: FeeRecordFormData) => {
    const pending = Math.max(0, data.totalFee - data.paid - data.discount + data.fine)
    const newRecord: FeeRecord = {
      id: String(records.length + 1),
      invoiceNo: `INV2024${String(records.length + 1).padStart(3, '0')}`,
      studentId: '0',
      studentName: data.studentName,
      class: data.class,
      feeType: data.feeType,
      totalFee: data.totalFee,
      paid: data.paid,
      pending,
      discount: data.discount,
      fine: data.fine,
      dueDate: data.dueDate,
      paidDate: data.paid >= data.totalFee ? new Date().toISOString().split('T')[0] : null,
      status: data.status,
      paymentMethod: data.paid > 0 ? 'upi' : null,
    }
    setRecords([...records, newRecord])
    setShowAdd(false)
    form.reset()
    toast({ title: 'Fee record created', description: `Invoice ${newRecord.invoiceNo} added.` })
  }

  const handleEdit = (data: FeeRecordFormData) => {
    if (!selected) return
    const pending = Math.max(0, data.totalFee - data.paid - data.discount + data.fine)
    setRecords(
      records.map((r) =>
        r.id === selected.id
          ? {
              ...r,
              studentName: data.studentName,
              class: data.class,
              feeType: data.feeType,
              totalFee: data.totalFee,
              paid: data.paid,
              pending,
              discount: data.discount,
              fine: data.fine,
              dueDate: data.dueDate,
              status: data.status,
            }
          : r
      )
    )
    setShowEdit(false)
    setSelected(null)
    form.reset()
    toast({ title: 'Fee record updated' })
  }

  const handleDelete = () => {
    if (!selected) return
    setRecords(records.filter((r) => r.id !== selected.id))
    setShowDelete(false)
    setSelected(null)
    toast({ title: 'Fee record deleted', variant: 'destructive' })
  }

  const openEdit = (record: FeeRecord) => {
    setSelected(record)
    form.reset({
      studentName: record.studentName,
      class: record.class,
      feeType: record.feeType as FeeRecordFormData['feeType'],
      totalFee: record.totalFee,
      paid: record.paid,
      discount: record.discount,
      fine: record.fine,
      dueDate: record.dueDate,
      status: record.status as FeeRecordFormData['status'],
    })
    setShowEdit(true)
  }

  const columns: ColumnDef<FeeRecord>[] = [
    {
      accessorKey: 'studentName',
      header: 'Student',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${row.original.studentName}`} />
            <AvatarFallback>{row.original.studentName.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.original.studentName}</p>
            <p className="text-xs text-muted-foreground font-mono">{row.original.invoiceNo}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'class', header: 'Class', cell: ({ row }) => <Badge variant="secondary">{row.original.class}</Badge> },
    { accessorKey: 'feeType', header: 'Type', cell: ({ row }) => <span className="capitalize text-sm">{row.original.feeType}</span> },
    { accessorKey: 'totalFee', header: 'Total', cell: ({ row }) => formatCurrency(row.original.totalFee) },
    { accessorKey: 'paid', header: 'Paid', cell: ({ row }) => <span className="text-green-500">{formatCurrency(row.original.paid)}</span> },
    { accessorKey: 'pending', header: 'Pending', cell: ({ row }) => <span className={row.original.pending > 0 ? 'text-yellow-500' : ''}>{formatCurrency(row.original.pending)}</span> },
    { accessorKey: 'dueDate', header: 'Due Date' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionMenu
          actions={[
            { label: 'View Details', onClick: () => { setSelected(row.original); setShowDetail(true) } },
            { label: 'Generate Invoice', onClick: () => toast({ title: 'Invoice generated', description: row.original.invoiceNo }) },
            { label: 'Record Payment', onClick: () => openEdit(row.original) },
            { label: 'Edit Record', onClick: () => openEdit(row.original) },
            { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
          ]}
        />
      ),
    },
  ]

  const FeeForm = () => (
    <div className="space-y-6">
      <FormSection title="Student & Fee">
        <FormField label="Student Name" required error={form.formState.errors.studentName?.message}>
          <Input {...form.register('studentName')} />
        </FormField>
        <FormField label="Class" required error={form.formState.errors.class?.message}>
          <Select value={form.watch('class')} onValueChange={(v) => form.setValue('class', v)}>
            <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
            <SelectContent>
              {[...new Set(studentsData.map((s) => s.class))].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Fee Type" required>
          <Select value={form.watch('feeType')} onValueChange={(v) => form.setValue('feeType', v as FeeRecordFormData['feeType'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['tuition', 'transport', 'library', 'lab', 'sports', 'other'].map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Due Date" required error={form.formState.errors.dueDate?.message}>
          <Input type="date" {...form.register('dueDate')} />
        </FormField>
      </FormSection>
      <FormSection title="Amounts">
        <FormField label="Total Fee (₹)" required>
          <Input type="number" {...form.register('totalFee', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Paid (₹)">
          <Input type="number" {...form.register('paid', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Discount (₹)">
          <Input type="number" {...form.register('discount', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Fine (₹)">
          <Input type="number" {...form.register('fine', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Status">
          <Select value={form.watch('status')} onValueChange={(v) => form.setValue('status', v as FeeRecordFormData['status'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Fees Management"
          description="Track fee collection, pending dues, invoices, scholarships, and fines."
          breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Fees' }]}
        >
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(records, 'fee-records')}>
            <Download className="h-4 w-4" />Export CSV
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAdd(true)}>
            <Plus className="h-4 w-4" />Add Fee Record
          </Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Collected" value={formatCurrency(totalCollected)} change="This academic year" changeType="positive" icon={DollarSign} />
          <StatCard title="Pending Fees" value={formatCurrency(totalPending)} change={`${records.filter((r) => r.status === 'pending').length} students`} changeType="neutral" icon={Clock} />
          <StatCard title="Overdue Amount" value={formatCurrency(overdueAmount)} change={`${records.filter((r) => r.status === 'overdue').length} overdue`} changeType="negative" icon={XCircle} />
          <StatCard title="Collection Rate" value={`${((totalCollected / (totalCollected + totalPending)) * 100).toFixed(1)}%`} change="+5.2% from last month" changeType="positive" icon={TrendingUp} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Fee Collection</CardTitle><CardDescription>Collected vs pending (₹ lakhs)</CardDescription></CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFeeCollection.map((m) => ({ ...m, collected: m.collected / 100000, pending: m.pending / 100000 }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip formatter={(v: number) => [`₹${v}L`, '']} />
                  <Area type="monotone" dataKey="collected" stackId="1" stroke="var(--primary))" fill="var(--primary))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="pending" stackId="1" stroke="var(--chart-3))" fill="var(--chart-3))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Outstanding by Class</CardTitle><CardDescription>Pending dues breakdown</CardDescription></CardHeader>
            <CardContent className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outstandingByClass}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="class" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Bar dataKey="amount" fill="var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs
          tabs={[
            { id: 'all', label: 'All Records', count: records.length },
            { id: 'paid', label: 'Paid', count: records.filter((r) => r.status === 'paid').length },
            { id: 'pending', label: 'Pending', count: records.filter((r) => r.status === 'pending').length },
            { id: 'overdue', label: 'Overdue', count: records.filter((r) => r.status === 'overdue').length },
            { id: 'scholarship', label: 'Scholarships', count: records.filter((r) => r.discount > 0).length },
            { id: 'fines', label: 'Fines', count: records.filter((r) => r.fine > 0).length },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <DataTable
          columns={columns}
          data={filtered}
          searchKey="studentName"
          searchPlaceholder="Search by student or invoice..."
          filterColumns={[
            { key: 'status', label: 'Status', options: [{ label: 'Paid', value: 'paid' }, { label: 'Pending', value: 'pending' }, { label: 'Overdue', value: 'overdue' }] },
            { key: 'feeType', label: 'Type', options: [{ label: 'Tuition', value: 'tuition' }, { label: 'Transport', value: 'transport' }] },
          ]}
          showRowSelection
          onExport={() => exportToCsv(records, 'fee-records')}
        />
      </div>

      <SlideOver open={showAdd} onClose={() => { setShowAdd(false); form.reset() }} title="Add Fee Record" description="Create a new fee invoice for a student." size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleAdd)}>Create Record</Button></div>}>
        <FeeForm />
      </SlideOver>

      <SlideOver open={showEdit} onClose={() => { setShowEdit(false); setSelected(null); form.reset() }} title="Edit Fee Record" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleEdit)}>Save Changes</Button></div>}>
        <FeeForm />
      </SlideOver>

      <SlideOver open={showDetail} onClose={() => { setShowDetail(false); setSelected(null) }} title="Fee Details" size="md">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14"><AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selected.studentName}`} /><AvatarFallback>{selected.studentName[0]}</AvatarFallback></Avatar>
              <div>
                <h3 className="font-semibold text-lg">{selected.studentName}</h3>
                <p className="text-sm text-muted-foreground">{selected.class} · {selected.invoiceNo}</p>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Total Fee</p><p className="font-medium">{formatCurrency(selected.totalFee)}</p></div>
              <div><p className="text-muted-foreground">Paid</p><p className="font-medium text-green-500">{formatCurrency(selected.paid)}</p></div>
              <div><p className="text-muted-foreground">Pending</p><p className="font-medium text-yellow-500">{formatCurrency(selected.pending)}</p></div>
              <div><p className="text-muted-foreground">Due Date</p><p className="font-medium">{selected.dueDate}</p></div>
              {selected.discount > 0 && <div><p className="text-muted-foreground">Scholarship</p><p className="font-medium flex items-center gap-1"><Award className="h-3 w-3" />{formatCurrency(selected.discount)}</p></div>}
              {selected.fine > 0 && <div><p className="text-muted-foreground">Fine</p><p className="font-medium text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{formatCurrency(selected.fine)}</p></div>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="gap-2" onClick={() => toast({ title: 'Receipt generated', description: selected.invoiceNo })}><Receipt className="h-4 w-4" />Generate Receipt</Button>
              <Button size="sm" variant="outline" className="gap-2"><FileText className="h-4 w-4" />Download Invoice</Button>
            </div>
          </div>
        )}
      </SlideOver>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Delete Fee Record" description={`Remove invoice ${selected?.invoiceNo}? This cannot be undone.`} confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
