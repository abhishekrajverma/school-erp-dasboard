import type { AttendanceRecordDto } from './attendance'
import type { FeeRecordDto } from './fees'
import type { ParentDto } from './parents'
import type { StudentDto } from './students'
import type { TeacherDto } from './teachers'
import type {
  BookIssueDto,
  ExamDto,
  LeaveRequestDto,
  NotificationDto,
  PayrollRecordDto,
  TimetableEntryDto,
  TransportRouteDto,
} from './resources'

export type ParentChildDto = Pick<
  StudentDto,
  | 'id'
  | 'firstName'
  | 'lastName'
  | 'name'
  | 'class'
  | 'rollNo'
  | 'admissionNo'
  | 'attendance'
  | 'feeStatus'
  | 'status'
  | 'avatar'
>

export type ParentTransportDto = {
  route: TransportRouteDto
  vehicle?: {
    vehicleNumber: string
    driverName: string
    driverPhone: string
  }
  pickupStop?: {
    name: string
    morningPickup: string
    order?: number
  }
  assignmentId?: string
}

export type RecordFeePaymentRequest = {
  amount: number
  paymentMethod: string
}

export type CreateLeaveRequestBody = {
  leaveType: string
  startDate: string
  endDate: string
  reason: string
  proofDocumentId?: string
}

export type {
  ParentDto,
  StudentDto,
  TeacherDto,
  FeeRecordDto,
  AttendanceRecordDto,
  ExamDto,
  TimetableEntryDto,
  BookIssueDto,
  LeaveRequestDto,
  PayrollRecordDto,
  NotificationDto,
}
