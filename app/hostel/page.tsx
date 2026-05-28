'use client'

import * as React from 'react'
import { Plus, Download, Building, BedDouble, Users } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, FormSection, FormField } from '@/components/shared/page-components'
import { hostelRoomsData } from '@/lib/erp-data'
import { formatCurrency } from '@/lib/format'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'

type Room = (typeof hostelRoomsData)[0]

export default function HostelPage() {
  const { toast } = useToast()
  const [rooms, setRooms] = React.useState(hostelRoomsData)
  const [showForm, setShowForm] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<Room | null>(null)
  const [form, setForm] = React.useState({ roomNo: '', block: '', capacity: 4, floor: 1, warden: '', monthlyFee: 12000 })

  const columns: ColumnDef<Room>[] = [
    { accessorKey: 'roomNo', header: 'Room', cell: ({ row }) => <span className="font-mono font-medium">{row.original.roomNo}</span> },
    { accessorKey: 'block', header: 'Block' },
    { accessorKey: 'floor', header: 'Floor' },
    { accessorKey: 'occupied', header: 'Occupancy', cell: ({ row }) => <span>{row.original.occupied}/{row.original.capacity}</span> },
    { accessorKey: 'warden', header: 'Warden' },
    { accessorKey: 'monthlyFee', header: 'Fee/mo', cell: ({ row }) => formatCurrency(row.original.monthlyFee) },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status === 'full' ? 'inactive' : 'active'} /> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'Edit', onClick: () => { setSelected(row.original); setForm({ roomNo: row.original.roomNo, block: row.original.block, capacity: row.original.capacity, floor: row.original.floor, warden: row.original.warden, monthlyFee: row.original.monthlyFee }); setShowForm(true) } },
      { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
    ]} /> },
  ]

  const handleSave = () => {
    const record = { id: selected?.id ?? String(rooms.length + 1), ...form, occupied: selected?.occupied ?? 0, status: (form.capacity === (selected?.occupied ?? 0) ? 'full' : 'available') as 'full' | 'available' }
    if (selected) setRooms(rooms.map((r) => r.id === selected.id ? record : r))
    else setRooms([...rooms, record])
    setShowForm(false)
    toast({ title: 'Room saved' })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Hostel Management" description="Room allocation, occupancy, and hostel fees." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Hostel' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(rooms, 'hostel')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => { setSelected(null); setShowForm(true) }}><Plus className="h-4 w-4" />Add Room</Button>
        </PageHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Total Rooms" value={rooms.length} icon={Building} />
          <StatCard title="Total Beds" value={rooms.reduce((a, r) => a + r.capacity, 0)} icon={BedDouble} />
          <StatCard title="Occupied" value={rooms.reduce((a, r) => a + r.occupied, 0)} icon={Users} />
        </div>

        <DataTable columns={columns} data={rooms} searchKey="roomNo" showRowSelection />
      </div>

      <SlideOver open={showForm} onClose={() => setShowForm(false)} title={selected ? 'Edit Room' : 'Add Room'} footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button><Button onClick={handleSave}>Save</Button></div>}>
        <FormSection title="Room">
          <FormField label="Room No"><Input value={form.roomNo} onChange={(e) => setForm({ ...form, roomNo: e.target.value })} /></FormField>
          <FormField label="Block"><Input value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} /></FormField>
          <FormField label="Capacity"><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: +e.target.value })} /></FormField>
          <FormField label="Warden"><Input value={form.warden} onChange={(e) => setForm({ ...form, warden: e.target.value })} /></FormField>
        </FormSection>
      </SlideOver>

      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={() => { if (selected) { setRooms(rooms.filter((r) => r.id !== selected.id)); setShowDelete(false) } }} title="Delete Room" description="Remove this room?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
