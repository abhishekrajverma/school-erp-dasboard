import { routesData, vehiclesData } from './erp-data'

export type RouteStop = {
  order: number
  name: string
  landmark: string
  morningPickup: string
  eveningDrop: string
}

export type StudentTransportEnrollment = {
  studentId: string
  routeId: string
  pickupStopOrder: number
  shift: 'morning' | 'evening' | 'both'
  enrolledSince: string
  status: 'active' | 'suspended' | 'pending'
  seatNumber: string | null
}

/** Which students use school transport (others see opt-out state) */
export const studentTransportEnrollments: StudentTransportEnrollment[] = [
  {
    studentId: '1',
    routeId: '1',
    pickupStopOrder: 5,
    shift: 'both',
    enrolledSince: '2023-06-01',
    status: 'active',
    seatNumber: 'A-12',
  },
  {
    studentId: '2',
    routeId: '2',
    pickupStopOrder: 3,
    shift: 'both',
    enrolledSince: '2023-06-01',
    status: 'active',
    seatNumber: 'B-08',
  },
  {
    studentId: '4',
    routeId: '3',
    pickupStopOrder: 7,
    shift: 'morning',
    enrolledSince: '2024-01-15',
    status: 'active',
    seatNumber: 'C-22',
  },
  {
    studentId: '7',
    routeId: '2',
    pickupStopOrder: 4,
    shift: 'both',
    enrolledSince: '2023-08-10',
    status: 'active',
    seatNumber: 'B-15',
  },
  {
    studentId: '8',
    routeId: '4',
    pickupStopOrder: 2,
    shift: 'both',
    enrolledSince: '2023-06-01',
    status: 'active',
    seatNumber: 'D-03',
  },
]

export const routeStopsByRouteId: Record<string, RouteStop[]> = {
  '1': [
    { order: 1, name: 'School Campus', landmark: 'Main gate', morningPickup: '07:00 AM', eveningDrop: '03:30 PM' },
    { order: 2, name: 'Andheri Station', landmark: 'West exit', morningPickup: '07:08 AM', eveningDrop: '03:22 PM' },
    { order: 3, name: 'Versova Bridge', landmark: 'Signal', morningPickup: '07:15 AM', eveningDrop: '03:15 PM' },
    { order: 4, name: 'Lokhandwala', landmark: 'Market', morningPickup: '07:22 AM', eveningDrop: '03:08 PM' },
    { order: 5, name: 'Green Park', landmark: 'Society gate', morningPickup: '07:28 AM', eveningDrop: '03:02 PM' },
    { order: 6, name: 'Four Bungalows', landmark: 'Circle', morningPickup: '07:35 AM', eveningDrop: '02:55 PM' },
    { order: 7, name: 'Seven Bungalows', landmark: 'Bus stand', morningPickup: '07:42 AM', eveningDrop: '02:48 PM' },
    { order: 8, name: 'Green Park End', landmark: 'Last stop', morningPickup: '07:48 AM', eveningDrop: '02:42 PM' },
  ],
  '2': [
    { order: 1, name: 'School Campus', landmark: 'Main gate', morningPickup: '07:15 AM', eveningDrop: '03:45 PM' },
    { order: 2, name: 'Juhu Beach Road', landmark: 'Signal', morningPickup: '07:22 AM', eveningDrop: '03:38 PM' },
    { order: 3, name: 'Rose Garden', landmark: 'Block B gate', morningPickup: '07:30 AM', eveningDrop: '03:32 PM' },
    { order: 4, name: 'Vile Parle East', landmark: 'Station', morningPickup: '07:38 AM', eveningDrop: '03:25 PM' },
    { order: 5, name: 'Santacruz', landmark: 'Market', morningPickup: '07:45 AM', eveningDrop: '03:18 PM' },
    { order: 6, name: 'Rose Garden South', landmark: 'End point', morningPickup: '07:52 AM', eveningDrop: '03:12 PM' },
  ],
  '3': [
    { order: 1, name: 'School Campus', landmark: 'Main gate', morningPickup: '06:45 AM', eveningDrop: '04:00 PM' },
    { order: 2, name: 'Bandra Kurla', landmark: 'Complex', morningPickup: '06:55 AM', eveningDrop: '03:50 PM' },
    { order: 3, name: 'Khar Road', landmark: 'Signal', morningPickup: '07:05 AM', eveningDrop: '03:42 PM' },
    { order: 4, name: 'Sion Circle', landmark: 'Bridge', morningPickup: '07:15 AM', eveningDrop: '03:35 PM' },
    { order: 5, name: 'Dadar East', landmark: 'Plaza', morningPickup: '07:25 AM', eveningDrop: '03:28 PM' },
    { order: 6, name: 'Matunga', landmark: 'Labour camp', morningPickup: '07:35 AM', eveningDrop: '03:22 PM' },
    { order: 7, name: 'Hill Road', landmark: 'Bandra', morningPickup: '07:45 AM', eveningDrop: '03:15 PM' },
    { order: 8, name: 'Bandra West', landmark: 'Linking Rd', morningPickup: '07:55 AM', eveningDrop: '03:08 PM' },
    { order: 9, name: 'Pali Hill', landmark: 'Gate', morningPickup: '08:05 AM', eveningDrop: '03:02 PM' },
    { order: 10, name: 'Hill Road End', landmark: 'Last stop', morningPickup: '08:12 AM', eveningDrop: '02:55 PM' },
  ],
  '4': [
    { order: 1, name: 'School Campus', landmark: 'Main gate', morningPickup: '07:30 AM', eveningDrop: '03:15 PM' },
    { order: 2, name: 'Lake View', landmark: 'Tower 2', morningPickup: '07:38 AM', eveningDrop: '03:08 PM' },
    { order: 3, name: 'Infinity Mall', landmark: 'Entrance', morningPickup: '07:45 AM', eveningDrop: '03:02 PM' },
    { order: 4, name: 'Goregaon West', landmark: 'Metro', morningPickup: '07:52 AM', eveningDrop: '02:55 PM' },
    { order: 5, name: 'Lake View End', landmark: 'Last stop', morningPickup: '07:58 AM', eveningDrop: '02:48 PM' },
  ],
}

export type ChildTransportDetails = {
  enrolled: true
  enrollment: StudentTransportEnrollment
  route: (typeof routesData)[0]
  vehicle: (typeof vehiclesData)[0]
  stops: RouteStop[]
  pickupStop: RouteStop
  dropStop: RouteStop
}

export function getStudentTransportEnrollment(studentId: string) {
  return studentTransportEnrollments.find(
    (e) => e.studentId === studentId && e.status !== 'suspended',
  )
}

export function getChildTransportDetails(studentId: string): ChildTransportDetails | null {
  const enrollment = getStudentTransportEnrollment(studentId)
  if (!enrollment) return null

  const route = routesData.find((r) => r.id === enrollment.routeId)
  const vehicle = vehiclesData.find((v) => v.routeId === enrollment.routeId)
  const stops = routeStopsByRouteId[enrollment.routeId] ?? []

  if (!route || !vehicle) return null

  const pickupStop =
    stops.find((s) => s.order === enrollment.pickupStopOrder) ?? stops[stops.length - 1]
  const dropStop = pickupStop

  return {
    enrolled: true,
    enrollment,
    route,
    vehicle,
    stops,
    pickupStop,
    dropStop,
  }
}

export function hasTransportOptIn(studentId: string) {
  return Boolean(getStudentTransportEnrollment(studentId))
}

export type TransportTripStatus = 'scheduled' | 'in_transit' | 'arrived_school' | 'completed'

export function getLiveTransportStatus(vehicle: (typeof vehiclesData)[0]): {
  status: TransportTripStatus
  label: string
  lastUpdated: string
} {
  if (vehicle.status === 'maintenance') {
    return { status: 'scheduled', label: 'Vehicle under maintenance', lastUpdated: 'Today' }
  }
  if (vehicle.gpsStatus === 'online') {
    return {
      status: 'in_transit',
      label: `Near ${vehicle.lastLocation}`,
      lastUpdated: '2 min ago',
    }
  }
  return { status: 'scheduled', label: 'GPS offline — contact transport office', lastUpdated: '—' }
}
