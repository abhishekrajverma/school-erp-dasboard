import {
  currentSchool,
  dashboardStats,
  recentAdmissions,
  recentFeePayments,
  schoolNotices,
  teacherAttendance,
  upcomingExams,
} from './data'
import {
  examsData,
  leaveRequestsData,
  schoolSettings,
  studentsData,
  teachersData,
} from './erp-data'

export const PRINCIPAL_AVATAR =
  'https://api.dicebear.com/7.x/avataaars/svg?seed=principal-meera'

export function getPrincipalProfile() {
  return {
    id: 'principal',
    name: schoolSettings.principalName,
    email: 'principal@school.edu',
    title: 'Principal',
    schoolName: schoolSettings.schoolName,
    academicYear: schoolSettings.academicYear,
    avatar: PRINCIPAL_AVATAR,
  }
}

export function getPrincipalSchoolStats() {
  const pendingLeaves = leaveRequestsData.filter((r) => r.status === 'pending').length
  const activeStudents = studentsData.filter((s) => s.status === 'active').length
  const activeTeachers = teachersData.filter((t) => t.status === 'active').length
  const scheduledExams = examsData.filter((e) => e.status === 'scheduled').length

  return {
    ...dashboardStats,
    activeStudents,
    activeTeachers,
    pendingLeaves,
    scheduledExams,
    schoolName: currentSchool.name,
    plan: currentSchool.plan,
  }
}

export function getPrincipalPendingLeaves() {
  return leaveRequestsData.filter((r) => r.status === 'pending')
}

export function getPrincipalStaffToday() {
  return teacherAttendance
}

export function getPrincipalNotices() {
  return schoolNotices
}

export function getPrincipalUpcomingExams() {
  return upcomingExams
}

export function getPrincipalRecentAdmissions() {
  return recentAdmissions
}

export function getPrincipalRecentFeePayments() {
  return recentFeePayments
}
