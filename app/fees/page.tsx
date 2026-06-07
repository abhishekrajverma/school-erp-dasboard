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
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import type { FeeRecordDto } from '@/lib/api/types/fees'
import {
  feeRecordSchema,
  multiFeePaymentSchema,
  type FeeRecordFormData,
  type MultiFeePaymentFormData,
} from '@/lib/schemas'
import { formatCurrency } from '@/lib/format'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'
import { useFees, useDashboard, useStudents } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'
import { MultiFeePaymentForm } from '@/components/fees/multi-fee-payment-form'
import {
  buildDefaultFeeLines,
  calculateMultiFeeTotals,
} from '@/lib/fees/calculations'
import { SCHOOL_FEE_TYPES } from '@/lib/fees/constants'

const outstandingByClassFromRecords = (records: FeeRecordDto[]) => {
  const byClass = new Map<string, number>()
  for (const r of records) {
    if (r.pending > 0) {
      byClass.set(r.class, (byClass.get(r.class) ?? 0) + r.pending)
    }
  }
  return [...byClass.entries()].map(([className, amount]) => ({ class: className, amount }))
}

type FeeLineItem = { feeType: string; amount: number; lineDiscount?: number }

function getFeeItems(record: FeeRecordDto): FeeLineItem[] {
  if (!record.feeItems || !Array.isArray(record.feeItems)) return []
  return record.feeItems as FeeLineItem[]
}

export default function FeesPage() {
  const { toast } = useToast()
  const { data: feesData, isLoading, isError, error, refetch } = useFees({ page: 1, pageSize: 100 })
  const { data: dashboardData } = useDashboard()
  const { data: studentsData } = useStudents({ page: 1, pageSize: 100 })
  const records = feesData?.items ?? []
  const monthlyFeeCollection = dashboardData?.monthlyFeeCollection ?? []
  const outstandingByClass = outstandingByClassFromRecords(records)
  const [activeTab, setActiveTab] = React.useState('all')
  const [showAdd, setShowAdd] = React.useState(false)
  const [showEdit, setShowEdit] = React.useState(false)
  const [showDetail, setShowDetail] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<FeeRecordDto | null>(null)

  const legacyForm = useForm<FeeRecordFormData>({
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

  const multiForm = useForm<MultiFeePaymentFormData>({
    resolver: zodResolver(multiFeePaymentSchema),
    defaultValues: {
      studentName: '',
      class: '',
      dueDate: '',
      feeLines: buildDefaultFeeLines(),
      globalDiscount: 0,
      discountPercent: 0,
      fine: 0,
      amountPaying: 0,
      paymentMethod: 'upi',
      status: 'pending',
    },
  })

  const classOptions = React.useMemo(
    () => [...new Set((studentsData?.items ?? []).map((s) => s.class))],
    [studentsData],
  )

  const filtered = records.filter((r) => {
    if (activeTab === 'all') return true
    if (activeTab === 'scholarship') return r.discount > 0
    if (activeTab === 'fines') return r.fine > 0
    return r.status === activeTab
  })

  const totalCollected = records.reduce((a, r) => a + r.paid, 0)
  const totalPending = records.reduce((a, r) => a + r.pending, 0)
  const overdueAmount = records.filter((r) => r.status === 'overdue').reduce((a, r) => a + r.pending, 0)

  const resetMultiForm = () => {
    multiForm.reset({
      studentName: '',
      class: '',
      dueDate: '',
      feeLines: buildDefaultFeeLines(),
      globalDiscount: 0,
      discountPercent: 0,
      fine: 0,
      amountPaying: 0,
      paymentMethod: 'upi',
      status: 'pending',
    })
  }

  const handleMultiFeeAdd = (_data: MultiFeePaymentFormData) => {
    toast({ title: 'Fee write API is not available on the backend yet' })
    setShowAdd(false)
    resetMultiForm()
  }

  const handleMultiFeeEdit = (_data: MultiFeePaymentFormData) => {
    toast({ title: 'Fee write API is not available on the backend yet' })
    setShowEdit(false)
    setSelected(null)
    resetMultiForm()
  }

  const handleLegacyEdit = (_data: FeeRecordFormData) => {
    toast({ title: 'Fee write API is not available on the backend yet' })
    setShowEdit(false)
    setSelected(null)
    legacyForm.reset()
  }

  const handleDelete = () => {
    toast({ title: 'Fee delete API is not available on the backend yet', variant: 'destructive' })
    setShowDelete(false)
    setSelected(null)
  }

  const schoolFeeTypeIds = SCHOOL_FEE_TYPES.map((f) => f.id)

  const openEdit = (record: FeeRecordDto) => {
    setSelected(record)
    const feeItems = getFeeItems(record)
    const useMultiForm =
      (feeItems.length > 0) ||
      schoolFeeTypeIds.includes(record.feeType as (typeof schoolFeeTypeIds)[number])

    if (useMultiForm) {
      const lines = buildDefaultFeeLines().map((defaultLine) => {
        const fromItems = feeItems.find((i) => i.feeType === defaultLine.feeType)
        if (fromItems) {
          return {
            enabled: true,
            feeType: defaultLine.feeType,
            amount: fromItems.amount,
            lineDiscount: fromItems.lineDiscount,
          }
        }
        if (!feeItems.length && record.feeType === defaultLine.feeType) {
          return {
            enabled: true,
            feeType: defaultLine.feeType,
            amount: record.totalFee,
            lineDiscount: 0,
          }
        }
        return defaultLine
      })
      const lineDiscountSum = lines.reduce((s, l) => s + (l.lineDiscount || 0), 0)
      multiForm.reset({
        studentName: record.studentName,
        class: record.class,
        dueDate: record.dueDate,
        feeLines: lines,
        globalDiscount: Math.max(0, record.discount - lineDiscountSum),
        discountPercent: 0,
        fine: record.fine,
        amountPaying: record.paid,
        paymentMethod: (record.paymentMethod as MultiFeePaymentFormData['paymentMethod']) ?? 'upi',
        status: record.status as MultiFeePaymentFormData['status'],
      })
    } else {
      legacyForm.reset({
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
    }
    setShowEdit(true)
  }

  const editUsesMultiForm =
    selected &&
    ((getFeeItems(selected).length > 0) ||
      schoolFeeTypeIds.includes(selected.feeType as (typeof schoolFeeTypeIds)[number]))

  const formatFeeTypeCell = (record: FeeRecordDto) => {
    const feeItems = getFeeItems(record)
    if (feeItems.length > 1) {
      return (
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {feeItems.slice(0, 2).map((item) => (
            <Badge key={item.feeType} variant="outline" className="text-xs capitalize">
              {item.feeType.replace('-', ' ')}
            </Badge>
          ))}
          {feeItems.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{feeItems.length - 2}
            </Badge>
          )}
        </div>
      )
    }
    return <span className="capitalize text-sm">{record.feeType.replace('-', ' ')}</span>
  }

  const columns: ColumnDef<FeeRecordDto>[] = [
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
    { accessorKey: 'feeType', header: 'Type', cell: ({ row }) => formatFeeTypeCell(row.original) },
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

  const LegacyFeeForm = () => (
    <div className="space-y-6">
      <FormSection title="Student & Fee">
        <FormField label="Student Name" required error={legacyForm.formState.errors.studentName?.message}>
          <Input {...legacyForm.register('studentName')} />
        </FormField>
        <FormField label="Class" required error={legacyForm.formState.errors.class?.message}>
          <Select value={legacyForm.watch('class')} onValueChange={(v) => legacyForm.setValue('class', v)}>
            <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
            <SelectContent>
              {classOptions.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Fee Type" required>
          <Select value={legacyForm.watch('feeType')} onValueChange={(v) => legacyForm.setValue('feeType', v as FeeRecordFormData['feeType'])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['tuition', 'transport', 'library', 'computer', 'smart-class', 'lab', 'sports', 'other'].map((t) => (
                <SelectItem key={t} value={t} className="capitalize">{t.replace('-', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Due Date" required error={legacyForm.formState.errors.dueDate?.message}>
          <Input type="date" {...legacyForm.register('dueDate')} />
        </FormField>
      </FormSection>
      <FormSection title="Amounts">
        <FormField label="Total Fee (₹)" required>
          <Input type="number" {...legacyForm.register('totalFee', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Paid (₹)">
          <Input type="number" {...legacyForm.register('paid', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Discount (₹)">
          <Input type="number" {...legacyForm.register('discount', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Fine (₹)">
          <Input type="number" {...legacyForm.register('fine', { valueAsNumber: true })} />
        </FormField>
        <FormField label="Status">
          <Select value={legacyForm.watch('status')} onValueChange={(v) => legacyForm.setValue('status', v as FeeRecordFormData['status'])}>
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

  if (isLoading) return <ApiPageLoading />
  if (isError) {
    return (
      <ApiPageError error={error} resourceName="fees" onRetry={() => refetch()} />
    )
  }

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
          <Button size="sm" className="gap-2" onClick={() => { resetMultiForm(); setShowAdd(true) }}>
            <Plus className="h-4 w-4" />Collect Fees
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
            {
              key: 'feeType',
              label: 'Type',
              options: [
                { label: 'Combined', value: 'combined' },
                ...SCHOOL_FEE_TYPES.map((f) => ({ label: f.label, value: f.id })),
              ],
            },
          ]}
          showRowSelection
          onExport={() => exportToCsv(records, 'fee-records')}
        />
      </div>

      <SlideOver
        open={showAdd}
        onClose={() => { setShowAdd(false); resetMultiForm() }}
        title="Collect Fees"
        description="Select Tuition, Transport, Library, Computer, Smart Class — pay multiple fees on one invoice with discounts."
        size="xl"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={multiForm.handleSubmit(handleMultiFeeAdd)}>Record Payment</Button>
          </div>
        }
      >
        <MultiFeePaymentForm form={multiForm} classOptions={classOptions} />
      </SlideOver>

      <SlideOver
        open={showEdit}
        onClose={() => { setShowEdit(false); setSelected(null); resetMultiForm(); legacyForm.reset() }}
        title={editUsesMultiForm ? 'Edit Fee Payment' : 'Edit Fee Record'}
        size={editUsesMultiForm ? 'xl' : 'lg'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button
              onClick={
                editUsesMultiForm
                  ? multiForm.handleSubmit(handleMultiFeeEdit)
                  : legacyForm.handleSubmit(handleLegacyEdit)
              }
            >
              Save Changes
            </Button>
          </div>
        }
      >
        {editUsesMultiForm ? (
          <MultiFeePaymentForm form={multiForm} classOptions={classOptions} />
        ) : (
          <LegacyFeeForm />
        )}
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
              {selected.discount > 0 && <div><p className="text-muted-foreground">Total Discount</p><p className="font-medium flex items-center gap-1"><Award className="h-3 w-3" />{formatCurrency(selected.discount)}</p></div>}
              {selected.fine > 0 && <div><p className="text-muted-foreground">Fine</p><p className="font-medium text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{formatCurrency(selected.fine)}</p></div>}
            </div>
            {getFeeItems(selected).length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <p className="text-sm font-medium px-4 py-2 bg-muted/50 border-b border-border">Fee breakdown</p>
                <div className="divide-y divide-border">
                  {getFeeItems(selected).map((item) => (
                    <div key={item.feeType} className="flex justify-between px-4 py-2.5 text-sm">
                      <span className="capitalize">{item.feeType.replace('-', ' ')}</span>
                      <span>
                        {formatCurrency(item.amount)}
                        {item.lineDiscount != null && item.lineDiscount > 0 && (
                          <span className="text-green-500 ml-2">(−{formatCurrency(item.lineDiscount)})</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
