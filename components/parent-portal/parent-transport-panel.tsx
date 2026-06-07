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
import { useParentChildTransport } from '@/hooks/api'
import { Loader2 } from 'lucide-react'

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
  const transportQuery = useParentChildTransport(studentId)

  if (transportQuery.isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const details = transportQuery.data

  if (!details?.route) {
    return <TransportNotEnrolled studentName={studentName} />
  }

  const { route, vehicle, pickupStop } = details

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Transport — {studentName}</h3>
        <p className="text-sm text-muted-foreground">
          Route, bus, driver, and pickup details for your child
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
                Contact the transport office for alternate arrangements.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Bus className="h-4 w-4" />
            {route.routeName}
          </CardTitle>
          <CardDescription>
            {route.startPoint} → {route.endPoint}
            {route.distance ? ` · ${route.distance}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pickupStop && (
            <>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-[10px] uppercase text-muted-foreground">Morning pickup</p>
                <p className="text-lg font-semibold tabular-nums">{pickupStop.morningPickup}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-[10px] uppercase text-muted-foreground">Your stop</p>
                <p className="text-sm font-semibold">{pickupStop.name}</p>
              </div>
            </>
          )}
          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-[10px] uppercase text-muted-foreground">Transport fee</p>
            <p className="text-lg font-semibold">{formatCurrency(route.fare)}</p>
          </div>
        </CardContent>
      </Card>

      {vehicle && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bus & driver</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="font-mono text-lg font-bold">{vehicle.vehicleNumber}</p>
            <p className="font-medium">{vehicle.driverName}</p>
            {vehicle.driverPhone && (
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href={`tel:${vehicle.driverPhone.replace(/\s/g, '')}`}>
                  <Phone className="h-4 w-4" />
                  {vehicle.driverPhone}
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
          <Shield className="mb-1 inline h-3.5 w-3.5 mr-1" />
          Morning {route.morningTime} · Evening {route.eveningTime}
        </div>
        <div className="rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
          {route.totalStops} stops · {route.totalStudents} students on route
        </div>
      </div>
    </div>
  )
}
