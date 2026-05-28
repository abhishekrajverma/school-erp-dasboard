'use client'

import * as React from 'react'
import { Download, Receipt, CreditCard, CheckCircle2, Clock } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { PageHeader, StatCard, Tabs } from '@/components/shared/page-components'
import { billingPlansData, invoicesData } from '@/lib/erp-data'
import { formatCurrency } from '@/lib/format'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'

type Invoice = (typeof invoicesData)[0]

export default function BillingPage() {
  const { toast } = useToast()
  const [invoices, setInvoices] = React.useState(invoicesData)
  const [tab, setTab] = React.useState('invoices')
  const plan = billingPlansData[0]

  const columns: ColumnDef<Invoice>[] = [
    { accessorKey: 'invoiceNo', header: 'Invoice', cell: ({ row }) => <span className="font-mono">{row.original.invoiceNo}</span> },
    { accessorKey: 'plan', header: 'Plan', cell: ({ row }) => <Badge variant="secondary">{row.original.plan}</Badge> },
    { accessorKey: 'amount', header: 'Amount', cell: ({ row }) => formatCurrency(row.original.amount) },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'Download PDF', onClick: () => toast({ title: 'Invoice downloaded', description: row.original.invoiceNo }) },
      ...(row.original.status === 'pending' ? [{ label: 'Mark Paid', onClick: () => { setInvoices(invoices.map((i) => i.id === row.original.id ? { ...i, status: 'paid' as const } : i)); toast({ title: 'Payment recorded' }) } }] : []),
    ]} /> },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Billing & Subscription" description="Manage your EduSync subscription and invoices." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Billing' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(invoices, 'invoices')}><Download className="h-4 w-4" />Export</Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Current Plan" value={plan.planName} icon={CreditCard} />
          <StatCard title="Monthly Cost" value={formatCurrency(plan.monthlyAmount)} icon={Receipt} />
          <StatCard title="Pending Invoices" value={invoices.filter((i) => i.status === 'pending').length} icon={Clock} changeType="neutral" />
        </div>

        <Tabs tabs={[{ id: 'invoices', label: 'Invoices' }, { id: 'plan', label: 'Plan Details' }]} activeTab={tab} onChange={setTab} />

        {tab === 'invoices' && <DataTable columns={columns} data={invoices} searchKey="invoiceNo" />}

        {tab === 'plan' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{plan.planName} Plan</CardTitle>
              <CardDescription>Renews on {plan.renewalDate} · {plan.schools} schools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-2xl font-bold">{formatCurrency(plan.monthlyAmount)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-green-500" />{f}</li>
                ))}
              </ul>
              <Button>Upgrade Plan</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
