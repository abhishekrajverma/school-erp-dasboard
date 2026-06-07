'use client'

import * as React from 'react'
import { Plus, Download, Package, AlertTriangle, CheckCircle2 } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, Tabs, FormSection, FormField } from '@/components/shared/page-components'
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import type { InventoryItemDto } from '@/lib/api/types/resources'
import { useInventory } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'
import { exportToCsv } from '@/lib/export'
import { toast } from 'sonner'

type Item = InventoryItemDto

export default function InventoryPage() {
  const { data, isLoading, isError, error, refetch } = useInventory({ page: 1, pageSize: 100 })
  const items = data?.items ?? []

  const [tab, setTab] = React.useState('all')
  const [showForm, setShowForm] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<Item | null>(null)
  const [form, setForm] = React.useState({ name: '', category: '', sku: '', quantity: 0, minStock: 10, unit: 'pcs', location: '' })

  const filtered = items.filter((i) => tab === 'all' || i.status === tab)

  const columns: ColumnDef<Item>[] = [
    { accessorKey: 'name', header: 'Item', cell: ({ row }) => <div><p className="font-medium">{row.original.name}</p><p className="text-xs text-muted-foreground font-mono">{row.original.sku}</p></div> },
    { accessorKey: 'category', header: 'Category', cell: ({ row }) => <Badge variant="secondary">{row.original.category}</Badge> },
    { accessorKey: 'quantity', header: 'Stock', cell: ({ row }) => <span className={row.original.quantity <= row.original.minStock ? 'text-destructive font-medium' : ''}>{row.original.quantity} {row.original.unit}</span> },
    { accessorKey: 'location', header: 'Location', cell: ({ row }) => row.original.location ?? '—' },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status === 'in-stock' ? 'active' : 'pending'} /> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'Restock', onClick: () => toast.info('Inventory update API is not available on the backend yet') },
      { label: 'Edit', onClick: () => { setSelected(row.original); setForm({ name: row.original.name, category: row.original.category, sku: row.original.sku, quantity: row.original.quantity, minStock: row.original.minStock, unit: row.original.unit, location: row.original.location ?? '' }); setShowForm(true) } },
      { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
    ]} /> },
  ]

  const handleSave = () => {
    toast.info('Inventory write API is not available on the backend yet')
    setShowForm(false)
  }

  if (isLoading) return <ApiPageLoading rows={3} />
  if (isError) {
    return (
      <ApiPageError error={error} resourceName="inventory" onRetry={() => refetch()} />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Inventory" description="School supplies, equipment, and stock management." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Inventory' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(items, 'inventory')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => { setSelected(null); setShowForm(true) }}><Plus className="h-4 w-4" />Add Item</Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Items" value={items.length} icon={Package} />
          <StatCard title="In Stock" value={items.filter((i) => i.status === 'in-stock').length} icon={CheckCircle2} changeType="positive" />
          <StatCard title="Low Stock" value={items.filter((i) => i.status === 'low-stock').length} icon={AlertTriangle} changeType="negative" />
        </div>

        <Tabs tabs={[{ id: 'all', label: 'All', count: items.length }, { id: 'in-stock', label: 'In Stock' }, { id: 'low-stock', label: 'Low Stock', count: items.filter((i) => i.status === 'low-stock').length }]} activeTab={tab} onChange={setTab} />

        <DataTable columns={columns} data={filtered} searchKey="name" showRowSelection />
      </div>

      <SlideOver open={showForm} onClose={() => setShowForm(false)} title={selected ? 'Edit Item' : 'Add Item'} footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></div>}>
        <FormSection title="Item">
          <FormField label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="SKU"><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} /></FormField>
          <FormField label="Category"><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></FormField>
          <FormField label="Quantity"><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: +e.target.value })} /></FormField>
          <FormField label="Location"><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
        </FormSection>
      </SlideOver>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={() => { setShowDelete(false); toast.info('Inventory delete API is not available on the backend yet') }} title="Delete Item" description="Remove from inventory?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
