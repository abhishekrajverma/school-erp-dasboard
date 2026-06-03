'use client'

import * as React from 'react'
import {
  Bus,
  Clock,
  MapPin,
  Navigation,
  Phone,
  Shield,
  User,
  AlertTriangle,
  Route,
  CreditCard,
  Calendar,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatusBadge } from '@/components/shared/data-table'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  getChildTransportDetails,
  getLiveTransportStatus,
  type RouteStop,
} from '@/lib/parent-transport'

function TransportNotEnrolled({ studentName }: { studentName: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Bus className="h-7 w-7 text-muted-foreground" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="font-semibold">No transport assigned</h3>
          <p className="text-sm text-muted-foreground">
            {studentName} is not registered on a school bus route. Contact the transport office to
            opt in for the upcoming term.
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href="tel:+912245678900">Call transport office</a>
        </Button>
      </CardContent>
    </Card>
  )
}

function StopTimeline({
  stops,
  pickupOrder,
}: {
  stops: RouteStop[]
  pickupOrder: number
}) {
  return (
    <div className="space-y-0">
      {stops.map((stop, index) => {
        const isPickup = stop.order === pickupOrder
        const isSchool = stop.order === 1
        const isLast = index === stops.length - 1

        return (
          <div key={stop.order} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold',
                  isPickup && 'border-primary bg-primary text-primary-foreground',
                  isSchool && !isPickup && 'border-chart-2 bg-chart-2/15 text-chart-2',
                  !isPickup && !isSchool && 'border-border bg-muted text-muted-foreground',
                )}
              >
                {stop.order}
              </div>
              {!isLast && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[24px] my-0.5',
                    isPickup ? 'bg-primary/40' : 'bg-border',
                  )}
                />
              )}
            </div>
            <div className={cn('pb-5 flex-1 min-w-0', isLast && 'pb-0')}>
              <div className="flex flex-wrap items-center gap-2">
                <p className={cn('font-medium text-sm', isPickup && 'text-primary')}>
                  {stop.name}
                </p>
                {isPickup && (
                  <Badge className="text-[10px] h-5">Your pickup / drop</Badge>
                )}
                {isSchool && (
                  <Badge variant="outline" className="text-[10px] h-5">
                    School
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stop.landmark}</p>
              <div className="mt-1.5 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  AM {stop.morningPickup}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  PM {stop.eveningDrop}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ParentTransportPanel({
  studentId,
  studentName,
}: {
  studentId: string
  studentName: string
}) {
  const details = React.useMemo(() => getChildTransportDetails(studentId), [studentId])

  if (!details) {
    return <TransportNotEnrolled studentName={studentName} />
  }

  const { route, vehicle, enrollment, stops, pickupStop } = details
  const live = getLiveTransportStatus(vehicle)
  const occupancy = Math.round((vehicle.currentStudents / vehicle.capacity) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Transport — {studentName}</h3>
        <p className="text-sm text-muted-foreground">
          Route, bus, driver, and pickup details for your child only
        </p>
      </div>

      {route.status === 'inactive' && (
        <Card className="border-amber-500/40 bg-amber-500/10">
          <CardContent className="flex items-start gap-3 pt-5">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div className="text-sm">
              <p className="font-medium text-amber-900 dark:text-amber-200">
                Route temporarily inactive
              </p>
              <p className="text-muted-foreground mt-1">
                This route may use alternate arrangements. Contact the transport office for updates.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden border-primary/20">
        <div className="bg-linear-to-r from-primary/20 via-primary/10 to-transparent px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                <Bus className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Assigned route
                </p>
                <p className="text-lg font-bold">{route.routeName}</p>
                <p className="text-sm text-muted-foreground">
                  {route.startPoint} → {route.endPoint} · {route.distance}
                </p>
              </div>
            </div>
            <StatusBadge status={enrollment.status} />
          </div>
        </div>
        <CardContent className="grid gap-4 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-[10px] uppercase text-muted-foreground">Morning pickup</p>
            <p className="text-lg font-semibold tabular-nums">{pickupStop.morningPickup}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-[10px] uppercase text-muted-foreground">Evening drop</p>
            <p className="text-lg font-semibold tabular-nums">{pickupStop.eveningDrop}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-[10px] uppercase text-muted-foreground">Your stop</p>
            <p className="text-sm font-semibold">{pickupStop.name}</p>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-[10px] uppercase text-muted-foreground">Seat</p>
            <p className="text-lg font-semibold">{enrollment.seatNumber ?? '—'}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bus className="h-4 w-4" />
              Bus & driver
            </CardTitle>
            <CardDescription>Vehicle assigned to this route</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <p className="font-mono text-lg font-bold">{vehicle.vehicleNumber}</p>
                <p className="text-sm text-muted-foreground capitalize">{vehicle.vehicleType}</p>
              </div>
              <StatusBadge status={vehicle.status} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bus occupancy</span>
                <span className="font-medium tabular-nums">
                  {vehicle.currentStudents}/{vehicle.capacity}
                </span>
              </div>
              <Progress value={occupancy} className="h-2" />
            </div>

            <div className="rounded-lg bg-muted/40 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{vehicle.driverName}</p>
                  <p className="text-xs text-muted-foreground">Licensed driver</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                <a href={`tel:${vehicle.driverPhone.replace(/\s/g, '')}`}>
                  <Phone className="h-4 w-4" />
                  {vehicle.driverPhone}
                </a>
              </Button>
              <p className="text-xs text-muted-foreground">
                License: <span className="font-mono">{vehicle.driverLicense}</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-md border border-border p-2">
                <p className="text-muted-foreground">Insurance valid till</p>
                <p className="font-medium">{formatDate(vehicle.insuranceExpiry)}</p>
              </div>
              <div className="rounded-md border border-border p-2">
                <p className="text-muted-foreground">Fitness valid till</p>
                <p className="font-medium">{formatDate(vehicle.fitnessExpiry)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Live tracking
            </CardTitle>
            <CardDescription>GPS status · Updated {live.lastUpdated}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={cn(
                'rounded-xl border p-4',
                vehicle.gpsStatus === 'online'
                  ? 'border-success/30 bg-success/5'
                  : 'border-border bg-muted/30',
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{live.label}</p>
                <StatusBadge status={vehicle.gpsStatus} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Last known: {vehicle.lastLocation}
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Route schedule</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Morning {route.morningTime}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Evening {route.eveningTime}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
              <Shield className="mb-1 inline h-3.5 w-3.5 mr-1" />
              For emergencies, call the driver or school transport desk. Do not board unofficial
              vehicles.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Route className="h-4 w-4" />
              Route info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total stops</span>
              <span className="font-medium">{route.totalStops}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Students on route</span>
              <span className="font-medium">{route.totalStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shift</span>
              <span className="font-medium capitalize">{enrollment.shift}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Transport fee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="text-2xl font-bold">{formatCurrency(route.fare)}</p>
            <p className="text-muted-foreground">Annual transport fee for this route</p>
            <p className="text-xs text-muted-foreground">Pay under Fees tab if invoice is due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Enrollment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Since</span>
              <span className="font-medium">{formatDate(enrollment.enrolledSince)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Student</span>
              <span className="font-medium">{studentName}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Route map & stops
          </CardTitle>
          <CardDescription>
            All stops on {route.routeName} — your child boards at stop #{pickupStop.order}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StopTimeline stops={stops} pickupOrder={enrollment.pickupStopOrder} />
        </CardContent>
      </Card>
    </div>
  )
}
