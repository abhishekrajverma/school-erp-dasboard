export type ExamDto = {
  id: string
  examName: string
  examType: string
  subject: string
  class: string
  date: string
  startTime: string
  duration: number
  totalMarks: number
  passingMarks: number
  room: string | null
  status: string
  studentsCount: number
}

export type NotificationDto = {
  id: string
  title: string
  message: string
  type: string
  targetAudience: string
  sentAt: string
  readCount: number
  totalRecipients: number
}

export type LeaveRequestDto = {
  id: string
  employeeId: string
  employeeName: string
  department: string
  leaveType: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: string
  appliedOn: string
  approvedBy: string | null
  approvedOn: string | null
  proofDocument: string | null
}

export type PayrollRecordDto = {
  id: string
  employeeId: string
  employeeName: string
  department: string
  month: string
  year: number
  basicSalary: number
  hra: number
  da: number
  ta: number
  medical: number
  special: number
  pfDeduction: number
  taxDeduction: number
  insurance: number
  loanDeduction: number
  otherDeduction: number
  bonus: number
  grossSalary: number
  totalDeductions: number
  netSalary: number
  status: string
  paymentDate: string | null
}

export type TimetableEntryDto = {
  id: string
  class: string
  section: string
  day: string
  period: number
  subject: string
  teacher: string
  teacherId: string
  room: string
  startTime: string
  endTime: string
}

export type ClassDto = {
  id: string
  name: string
  section?: string
  /** Sections offered for this class (API shape) */
  sections?: string[]
  grade?: string
  classTeacher?: string | null
  classTeacherId?: string | null
  totalStudents?: number
  room?: string | null
  status?: string
}

export type SubjectDto = {
  id: string
  name: string
  code: string
  class: string
  teacherId: string | null
  teacherName: string | null
  weeklyHours: number
  status: string
}

export type TransportRouteDto = {
  id: string
  routeName: string
  vehicleId: string
  vehicleNumber: string
  driverName: string
  startPoint: string
  endPoint: string
  totalStops: number
  totalStudents: number
  fare: number
  morningTime: string
  eveningTime: string
  status: string
  distance: string
  stops: unknown | null
}

export type TransportVehicleDto = {
  id: string
  vehicleNumber: string
  vehicleType: string
  capacity: number
  driverName: string
  driverPhone: string
  driverLicense: string
  routeId: string | null
  routeName: string | null
  insuranceExpiry: string
  fitnessExpiry: string
  currentStudents: number
  status: string
  gpsStatus: string
  lastLocation: string | null
}

export type BookDto = {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  publisher: string | null
  publishYear: number | null
  quantity: number
  available: number
  issued: number
  location: string | null
  description: string | null
}

export type BookIssueDto = {
  id: string
  bookId: string
  bookTitle: string
  memberId: string
  memberName: string
  memberType: string
  class: string
  issueDate: string
  dueDate: string
  returnDate: string | null
  status: string
  fine: number
}

export type HostelRoomDto = {
  id: string
  roomNo: string
  block: string
  capacity: number
  occupied: number
  floor: number
  warden: string | null
  status: string
  monthlyFee: number
}

export type InventoryItemDto = {
  id: string
  name: string
  category: string
  sku: string
  quantity: number
  minStock: number
  unit: string
  location: string | null
  status: string
  lastRestocked: string | null
}

export type PaymentDto = {
  id: string
  [key: string]: unknown
}

export type ReportDto = {
  id: string
  [key: string]: unknown
}
