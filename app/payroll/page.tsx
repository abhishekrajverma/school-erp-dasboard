'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Download, Wallet, Users, Clock, CheckCircle2, Calculator, FileText } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Legend } from 'recharts'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, Tabs, FormSection, FormField } from '@/components/shared/page-components'
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import type { PayrollRecordDto } from '@/lib/api/types/resources'
import { payrollSchema, type PayrollFormData } from '@/lib/schemas'
import { formatCurrency } from '@/lib/format'
import { exportToCsv } from '@/lib/export'
import { usePayroll, useTeachers, useDashboard } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'
import { useToast } from '@/hooks/use-toast'
import { enrichPieData } from '@/lib/chart-colors'
import { PieChartTooltip, PieChartLegend, pieActiveShape } from '@/components/charts/pie-chart-tooltip'

type PayrollRecord = PayrollRecordDto

export default function PayrollPage() {
  const { toast } = useToast()
  const { data, isLoading, isError, error, refetch } = usePayroll({ page: 1, pageSize: 100 })
  const { data: teachersData } = useTeachers({ page: 1, pageSize: 100 })
  const { data: dashboardData } = useDashboard()
  const records = data?.items ?? []
  const teachers = teachersData?.items ?? []
  const monthlyPayroll = (dashboardData?.monthlyFeeCollection ?? []).map((m) => ({
    month: m.month,
    expense: m.collected,
  }))
  const salaryDistribution = React.useMemo(() => {
    const byDept = new Map<string, number>()
    for (const r of records) {
      byDept.set(r.department, (byDept.get(r.department) ?? 0) + r.netSalary)
    }
    return [...byDept.entries()].map(([department, amount]) => ({ department, amount }))
  }, [records])
  const [activeTab, setActiveTab] = React.useState('all')
  const [showAdd, setShowAdd] = React.useState(false)
  const [showEdit, setShowEdit] = React.useState(false)
  const [showDetail, setShowDetail] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<PayrollRecord | null>(null)

  const form = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      employeeId: '',
      month: 'June',
      year: 2024,
      basicSalary: 0,
      allowances: { hra: 0, da: 0, ta: 0, medical: 0, special: 0 },
      deductions: { pf: 0, tax: 0, insurance: 0, loan: 0, other: 0 },
      bonus: 0,
    },
  })

  const filtered = records.filter((r) => activeTab === 'all' || r.status === activeTab)

  const totalExpense = records.reduce((a, r) => a + r.grossSalary, 0)
  const pendingSalary = records.filter((r) => r.status === 'pending' || r.status === 'approved').reduce((a, r) => a + r.netSalary, 0)
  const paidSalary = records.filter((r) => r.status === 'paid').reduce((a, r) => a + r.netSalary, 0)

  const buildRecord = (data: PayrollFormData, existing?: PayrollRecord): PayrollRecord => {
    const teacher = teachers.find((t) => t.id === data.employeeId)
    const gross = data.basicSalary + Object.values(data.allowances).reduce((a, b) => a + b, 0) + data.bonus
    const totalDeductions = Object.values(data.deductions).reduce((a, b) => a + b, 0)
    return {
      id: existing?.id ?? String(records.length + 1),
      employeeId: data.employeeId,
      employeeName: teacher?.name ?? existing?.employeeName ?? 'Employee',
      department: teacher?.department ?? existing?.department ?? '',
      month: data.month,
      year: data.year,
      basicSalary: data.basicSalary,
      hra: data.allowances.hra,
      da: data.allowances.da,
      ta: data.allowances.ta,
      medical: data.allowances.medical,
      special: data.allowances.special,
      pfDeduction: data.deductions.pf,
      taxDeduction: data.deductions.tax,
      insurance: data.deductions.insurance,
      loanDeduction: data.deductions.loan,
      otherDeduction: data.deductions.other,
      bonus: data.bonus,
      grossSalary: gross,
      totalDeductions,
      netSalary: gross - totalDeductions,
      status: existing?.status ?? 'pending',
      paymentDate: existing?.paymentDate ?? null,
    }
  }

  const handleAdd = (_data: PayrollFormData) => {
    toast({ title: 'Payroll write API is not available on the backend yet' })
    setShowAdd(false)
    form.reset()
  }

  const handleEdit = (_data: PayrollFormData) => {
    toast({ title: 'Payroll write API is not available on the backend yet' })
    setShowEdit(false)
    setSelected(null)
    form.reset()
  }

  const handleDelete = () => {
    toast({ title: 'Payroll delete API is not available on the backend yet', variant: 'destructive' })
    setShowDelete(false)
    setSelected(null)
  }

  const markPaid = (_record: PayrollRecord) => {
    toast({ title: 'Payroll payment API is not available on the backend yet' })
  }

  const openEdit = (record: PayrollRecord) => {
    setSelected(record)
    form.reset({
      employeeId: record.employeeId,
      month: record.month,
      year: record.year,
      basicSalary: record.basicSalary,
      allowances: { hra: record.hra, da: record.da, ta: record.ta, medical: record.medical, special: record.special },
      deductions: { pf: record.pfDeduction, tax: record.taxDeduction, insurance: record.insurance, loan: record.loanDeduction, other: record.otherDeduction },
      bonus: record.bonus,
    })
    setShowEdit(true)
  }

  const columns: ColumnDef<PayrollRecord>[] = [
    {
      accessorKey: 'employeeName',
      header: 'Employee',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9"><AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${row.original.employeeId}`} /><AvatarFallback>{row.original.employeeName.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
          <div><p className="font-medium">{row.original.employeeName}</p><p className="text-xs text-muted-foreground">{row.original.department}</p></div>
        </div>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row }) => <Badge variant="secondary">{row.original.department}</Badge>,
    },
    { accessorKey: 'month', header: 'Period', cell: ({ row }) => <span>{row.original.month} {row.original.year}</span> },
    { accessorKey: 'grossSalary', header: 'Gross', cell: ({ row }) => formatCurrency(row.original.grossSalary) },
    { accessorKey: 'totalDeductions', header: 'Deductions', cell: ({ row }) => <span className="text-red-500">-{formatCurrency(row.original.totalDeductions)}</span> },
    { accessorKey: 'netSalary', header: 'Net Pay', cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.original.netSalary)}</span> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    {
      id: 'actions',
      cell: ({ row }) => (
        <ActionMenu
          actions={[
            { label: 'View Payslip', onClick: () => { setSelected(row.original); setShowDetail(true) } },
            ...(row.original.status !== 'paid' ? [{ label: 'Process Payment', onClick: () => markPaid(row.original) }] : []),
            { label: 'Edit Record', onClick: () => openEdit(row.original) },
            { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
          ]}
        />
      ),
    },
  ]

  const PayrollForm = () => (
    <div className="space-y-6">
      <FormSection title="Employee">
        <FormField label="Employee" required className="sm:col-span-2">
          <Select value={form.watch('employeeId')} onValueChange={(v) => form.setValue('employeeId', v)}>
            <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
            <SelectContent>{teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
          </Select>
        </FormField>
        <FormField label="Month"><Input {...form.register('month')} /></FormField>
        <FormField label="Year"><Input type="number" {...form.register('year', { valueAsNumber: true })} /></FormField>
        <FormField label="Basic Salary (₹)"><Input type="number" {...form.register('basicSalary', { valueAsNumber: true })} /></FormField>
        <FormField label="Bonus (₹)"><Input type="number" {...form.register('bonus', { valueAsNumber: true })} /></FormField>
      </FormSection>
      <FormSection title="Allowances">
        {(['hra', 'da', 'ta', 'medical', 'special'] as const).map((key) => (
          <FormField key={key} label={key.toUpperCase()}><Input type="number" {...form.register(`allowances.${key}`, { valueAsNumber: true })} /></FormField>
        ))}
      </FormSection>
      <FormSection title="Deductions">
        {(['pf', 'tax', 'insurance', 'loan', 'other'] as const).map((key) => (
          <FormField key={key} label={key === 'pf' ? 'PF' : key.charAt(0).toUpperCase() + key.slice(1)}><Input type="number" {...form.register(`deductions.${key}`, { valueAsNumber: true })} /></FormField>
        ))}
      </FormSection>
    </div>
  )

  if (isLoading) return <ApiPageLoading />
  if (isError) {
    return (
      <ApiPageError
        message={isApiError(error) ? error.message : 'Failed to load payroll from EduSync.'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Salary & Payroll" description="Process salaries, generate payslips, and manage compensation." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Payroll' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(records, 'payroll-records')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4" />Add Payroll</Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Payroll" value={formatCurrency(totalExpense)} change="June 2024 cycle" icon={Wallet} />
          <StatCard title="Pending Payout" value={formatCurrency(pendingSalary)} change={`${records.filter((r) => r.status !== 'paid').length} employees`} changeType="neutral" icon={Clock} />
          <StatCard title="Paid Salaries" value={formatCurrency(paidSalary)} change={`${records.filter((r) => r.status === 'paid').length} processed`} changeType="positive" icon={CheckCircle2} />
          <StatCard title="Avg. Net Salary" value={formatCurrency(Math.round(records.reduce((a, r) => a + r.netSalary, 0) / records.length))} icon={Calculator} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Monthly Payroll Expense</CardTitle></CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyPayroll.map((m) => ({ ...m, expense: m.expense / 100000 }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" /><YAxis className="text-xs" />
                  <Tooltip formatter={(v: number) => [`₹${v}L`, 'Expense']} />
                  <Bar dataKey="expense" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Salary by Department</CardTitle></CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enrichPieData(salaryDistribution)}
                    dataKey="amount"
                    nameKey="department"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={3}
                    activeShape={pieActiveShape}
                  />
                  <Tooltip content={<PieChartTooltip />} cursor={false} />
                  <Legend content={<PieChartLegend />} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs tabs={[
          { id: 'all', label: 'All', count: records.length },
          { id: 'pending', label: 'Pending', count: records.filter((r) => r.status === 'pending').length },
          { id: 'approved', label: 'Approved', count: records.filter((r) => r.status === 'approved').length },
          { id: 'paid', label: 'Paid', count: records.filter((r) => r.status === 'paid').length },
        ]} activeTab={activeTab} onChange={setActiveTab} />

        <DataTable columns={columns} data={filtered} searchKey="employeeName" searchPlaceholder="Search employees..." filterColumns={[{ key: 'department', label: 'Department', options: [...new Set(records.map((r) => r.department))].map((d) => ({ label: d, value: d })) }]} showRowSelection onExport={() => exportToCsv(records, 'payroll')} />
      </div>

      <SlideOver open={showAdd} onClose={() => { setShowAdd(false); form.reset() }} title="Add Payroll Record" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleAdd)}>Create</Button></div>}><PayrollForm /></SlideOver>
      <SlideOver open={showEdit} onClose={() => { setShowEdit(false); setSelected(null) }} title="Edit Payroll" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleEdit)}>Save</Button></div>}><PayrollForm /></SlideOver>
      <SlideOver open={showDetail} onClose={() => setShowDetail(false)} title="Payslip" size="md">
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="rounded-lg border border-border p-4 space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Employee</span><span className="font-medium">{selected.employeeName}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Period</span><span>{selected.month} {selected.year}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Gross</span><span>{formatCurrency(selected.grossSalary)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Deductions</span><span className="text-red-500">-{formatCurrency(selected.totalDeductions)}</span></div>
              <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Net Pay</span><span>{formatCurrency(selected.netSalary)}</span></div>
            </div>
            <Button className="w-full gap-2" onClick={() => toast({ title: 'Payslip downloaded' })}><FileText className="h-4 w-4" />Download Payslip PDF</Button>
          </div>
        )}
      </SlideOver>
      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Delete Payroll Record" description="Remove this payroll entry?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
