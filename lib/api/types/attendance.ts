export type AttendanceRecordDto = {
  id: string
  entityType: string
  entityId: string
  name: string
  class: string
  date: string
  status: string
  checkIn: string | null
  checkOut: string | null
  remarks: string | null
}

export type MarkAttendanceRequest = {
  studentId: string
  date: string
  status: string
}
