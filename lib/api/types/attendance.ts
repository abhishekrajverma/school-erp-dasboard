/** TODO: align with ASP.NET Core Attendance DTOs */

export type AttendanceRecordDto = {
  id: string
}

export type MarkAttendanceRequest = {
  studentId: string
  date: string
  status: string
}
