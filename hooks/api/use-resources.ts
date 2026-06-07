import { createCrudHooks, createListHook } from './create-list-hook'
import { queryKeys } from './query-keys'
import { parentsApi } from '@/lib/api/parents'
import { feesApi } from '@/lib/api/fees'
import { attendanceApi } from '@/lib/api/attendance'
import { examsApi } from '@/lib/api/exams'
import { notificationsApi } from '@/lib/api/notifications'
import { leaveApi } from '@/lib/api/leave'
import { payrollApi } from '@/lib/api/payroll'
import { timetableApi } from '@/lib/api/timetable'
import { hostelApi } from '@/lib/api/hostel'
import { inventoryApi } from '@/lib/api/inventory'
import { admissionsApi } from '@/lib/api/admissions'
import { academicsApi } from '@/lib/api/academics'
import { transportApi } from '@/lib/api/transport'
import { libraryApi } from '@/lib/api/library'

const parents = createCrudHooks(queryKeys.parents.all, parentsApi)
export const useParents = parents.useList
export const useCreateParent = parents.useCreate
export const useUpdateParent = parents.useUpdate
export const useDeleteParent = parents.useDelete

const fees = createCrudHooks(queryKeys.fees.all, feesApi)
export const useFees = fees.useList

const attendance = createCrudHooks(queryKeys.attendance.all, attendanceApi)
export const useAttendanceRecords = attendance.useList

const exams = createCrudHooks(queryKeys.exams.all, examsApi)
export const useExams = exams.useList

const notifications = createCrudHooks(queryKeys.notifications.all, notificationsApi)
export const useNotifications = notifications.useList

const leave = createCrudHooks(queryKeys.leave.all, leaveApi)
export const useLeaveRequests = leave.useList

const payroll = createCrudHooks(queryKeys.payroll.all, payrollApi)
export const usePayroll = payroll.useList

const timetable = createCrudHooks(queryKeys.timetable.all, timetableApi)
export const useTimetable = timetable.useList

const hostel = createCrudHooks(queryKeys.hostel.all, hostelApi)
export const useHostelRooms = hostel.useList

const inventory = createCrudHooks(queryKeys.inventory.all, inventoryApi)
export const useInventory = inventory.useList

export const useClasses = createListHook(queryKeys.academics.classes(), academicsApi.classes)
export const useSubjects = createListHook(queryKeys.academics.subjects(), academicsApi.subjects)
export const useTransportRoutes = createListHook(queryKeys.transport.routes(), transportApi.routes)
export const useTransportVehicles = createListHook(
  queryKeys.transport.vehicles(),
  transportApi.vehicles,
)
export const useLibraryBooks = createListHook(queryKeys.library.books(), libraryApi.books)
export const useLibraryIssues = createListHook(queryKeys.library.issues(), libraryApi.issues)

export { useAdmissions, useCreateAdmission, useUpdateAdmission, useSubmitAdmission } from './use-admissions'
