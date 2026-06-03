import {
  attendanceRecordsData,
  bookIssuesData,
  examsData,
  feeRecordsData,
  studentsData,
  timetableData,
} from './erp-data'
import { schoolNotices } from './data'

export function getStudentById(id: string) {
  return studentsData.find((s) => s.id === id)
}

export function getStudentFees(studentId: string) {
  return feeRecordsData.filter((f) => f.studentId === studentId)
}

export function getStudentAttendance(studentId: string) {
  return attendanceRecordsData.filter(
    (r) => r.entityType === 'student' && r.entityId === studentId,
  )
}

export function getStudentBookIssues(studentId: string) {
  const student = getStudentById(studentId)
  if (!student) return []
  return bookIssuesData.filter(
    (b) => b.memberType === 'student' && b.memberName === student.name,
  )
}

export function getStudentExams(studentClass: string) {
  return examsData.filter((e) => e.class === studentClass)
}

export function getStudentTimetable(studentClass: string) {
  const entry = timetableData.find((t) => t.class === studentClass)
  return entry?.periods ?? timetableData[0]?.periods ?? []
}

export function getStudentNotices() {
  return schoolNotices
}
