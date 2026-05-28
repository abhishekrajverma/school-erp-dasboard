'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Download, Bus, MapPin, Users, Navigation, Wrench, Phone } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, StatusBadge, ActionMenu } from '@/components/shared/data-table'
import { SlideOver } from '@/components/shared/slide-over'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PageHeader, StatCard, Tabs, FormSection, FormField } from '@/components/shared/page-components'
import { vehiclesData, routesData } from '@/lib/erp-data'
import { vehicleSchema, type VehicleFormData } from '@/lib/schemas'
import { formatCurrency } from '@/lib/format'
import { exportToCsv } from '@/lib/export'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

type Vehicle = (typeof vehiclesData)[0]

export default function TransportPage() {
  const { toast } = useToast()
  const [vehicles, setVehicles] = React.useState(vehiclesData)
  const [routes] = React.useState(routesData)
  const [activeTab, setActiveTab] = React.useState('fleet')
  const [showAdd, setShowAdd] = React.useState(false)
  const [showEdit, setShowEdit] = React.useState(false)
  const [showDelete, setShowDelete] = React.useState(false)
  const [selected, setSelected] = React.useState<Vehicle | null>(null)

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: { vehicleNumber: '', vehicleType: 'bus', capacity: 50, driverName: '', driverPhone: '', driverLicense: '', routeName: '', insuranceExpiry: '', fitnessExpiry: '', status: 'active' },
  })

  const activeBuses = vehicles.filter((v) => v.status === 'active').length
  const totalStudents = vehicles.reduce((a, v) => a + v.currentStudents, 0)

  const handleAdd = (data: VehicleFormData) => {
    setVehicles([...vehicles, {
      id: String(vehicles.length + 1),
      vehicleNumber: data.vehicleNumber,
      vehicleType: data.vehicleType,
      capacity: data.capacity,
      driverName: data.driverName,
      driverPhone: data.driverPhone,
      driverLicense: data.driverLicense,
      routeId: String(vehicles.length + 1),
      routeName: data.routeName,
      insuranceExpiry: data.insuranceExpiry,
      fitnessExpiry: data.fitnessExpiry,
      currentStudents: 0,
      status: data.status,
      gpsStatus: 'online',
      lastLocation: 'School Campus',
    }])
    setShowAdd(false)
    form.reset()
    toast({ title: 'Vehicle added' })
  }

  const handleEdit = (data: VehicleFormData) => {
    if (!selected) return
    setVehicles(vehicles.map((v) => v.id === selected.id ? { ...v, ...data } : v))
    setShowEdit(false)
    setSelected(null)
    toast({ title: 'Vehicle updated' })
  }

  const handleDelete = () => {
    if (!selected) return
    setVehicles(vehicles.filter((v) => v.id !== selected.id))
    setShowDelete(false)
    setSelected(null)
    toast({ title: 'Vehicle removed', variant: 'destructive' })
  }

  const columns: ColumnDef<Vehicle>[] = [
    { accessorKey: 'vehicleNumber', header: 'Vehicle', cell: ({ row }) => <div><p className="font-mono font-medium">{row.original.vehicleNumber}</p><p className="text-xs text-muted-foreground capitalize">{row.original.vehicleType}</p></div> },
    { accessorKey: 'routeName', header: 'Route' },
    { accessorKey: 'driverName', header: 'Driver', cell: ({ row }) => <div><p className="text-sm">{row.original.driverName}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{row.original.driverPhone}</p></div> },
    { accessorKey: 'currentStudents', header: 'Occupancy', cell: ({ row }) => <div className="w-24"><Progress value={(row.original.currentStudents / row.original.capacity) * 100} className="h-2" /><p className="text-xs mt-1">{row.original.currentStudents}/{row.original.capacity}</p></div> },
    { accessorKey: 'gpsStatus', header: 'GPS', cell: ({ row }) => <StatusBadge status={row.original.gpsStatus} /> },
    { accessorKey: 'status', header: 'Status', cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { id: 'actions', cell: ({ row }) => <ActionMenu actions={[
      { label: 'Track GPS', onClick: () => toast({ title: 'GPS Tracking', description: row.original.lastLocation }) },
      { label: 'Edit', onClick: () => { setSelected(row.original); form.reset({ vehicleNumber: row.original.vehicleNumber, vehicleType: row.original.vehicleType as VehicleFormData['vehicleType'], capacity: row.original.capacity, driverName: row.original.driverName, driverPhone: row.original.driverPhone, driverLicense: row.original.driverLicense, routeName: row.original.routeName, insuranceExpiry: row.original.insuranceExpiry, fitnessExpiry: row.original.fitnessExpiry, status: row.original.status as VehicleFormData['status'] }); setShowEdit(true) } },
      { label: 'Delete', onClick: () => { setSelected(row.original); setShowDelete(true) }, destructive: true },
    ]} /> },
  ]

  const VehicleForm = () => (
    <div className="space-y-6">
      <FormSection title="Vehicle Details">
        <FormField label="Vehicle Number" required><Input {...form.register('vehicleNumber')} /></FormField>
        <FormField label="Type"><Select value={form.watch('vehicleType')} onValueChange={(v) => form.setValue('vehicleType', v as VehicleFormData['vehicleType'])}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="bus">Bus</SelectItem><SelectItem value="van">Van</SelectItem><SelectItem value="car">Car</SelectItem></SelectContent></Select></FormField>
        <FormField label="Capacity"><Input type="number" {...form.register('capacity', { valueAsNumber: true })} /></FormField>
        <FormField label="Route"><Input {...form.register('routeName')} /></FormField>
      </FormSection>
      <FormSection title="Driver">
        <FormField label="Driver Name"><Input {...form.register('driverName')} /></FormField>
        <FormField label="Phone"><Input {...form.register('driverPhone')} /></FormField>
        <FormField label="License"><Input {...form.register('driverLicense')} /></FormField>
      </FormSection>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Transport Management" description="Bus fleet, routes, drivers, GPS tracking, and transport fees." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Transport' }]}>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => exportToCsv(vehicles, 'vehicles')}><Download className="h-4 w-4" />Export</Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAdd(true)}><Plus className="h-4 w-4" />Add Vehicle</Button>
        </PageHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Active Vehicles" value={activeBuses} change={`${vehicles.length} total fleet`} icon={Bus} />
          <StatCard title="Students on Transport" value={totalStudents} icon={Users} />
          <StatCard title="Active Routes" value={routes.filter((r) => r.status === 'active').length} icon={MapPin} />
          <StatCard title="In Maintenance" value={vehicles.filter((v) => v.status === 'maintenance').length} changeType="negative" icon={Wrench} />
        </motion.div>

        <Tabs tabs={[{ id: 'fleet', label: 'Fleet' }, { id: 'routes', label: 'Routes' }, { id: 'tracking', label: 'GPS Tracking' }]} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'fleet' && <DataTable columns={columns} data={vehicles} searchKey="vehicleNumber" searchPlaceholder="Search vehicles..." showRowSelection />}

        {activeTab === 'routes' && (
          <div className="grid gap-4 sm:grid-cols-2">
            {routes.map((route, i) => (
              <motion.div key={route.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div><CardTitle className="text-base">{route.routeName}</CardTitle><CardDescription>{route.startPoint} → {route.endPoint}</CardDescription></div>
                      <StatusBadge status={route.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Vehicle</span><span className="font-mono">{route.vehicleNumber}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Driver</span><span>{route.driverName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Students</span><span>{route.totalStudents} · {route.totalStops} stops</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Fare</span><span>{formatCurrency(route.fare)}/yr</span></div>
                    <div className="flex gap-2 text-xs"><Badge variant="outline">{route.morningTime}</Badge><Badge variant="outline">{route.eveningTime}</Badge></div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'tracking' && (
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Navigation className="h-4 w-4" />Live GPS Dashboard</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {vehicles.filter((v) => v.status === 'active').map((v) => (
                <div key={v.id} className={cn('flex items-center justify-between rounded-lg border border-border p-4', v.gpsStatus === 'online' && 'border-green-500/20')}>
                  <div><p className="font-medium">{v.vehicleNumber}</p><p className="text-sm text-muted-foreground">{v.routeName}</p></div>
                  <div className="text-right"><p className="text-sm">{v.lastLocation}</p><StatusBadge status={v.gpsStatus} /></div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      <SlideOver open={showAdd} onClose={() => { setShowAdd(false); form.reset() }} title="Add Vehicle" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleAdd)}>Add</Button></div>}><VehicleForm /></SlideOver>
      <SlideOver open={showEdit} onClose={() => { setShowEdit(false); setSelected(null) }} title="Edit Vehicle" size="lg" footer={<div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowEdit(false)}>Cancel</Button><Button onClick={form.handleSubmit(handleEdit)}>Save</Button></div>}><VehicleForm /></SlideOver>
      <ConfirmDialog open={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Delete Vehicle" description="Remove this vehicle from the fleet?" confirmText="Delete" variant="destructive" />
    </DashboardLayout>
  )
}
