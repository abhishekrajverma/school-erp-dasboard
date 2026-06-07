export { queryKeys } from './query-keys'
export { useAuth, useLogin, useCurrentUser } from './use-auth'
export { useStudents, useStudent, useCreateStudent, useUpdateStudent, useDeleteStudent } from './use-students'
export { useTeachers, useTeacher, useCreateTeacher, useUpdateTeacher } from './use-teachers'
export { useDashboard } from './use-dashboard'
export { useFees } from './use-fees'
export { useAttendance } from './use-attendance'
export {
  useParents,
  useCreateParent,
  useUpdateParent,
  useDeleteParent,
  useAttendanceRecords,
  useExams,
  useNotifications,
  useLeaveRequests,
  usePayroll,
  useTimetable,
  useHostelRooms,
  useInventory,
  useClasses,
  useSubjects,
  useTransportRoutes,
  useTransportVehicles,
  useLibraryBooks,
  useLibraryIssues,
  useAdmissions,
  useCreateAdmission,
  useUpdateAdmission,
  useSubmitAdmission,
} from './use-resources'
export {
  useParentProfile,
  useParentChildren,
  useParentChildFees,
  useParentChildAttendance,
  useParentChildTransport,
  useRecordFeePayment,
} from './use-parent-portal'
export {
  useTeacherProfile,
  useTeacherPortalLeaves,
  useTeacherPortalPayroll,
  useTeacherPortalTimetable,
  useApplyTeacherLeave,
} from './use-teacher-portal'
export {
  useStudentProfile,
  useStudentPortalFees,
  useStudentPortalAttendance,
  useStudentPortalExams,
  useStudentPortalTimetable,
  useStudentPortalLibraryIssues,
} from './use-student-portal'
