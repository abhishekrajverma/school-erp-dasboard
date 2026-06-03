// Zod validation schemas for all ERP modules
import { z } from 'zod'

// Student Schema
export const studentSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  admissionNumber: z.string().min(1, 'Admission number is required'),
  class: z.string().min(1, 'Class is required'),
  section: z.string().min(1, 'Section is required'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  parentName: z.string().min(2, 'Parent name is required'),
  parentPhone: z.string().min(10, 'Parent phone is required'),
  parentEmail: z.string().email('Invalid parent email').optional(),
  emergencyContact: z.string().optional(),
  medicalNotes: z.string().optional(),
  status: z.enum(['active', 'inactive', 'graduated', 'transferred']).default('active'),
})

export type StudentFormData = z.infer<typeof studentSchema>

// Teacher Schema
export const teacherSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  employeeId: z.string().min(1, 'Employee ID is required'),
  department: z.string().min(1, 'Department is required'),
  subject: z.string().min(1, 'Subject is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  experience: z.number().min(0, 'Experience must be positive'),
  joiningDate: z.string().min(1, 'Joining date is required'),
  salary: z.number().min(0, 'Salary must be positive'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  status: z.enum(['active', 'on-leave', 'terminated']).default('active'),
})

export type TeacherFormData = z.infer<typeof teacherSchema>

// Fee Schema
export const feeSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  feeType: z.enum(['tuition', 'transport', 'library', 'lab', 'sports', 'other']),
  amount: z.number().min(1, 'Amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
  description: z.string().optional(),
  discount: z.number().min(0).max(100).default(0),
  fine: z.number().min(0).default(0),
})

export type FeeFormData = z.infer<typeof feeSchema>

// Payment Schema
export const paymentSchema = z.object({
  studentId: z.string().min(1, 'Student is required'),
  feeId: z.string().min(1, 'Fee is required'),
  amount: z.number().min(1, 'Amount must be positive'),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'bank_transfer', 'cheque']),
  transactionId: z.string().optional(),
  remarks: z.string().optional(),
})

export type PaymentFormData = z.infer<typeof paymentSchema>

// Salary/Payroll Schema
export const payrollSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  month: z.string().min(1, 'Month is required'),
  year: z.number().min(2020).max(2030),
  basicSalary: z.number().min(0),
  allowances: z.object({
    hra: z.number().min(0).default(0),
    da: z.number().min(0).default(0),
    ta: z.number().min(0).default(0),
    medical: z.number().min(0).default(0),
    special: z.number().min(0).default(0),
  }),
  deductions: z.object({
    pf: z.number().min(0).default(0),
    tax: z.number().min(0).default(0),
    insurance: z.number().min(0).default(0),
    loan: z.number().min(0).default(0),
    other: z.number().min(0).default(0),
  }),
  bonus: z.number().min(0).default(0),
  remarks: z.string().optional(),
})

export type PayrollFormData = z.infer<typeof payrollSchema>

// Attendance Schema
export const attendanceSchema = z.object({
  entityType: z.enum(['student', 'teacher']),
  entityId: z.string().min(1, 'ID is required'),
  date: z.string().min(1, 'Date is required'),
  status: z.enum(['present', 'absent', 'late', 'half-day', 'on-leave']),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  remarks: z.string().optional(),
})

export type AttendanceFormData = z.infer<typeof attendanceSchema>

// Transport/Vehicle Schema
export const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  vehicleType: z.enum(['bus', 'van', 'car']),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  driverName: z.string().min(2, 'Driver name is required'),
  driverPhone: z.string().min(10, 'Driver phone is required'),
  driverLicense: z.string().min(1, 'License number is required'),
  routeName: z.string().min(1, 'Route name is required'),
  insuranceExpiry: z.string().min(1, 'Insurance expiry is required'),
  fitnessExpiry: z.string().min(1, 'Fitness expiry is required'),
  status: z.enum(['active', 'maintenance', 'inactive']).default('active'),
})

export type VehicleFormData = z.infer<typeof vehicleSchema>

// Route Schema
export const routeSchema = z.object({
  routeName: z.string().min(1, 'Route name is required'),
  vehicleId: z.string().min(1, 'Vehicle is required'),
  startPoint: z.string().min(1, 'Start point is required'),
  endPoint: z.string().min(1, 'End point is required'),
  stops: z.array(z.object({
    name: z.string(),
    time: z.string(),
    order: z.number(),
  })),
  fare: z.number().min(0),
  status: z.enum(['active', 'inactive']).default('active'),
})

export type RouteFormData = z.infer<typeof routeSchema>

// Library Book Schema
export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(10, 'ISBN must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  publisher: z.string().optional(),
  publishYear: z.number().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  available: z.number().min(0),
  location: z.string().optional(),
  description: z.string().optional(),
})

export type BookFormData = z.infer<typeof bookSchema>

// Book Issue Schema
export const bookIssueSchema = z.object({
  bookId: z.string().min(1, 'Book is required'),
  memberId: z.string().min(1, 'Member is required'),
  memberType: z.enum(['student', 'teacher']),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  remarks: z.string().optional(),
})

export type BookIssueFormData = z.infer<typeof bookIssueSchema>

// HR Leave Request Schema
export const leaveSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  leaveType: z.enum(['casual', 'sick', 'earned', 'maternity', 'paternity', 'unpaid']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
})

export type LeaveFormData = z.infer<typeof leaveSchema>

// Teacher self-service leave (no employee picker)
export const teacherSelfLeaveSchema = z.object({
  leaveType: z.enum(['casual', 'sick', 'earned', 'maternity', 'paternity', 'unpaid']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
})

export type TeacherSelfLeaveFormData = z.infer<typeof teacherSelfLeaveSchema>

export const teacherProfileUpdateSchema = z.object({
  phone: z.string().min(10, 'Enter a valid phone number'),
  emergencyContact: z.string().min(10, 'Emergency contact is required'),
  address: z.string().min(5, 'Address is required'),
})

export type TeacherProfileUpdateFormData = z.infer<typeof teacherProfileUpdateSchema>

export const parentProfileUpdateSchema = z.object({
  phone: z.string().min(10, 'Enter a valid phone number'),
  alternatePhone: z
    .string()
    .refine((v) => !v.trim() || v.trim().length >= 10, 'Enter a valid alternate phone'),
  occupation: z.string().min(2, 'Occupation is required'),
  address: z.string().min(5, 'Address is required'),
  emergencyContact: z.string().min(10, 'Emergency contact is required'),
})

export type ParentProfileUpdateFormData = z.infer<typeof parentProfileUpdateSchema>

// Exam Schema
export const examSchema = z.object({
  examName: z.string().min(1, 'Exam name is required'),
  examType: z.enum(['unit_test', 'mid_term', 'final', 'practical', 'quiz']),
  subject: z.string().min(1, 'Subject is required'),
  class: z.string().min(1, 'Class is required'),
  date: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  totalMarks: z.number().min(1, 'Total marks must be positive'),
  passingMarks: z.number().min(1, 'Passing marks must be positive'),
  room: z.string().optional(),
})

export type ExamFormData = z.infer<typeof examSchema>

// Settings Schema
export const schoolSettingsSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(6, 'Pincode is required'),
  website: z.string().url().optional(),
  principalName: z.string().optional(),
  establishedYear: z.number().optional(),
  affiliationNumber: z.string().optional(),
  affiliationBoard: z.string().optional(),
})

export type SchoolSettingsFormData = z.infer<typeof schoolSettingsSchema>

// Fee Record (extended CRUD) — legacy single-type
export const feeRecordSchema = z.object({
  studentName: z.string().min(2, 'Student name is required'),
  class: z.string().min(1, 'Class is required'),
  feeType: z.enum(['tuition', 'transport', 'library', 'lab', 'sports', 'other', 'computer', 'smart-class', 'combined']),
  totalFee: z.number().min(1, 'Total fee must be positive'),
  paid: z.number().min(0),
  discount: z.number().min(0).default(0),
  fine: z.number().min(0).default(0),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.enum(['paid', 'pending', 'overdue']).default('pending'),
})

export type FeeRecordFormData = z.infer<typeof feeRecordSchema>

const feeLineItemSchema = z.object({
  enabled: z.boolean(),
  feeType: z.enum(['tuition', 'transport', 'library', 'computer', 'smart-class']),
  amount: z.number().min(0),
  lineDiscount: z.number().min(0).default(0),
})

/** Combined multi-fee payment on one invoice */
export const multiFeePaymentSchema = z
  .object({
    studentName: z.string().min(2, 'Student name is required'),
    class: z.string().min(1, 'Class is required'),
    dueDate: z.string().min(1, 'Due date is required'),
    feeLines: z.array(feeLineItemSchema),
    globalDiscount: z.number().min(0).default(0),
    discountPercent: z.number().min(0).max(100).default(0),
    fine: z.number().min(0).default(0),
    amountPaying: z.number().min(0),
    paymentMethod: z
      .enum(['cash', 'card', 'upi', 'bank_transfer', 'cheque'])
      .optional(),
    status: z.enum(['paid', 'pending', 'overdue']).default('pending'),
  })
  .superRefine((data, ctx) => {
    const active = data.feeLines.filter((l) => l.enabled)
    if (active.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select at least one fee type to pay',
        path: ['feeLines'],
      })
      return
    }
    const invalidAmount = active.some((l) => l.amount <= 0)
    if (invalidAmount) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter amount for each selected fee type',
        path: ['feeLines'],
      })
    }
  })

export type MultiFeePaymentFormData = z.infer<typeof multiFeePaymentSchema>
export type FeeLineItemFormData = z.infer<typeof feeLineItemSchema>

// Parent Schema
export const parentSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone is required'),
  occupation: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  studentIds: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
})

export type ParentFormData = z.infer<typeof parentSchema>

// Subject Schema
export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  class: z.string().min(1, 'Class is required'),
  teacherId: z.string().min(1, 'Teacher is required'),
  weeklyHours: z.number().min(1).max(40),
  status: z.enum(['active', 'inactive']).default('active'),
})

export type SubjectFormData = z.infer<typeof subjectSchema>

// Notification Schema
export const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  type: z.enum(['info', 'warning', 'success', 'error']),
  targetAudience: z.enum(['all', 'students', 'parents', 'staff']),
})

export type NotificationFormData = z.infer<typeof notificationSchema>
