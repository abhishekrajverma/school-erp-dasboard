import { teachersData, leaveRequestsData, payrollRecordsData, timetableData, bookIssuesData } from './erp-data'
import { todaysClasses, teacherAttendance, schoolNotices } from './data'

/** Demo: logged-in teacher (switchable on portal UI) */
export const DEFAULT_TEACHER_ID = '2'

export type LeaveBalance = {
  casual: { total: number; used: number }
  sick: { total: number; used: number }
  earned: { total: number; used: number }
}

export const teacherLeaveBalances: Record<string, LeaveBalance> = {
  '1': { casual: { total: 12, used: 4 }, sick: { total: 10, used: 2 }, earned: { total: 15, used: 6 } },
  '2': { casual: { total: 12, used: 2 }, sick: { total: 10, used: 1 }, earned: { total: 15, used: 3 } },
  '3': { casual: { total: 12, used: 5 }, sick: { total: 10, used: 0 }, earned: { total: 15, used: 8 } },
  '4': { casual: { total: 12, used: 8 }, sick: { total: 10, used: 6 }, earned: { total: 15, used: 2 } },
  '5': { casual: { total: 12, used: 3 }, sick: { total: 10, used: 1 }, earned: { total: 15, used: 5 } },
  '6': { casual: { total: 12, used: 1 }, sick: { total: 10, used: 0 }, earned: { total: 15, used: 4 } },
  '7': { casual: { total: 12, used: 2 }, sick: { total: 10, used: 1 }, earned: { total: 15, used: 7 } },
  '8': { casual: { total: 12, used: 0 }, sick: { total: 10, used: 0 }, earned: { total: 15, used: 2 } },
}

export type TeacherAttendanceLog = {
  date: string
  checkIn: string | null
  checkOut: string | null
  status: 'present' | 'late' | 'absent' | 'on-leave'
}

export const teacherAttendanceLogs: Record<string, TeacherAttendanceLog[]> = {
  '2': [
    { date: '2024-06-28', checkIn: '08:18 AM', checkOut: '03:45 PM', status: 'present' },
    { date: '2024-06-27', checkIn: '08:22 AM', checkOut: '03:40 PM', status: 'present' },
    { date: '2024-06-26', checkIn: '08:55 AM', checkOut: '03:50 PM', status: 'late' },
    { date: '2024-06-25', checkIn: '08:15 AM', checkOut: '03:42 PM', status: 'present' },
    { date: '2024-06-24', checkIn: null, checkOut: null, status: 'on-leave' },
  ],
}

export type TeacherDutyRequest = {
  id: string
  teacherId: string
  type: 'substitution' | 'exam_invigilation' | 'certificate' | 'resource'
  title: string
  details: string
  status: 'pending' | 'approved' | 'rejected'
  submittedOn: string
}

export const teacherDutyRequestsData: TeacherDutyRequest[] = [
  {
    id: '1',
    teacherId: '2',
    type: 'substitution',
    title: 'Substitution for 10-A Mathematics',
    details: 'Request cover for 24 June — personal appointment',
    status: 'approved',
    submittedOn: '2024-06-20',
  },
  {
    id: '2',
    teacherId: '2',
    type: 'certificate',
    title: 'Experience certificate',
    details: 'Required for home loan application',
    status: 'pending',
    submittedOn: '2024-06-26',
  },
]

export function getTeacherById(id: string) {
  return teachersData.find((t) => t.id === id)
}

export function getTeacherLeaves(teacherId: string) {
  return leaveRequestsData.filter((r) => r.employeeId === teacherId)
}

export function getTeacherPayroll(teacherId: string) {
  return payrollRecordsData.filter((p) => p.employeeId === teacherId)
}

export function getTeacherTodaysClasses(teacherName: string) {
  return todaysClasses.filter((c) => c.teacher === teacherName)
}

export function getTeacherTimetable(teacherName: string) {
  const entry = timetableData[0]
  if (!entry) return []
  return entry.periods.filter((p) => p.teacher === teacherName)
}

export function getTeacherBookIssues(teacherId: string) {
  const teacher = getTeacherById(teacherId)
  if (!teacher) return []
  return bookIssuesData.filter(
    (b) => b.memberType === 'teacher' && b.memberName === teacher.name,
  )
}

export function getTeacherTodayAttendance(teacherId: string) {
  return teacherAttendance.find((t) => t.id === teacherId)
}

export function getStaffNotices() {
  return schoolNotices
}

export function getLeaveBalance(teacherId: string): LeaveBalance {
  return (
    teacherLeaveBalances[teacherId] ?? {
      casual: { total: 12, used: 0 },
      sick: { total: 10, used: 0 },
      earned: { total: 15, used: 0 },
    }
  )
}

const PROFILE_PHOTOS_STORAGE_KEY = 'edusync-teacher-profile-photos-v1'

export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024 // 5 MB
export const PROFILE_PHOTO_ACCEPT = 'image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png'

export function loadTeacherProfilePhotos(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PROFILE_PHOTOS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {}
  } catch {
    return {}
  }
}

export function saveTeacherProfilePhoto(teacherId: string, dataUrl: string) {
  const photos = loadTeacherProfilePhotos()
  photos[teacherId] = dataUrl
  localStorage.setItem(PROFILE_PHOTOS_STORAGE_KEY, JSON.stringify(photos))
}

export function removeTeacherProfilePhoto(teacherId: string) {
  const photos = loadTeacherProfilePhotos()
  delete photos[teacherId]
  localStorage.setItem(PROFILE_PHOTOS_STORAGE_KEY, JSON.stringify(photos))
}

export function getTeacherProfilePhotoUrl(
  teacherId: string,
  photos: Record<string, string>,
  fallbackAvatar: string,
) {
  return photos[teacherId] ?? fallbackAvatar
}
