// Extended realistic School ERP dummy data for CRUD operations
import { dashboardStats, monthlyFeeCollection, studentAttendanceData, revenueGrowth, admissionTrend, salaryDistribution } from './data'

export { dashboardStats, monthlyFeeCollection, studentAttendanceData, revenueGrowth, admissionTrend, salaryDistribution }

// Extended Students Data
export const studentsData = [
  { id: '1', firstName: 'Arjun', lastName: 'Sharma', name: 'Arjun Sharma', class: '10-A', section: 'A', rollNo: '1001', admissionNo: 'ADM2020001', email: 'arjun.s@school.edu', phone: '+91 98765 43210', dateOfBirth: '2008-05-15', gender: 'male', bloodGroup: 'B+', address: '123 Green Park, Mumbai', parentName: 'Mr. Rajesh Sharma', parentPhone: '+91 98765 43200', parentEmail: 'rajesh.sharma@email.com', status: 'active', feeStatus: 'paid', attendance: 96, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arjun' },
  { id: '2', firstName: 'Priya', lastName: 'Patel', name: 'Priya Patel', class: '8-B', section: 'B', rollNo: '802', admissionNo: 'ADM2021015', email: 'priya.p@school.edu', phone: '+91 98765 43211', dateOfBirth: '2010-08-22', gender: 'female', bloodGroup: 'A+', address: '456 Rose Garden, Mumbai', parentName: 'Mrs. Sunita Patel', parentPhone: '+91 98765 43201', parentEmail: 'sunita.patel@email.com', status: 'active', feeStatus: 'pending', attendance: 94, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' },
  { id: '3', firstName: 'Rahul', lastName: 'Verma', name: 'Rahul Verma', class: '12-A', section: 'A', rollNo: '1201', admissionNo: 'ADM2019008', email: 'rahul.v@school.edu', phone: '+91 98765 43212', dateOfBirth: '2006-03-10', gender: 'male', bloodGroup: 'O+', address: '789 Lake View, Mumbai', parentName: 'Mr. Anil Verma', parentPhone: '+91 98765 43202', parentEmail: 'anil.verma@email.com', status: 'active', feeStatus: 'paid', attendance: 92, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul' },
  { id: '4', firstName: 'Sneha', lastName: 'Gupta', name: 'Sneha Gupta', class: '9-C', section: 'C', rollNo: '903', admissionNo: 'ADM2020042', email: 'sneha.g@school.edu', phone: '+91 98765 43213', dateOfBirth: '2009-11-28', gender: 'female', bloodGroup: 'AB+', address: '321 Hill Road, Mumbai', parentName: 'Mr. Vivek Gupta', parentPhone: '+91 98765 43203', parentEmail: 'vivek.gupta@email.com', status: 'active', feeStatus: 'overdue', attendance: 88, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sneha' },
  { id: '5', firstName: 'Amit', lastName: 'Kumar', name: 'Amit Kumar', class: '11-B', section: 'B', rollNo: '1102', admissionNo: 'ADM2019023', email: 'amit.k@school.edu', phone: '+91 98765 43214', dateOfBirth: '2007-07-04', gender: 'male', bloodGroup: 'B-', address: '654 Ocean Drive, Mumbai', parentName: 'Mr. Suresh Kumar', parentPhone: '+91 98765 43204', parentEmail: 'suresh.kumar@email.com', status: 'inactive', feeStatus: 'paid', attendance: 78, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit' },
  { id: '6', firstName: 'Kavya', lastName: 'Nair', name: 'Kavya Nair', class: '10-A', section: 'A', rollNo: '1002', admissionNo: 'ADM2020003', email: 'kavya.n@school.edu', phone: '+91 98765 43215', dateOfBirth: '2008-02-14', gender: 'female', bloodGroup: 'A-', address: '987 Palm Street, Mumbai', parentName: 'Mr. Mohan Nair', parentPhone: '+91 98765 43205', parentEmail: 'mohan.nair@email.com', status: 'active', feeStatus: 'paid', attendance: 97, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kavya' },
  { id: '7', firstName: 'Rohan', lastName: 'Das', name: 'Rohan Das', class: '9-C', section: 'C', rollNo: '904', admissionNo: 'ADM2020056', email: 'rohan.d@school.edu', phone: '+91 98765 43216', dateOfBirth: '2009-09-08', gender: 'male', bloodGroup: 'O-', address: '147 Garden View, Mumbai', parentName: 'Mr. Amit Das', parentPhone: '+91 98765 43206', parentEmail: 'amit.das@email.com', status: 'active', feeStatus: 'pending', attendance: 91, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rohan' },
  { id: '8', firstName: 'Ananya', lastName: 'Reddy', name: 'Ananya Reddy', class: '8-B', section: 'B', rollNo: '803', admissionNo: 'ADM2021022', email: 'ananya.r@school.edu', phone: '+91 98765 43217', dateOfBirth: '2010-12-20', gender: 'female', bloodGroup: 'B+', address: '258 River Side, Mumbai', parentName: 'Dr. Ramesh Reddy', parentPhone: '+91 98765 43207', parentEmail: 'ramesh.reddy@email.com', status: 'active', feeStatus: 'paid', attendance: 95, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ananya' },
  { id: '9', firstName: 'Vikram', lastName: 'Singh', name: 'Vikram Singh', class: '12-A', section: 'A', rollNo: '1202', admissionNo: 'ADM2019011', email: 'vikram.s@school.edu', phone: '+91 98765 43218', dateOfBirth: '2006-06-30', gender: 'male', bloodGroup: 'AB-', address: '369 Mountain View, Mumbai', parentName: 'Col. Rajveer Singh', parentPhone: '+91 98765 43208', parentEmail: 'rajveer.singh@email.com', status: 'active', feeStatus: 'paid', attendance: 93, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram' },
  { id: '10', firstName: 'Meera', lastName: 'Joshi', name: 'Meera Joshi', class: '7-A', section: 'A', rollNo: '701', admissionNo: 'ADM2022008', email: 'meera.j@school.edu', phone: '+91 98765 43219', dateOfBirth: '2011-04-18', gender: 'female', bloodGroup: 'A+', address: '741 Sunset Boulevard, Mumbai', parentName: 'Mrs. Sunita Joshi', parentPhone: '+91 98765 43209', parentEmail: 'sunita.joshi@email.com', status: 'active', feeStatus: 'paid', attendance: 98, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=meera' },
]

// Extended Teachers Data
export const teachersData = [
  { id: '1', firstName: 'Rajesh', lastName: 'Kumar', name: 'Dr. Rajesh Kumar', employeeId: 'EMP001', department: 'Science', subject: 'Chemistry', qualification: 'Ph.D. Chemistry', experience: 15, email: 'rajesh.k@school.edu', phone: '+91 98765 12340', salary: 85000, joiningDate: '2010-06-15', status: 'active', classes: ['10-A', '11-B', '12-A'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh' },
  { id: '2', firstName: 'Anita', lastName: 'Singh', name: 'Mrs. Anita Singh', employeeId: 'EMP002', department: 'Mathematics', subject: 'Mathematics', qualification: 'M.Sc. Mathematics', experience: 12, email: 'anita.s@school.edu', phone: '+91 98765 12341', salary: 72000, joiningDate: '2012-08-01', status: 'active', classes: ['9-C', '10-A', '10-B'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anita' },
  { id: '3', firstName: 'Vikram', lastName: 'Rao', name: 'Mr. Vikram Rao', employeeId: 'EMP003', department: 'English', subject: 'English Literature', qualification: 'M.A. English', experience: 8, email: 'vikram.r@school.edu', phone: '+91 98765 12342', salary: 68000, joiningDate: '2016-04-20', status: 'active', classes: ['8-B', '9-A', '10-A'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikramr' },
  { id: '4', firstName: 'Deepa', lastName: 'Nair', name: 'Ms. Deepa Nair', employeeId: 'EMP004', department: 'History', subject: 'History & Civics', qualification: 'M.A. History', experience: 10, email: 'deepa.n@school.edu', phone: '+91 98765 12343', salary: 65000, joiningDate: '2014-07-10', status: 'on-leave', classes: ['7-A', '8-A', '9-B'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepa' },
  { id: '5', firstName: 'Suresh', lastName: 'Menon', name: 'Mr. Suresh Menon', employeeId: 'EMP005', department: 'Science', subject: 'Physics', qualification: 'M.Sc. Physics', experience: 14, email: 'suresh.m@school.edu', phone: '+91 98765 12344', salary: 78000, joiningDate: '2010-11-25', status: 'active', classes: ['11-A', '11-B', '12-A'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh' },
  { id: '6', firstName: 'Priya', lastName: 'Sharma', name: 'Mrs. Priya Sharma', employeeId: 'EMP006', department: 'Science', subject: 'Biology', qualification: 'M.Sc. Biology', experience: 9, email: 'priya.sh@school.edu', phone: '+91 98765 12345', salary: 70000, joiningDate: '2015-03-15', status: 'active', classes: ['9-A', '10-B', '11-A'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priyash' },
  { id: '7', firstName: 'Amit', lastName: 'Desai', name: 'Mr. Amit Desai', employeeId: 'EMP007', department: 'Commerce', subject: 'Accountancy', qualification: 'M.Com, CA', experience: 11, email: 'amit.d@school.edu', phone: '+91 98765 12346', salary: 75000, joiningDate: '2013-09-01', status: 'active', classes: ['11-Commerce', '12-Commerce'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amitd' },
  { id: '8', firstName: 'Lakshmi', lastName: 'Iyer', name: 'Mrs. Lakshmi Iyer', employeeId: 'EMP008', department: 'Computer Science', subject: 'Computer Science', qualification: 'M.Tech CS', experience: 7, email: 'lakshmi.i@school.edu', phone: '+91 98765 12347', salary: 72000, joiningDate: '2017-06-20', status: 'active', classes: ['10-A', '11-Science', '12-Science'], avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lakshmi' },
]

// Extended Fee Records
export type FeeLineItem = {
  feeType: string
  amount: number
  lineDiscount: number
}

export type FeeRecord = {
  id: string
  invoiceNo: string
  studentId: string
  studentName: string
  class: string
  feeType: string
  totalFee: number
  paid: number
  pending: number
  discount: number
  fine: number
  dueDate: string
  paidDate: string | null
  status: string
  paymentMethod: string | null
  /** Line breakdown when multiple fee types paid together */
  feeItems?: FeeLineItem[]
}

export const feeRecordsData: FeeRecord[] = [
  { id: '1', invoiceNo: 'INV2024001', studentId: '1', studentName: 'Arjun Sharma', class: '10-A', feeType: 'tuition', totalFee: 120000, paid: 120000, pending: 0, discount: 0, fine: 0, dueDate: '2024-06-30', paidDate: '2024-06-15', status: 'paid', paymentMethod: 'bank_transfer' },
  { id: '2', invoiceNo: 'INV2024002', studentId: '2', studentName: 'Priya Patel', class: '8-B', feeType: 'tuition', totalFee: 100000, paid: 58000, pending: 42000, discount: 0, fine: 0, dueDate: '2024-06-15', paidDate: null, status: 'pending', paymentMethod: null },
  { id: '3', invoiceNo: 'INV2024003', studentId: '3', studentName: 'Rahul Verma', class: '12-A', feeType: 'tuition', totalFee: 140000, paid: 140000, pending: 0, discount: 5000, fine: 0, dueDate: '2024-06-30', paidDate: '2024-06-10', status: 'paid', paymentMethod: 'upi' },
  { id: '4', invoiceNo: 'INV2024004', studentId: '4', studentName: 'Sneha Gupta', class: '9-C', feeType: 'tuition', totalFee: 110000, paid: 44000, pending: 66000, discount: 0, fine: 2000, dueDate: '2024-05-31', paidDate: null, status: 'overdue', paymentMethod: null },
  { id: '5', invoiceNo: 'INV2024005', studentId: '5', studentName: 'Amit Kumar', class: '11-B', feeType: 'tuition', totalFee: 130000, paid: 130000, pending: 0, discount: 10000, fine: 0, dueDate: '2024-06-30', paidDate: '2024-06-05', status: 'paid', paymentMethod: 'card' },
  { id: '6', invoiceNo: 'INV2024006', studentId: '6', studentName: 'Kavya Nair', class: '10-A', feeType: 'tuition', totalFee: 120000, paid: 120000, pending: 0, discount: 0, fine: 0, dueDate: '2024-06-30', paidDate: '2024-06-18', status: 'paid', paymentMethod: 'cash' },
  { id: '7', invoiceNo: 'INV2024007', studentId: '7', studentName: 'Rohan Das', class: '9-C', feeType: 'tuition', totalFee: 110000, paid: 55000, pending: 55000, discount: 0, fine: 0, dueDate: '2024-07-15', paidDate: null, status: 'pending', paymentMethod: null },
  { id: '8', invoiceNo: 'INV2024008', studentId: '8', studentName: 'Ananya Reddy', class: '8-B', feeType: 'tuition', totalFee: 100000, paid: 100000, pending: 0, discount: 5000, fine: 0, dueDate: '2024-06-30', paidDate: '2024-06-20', status: 'paid', paymentMethod: 'bank_transfer' },
]

// Extended Payroll Records
export const payrollRecordsData = [
  { id: '1', employeeId: '1', employeeName: 'Dr. Rajesh Kumar', department: 'Science', month: 'June', year: 2024, basicSalary: 70000, hra: 7000, da: 3500, ta: 2000, medical: 1500, special: 1000, pfDeduction: 4200, taxDeduction: 5800, insurance: 500, loanDeduction: 0, otherDeduction: 0, bonus: 0, grossSalary: 85000, totalDeductions: 10500, netSalary: 74500, status: 'pending', paymentDate: null },
  { id: '2', employeeId: '2', employeeName: 'Mrs. Anita Singh', department: 'Mathematics', month: 'June', year: 2024, basicSalary: 60000, hra: 6000, da: 3000, ta: 1500, medical: 1000, special: 500, pfDeduction: 3600, taxDeduction: 4200, insurance: 400, loanDeduction: 0, otherDeduction: 0, bonus: 0, grossSalary: 72000, totalDeductions: 8200, netSalary: 63800, status: 'pending', paymentDate: null },
  { id: '3', employeeId: '3', employeeName: 'Mr. Vikram Rao', department: 'English', month: 'June', year: 2024, basicSalary: 55000, hra: 5500, da: 2750, ta: 1500, medical: 1000, special: 750, pfDeduction: 3300, taxDeduction: 3500, insurance: 400, loanDeduction: 2000, otherDeduction: 0, bonus: 0, grossSalary: 66500, totalDeductions: 9200, netSalary: 57300, status: 'approved', paymentDate: null },
  { id: '4', employeeId: '4', employeeName: 'Ms. Deepa Nair', department: 'History', month: 'June', year: 2024, basicSalary: 52000, hra: 5200, da: 2600, ta: 1400, medical: 1000, special: 800, pfDeduction: 3120, taxDeduction: 3000, insurance: 400, loanDeduction: 0, otherDeduction: 0, bonus: 0, grossSalary: 63000, totalDeductions: 6520, netSalary: 56480, status: 'approved', paymentDate: null },
  { id: '5', employeeId: '5', employeeName: 'Mr. Suresh Menon', department: 'Science', month: 'June', year: 2024, basicSalary: 65000, hra: 6500, da: 3250, ta: 1750, medical: 1000, special: 500, pfDeduction: 3900, taxDeduction: 5000, insurance: 500, loanDeduction: 0, otherDeduction: 0, bonus: 0, grossSalary: 78000, totalDeductions: 9400, netSalary: 68600, status: 'paid', paymentDate: '2024-06-28' },
  { id: '6', employeeId: '6', employeeName: 'Mrs. Priya Sharma', department: 'Science', month: 'June', year: 2024, basicSalary: 58000, hra: 5800, da: 2900, ta: 1500, medical: 1000, special: 800, pfDeduction: 3480, taxDeduction: 4000, insurance: 400, loanDeduction: 0, otherDeduction: 0, bonus: 0, grossSalary: 70000, totalDeductions: 7880, netSalary: 62120, status: 'paid', paymentDate: '2024-06-28' },
]

// Transport/Vehicle Data
export const vehiclesData = [
  { id: '1', vehicleNumber: 'MH-01-AB-1234', vehicleType: 'bus', capacity: 50, driverName: 'Ramesh Kumar', driverPhone: '+91 98765 11111', driverLicense: 'MH0120150012345', routeId: '1', routeName: 'Route A - North Zone', insuranceExpiry: '2025-03-15', fitnessExpiry: '2024-12-31', currentStudents: 42, status: 'active', gpsStatus: 'online', lastLocation: 'Green Park, Stop 5' },
  { id: '2', vehicleNumber: 'MH-01-CD-5678', vehicleType: 'bus', capacity: 45, driverName: 'Sunil Yadav', driverPhone: '+91 98765 22222', driverLicense: 'MH0120160023456', routeId: '2', routeName: 'Route B - South Zone', insuranceExpiry: '2025-06-20', fitnessExpiry: '2025-01-15', currentStudents: 38, status: 'active', gpsStatus: 'online', lastLocation: 'Rose Garden, Stop 3' },
  { id: '3', vehicleNumber: 'MH-01-EF-9012', vehicleType: 'bus', capacity: 50, driverName: 'Mohan Patil', driverPhone: '+91 98765 33333', driverLicense: 'MH0120140034567', routeId: '3', routeName: 'Route C - East Zone', insuranceExpiry: '2024-09-10', fitnessExpiry: '2024-08-20', currentStudents: 0, status: 'maintenance', gpsStatus: 'offline', lastLocation: 'School Garage' },
  { id: '4', vehicleNumber: 'MH-01-GH-3456', vehicleType: 'van', capacity: 15, driverName: 'Arun Singh', driverPhone: '+91 98765 44444', driverLicense: 'MH0120170045678', routeId: '4', routeName: 'Route D - West Zone', insuranceExpiry: '2025-02-28', fitnessExpiry: '2024-11-30', currentStudents: 12, status: 'active', gpsStatus: 'online', lastLocation: 'Lake View, Stop 2' },
]

// Routes Data
export const routesData = [
  { id: '1', routeName: 'Route A - North Zone', vehicleId: '1', vehicleNumber: 'MH-01-AB-1234', driverName: 'Ramesh Kumar', startPoint: 'School Campus', endPoint: 'Green Park', totalStops: 8, totalStudents: 42, fare: 3500, morningTime: '07:00 AM', eveningTime: '03:30 PM', status: 'active', distance: '15 km' },
  { id: '2', routeName: 'Route B - South Zone', vehicleId: '2', vehicleNumber: 'MH-01-CD-5678', driverName: 'Sunil Yadav', startPoint: 'School Campus', endPoint: 'Rose Garden', totalStops: 6, totalStudents: 38, fare: 3000, morningTime: '07:15 AM', eveningTime: '03:45 PM', status: 'active', distance: '12 km' },
  { id: '3', routeName: 'Route C - East Zone', vehicleId: '3', vehicleNumber: 'MH-01-EF-9012', driverName: 'Mohan Patil', startPoint: 'School Campus', endPoint: 'Hill Road', totalStops: 10, totalStudents: 45, fare: 4000, morningTime: '06:45 AM', eveningTime: '04:00 PM', status: 'inactive', distance: '18 km' },
  { id: '4', routeName: 'Route D - West Zone', vehicleId: '4', vehicleNumber: 'MH-01-GH-3456', driverName: 'Arun Singh', startPoint: 'School Campus', endPoint: 'Lake View', totalStops: 5, totalStudents: 12, fare: 2500, morningTime: '07:30 AM', eveningTime: '03:15 PM', status: 'active', distance: '8 km' },
]

// Library Books Data
export const booksData = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', category: 'Fiction', publisher: 'Scribner', publishYear: 1925, quantity: 10, available: 7, issued: 3, location: 'Shelf A-1', description: 'A novel about the American Dream' },
  { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780446310789', category: 'Fiction', publisher: 'Grand Central', publishYear: 1960, quantity: 8, available: 5, issued: 3, location: 'Shelf A-2', description: 'A story of racial injustice' },
  { id: '3', title: 'Physics for Class 12', author: 'H.C. Verma', isbn: '9788177091878', category: 'Textbook', publisher: 'Bharati Bhawan', publishYear: 2020, quantity: 50, available: 35, issued: 15, location: 'Shelf B-1', description: 'CBSE Physics textbook' },
  { id: '4', title: 'Mathematics NCERT Class 10', author: 'NCERT', isbn: '9788174506351', category: 'Textbook', publisher: 'NCERT', publishYear: 2022, quantity: 60, available: 42, issued: 18, location: 'Shelf B-2', description: 'NCERT Mathematics for Class 10' },
  { id: '5', title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', category: 'Science', publisher: 'Bantam', publishYear: 1988, quantity: 5, available: 3, issued: 2, location: 'Shelf C-1', description: 'Popular science book on cosmology' },
  { id: '6', title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780062315007', category: 'Fiction', publisher: 'HarperOne', publishYear: 1988, quantity: 12, available: 9, issued: 3, location: 'Shelf A-3', description: 'A philosophical novel about following dreams' },
]

// Book Issues Data
export const bookIssuesData = [
  { id: '1', bookId: '1', bookTitle: 'The Great Gatsby', memberId: '1', memberName: 'Arjun Sharma', memberType: 'student', class: '10-A', issueDate: '2024-06-01', dueDate: '2024-06-15', returnDate: null, status: 'issued', fine: 0 },
  { id: '2', bookId: '3', bookTitle: 'Physics for Class 12', memberId: '3', memberName: 'Rahul Verma', memberType: 'student', class: '12-A', issueDate: '2024-06-05', dueDate: '2024-06-19', returnDate: '2024-06-18', status: 'returned', fine: 0 },
  { id: '3', bookId: '2', bookTitle: 'To Kill a Mockingbird', memberId: '2', memberName: 'Priya Patel', memberType: 'student', class: '8-B', issueDate: '2024-05-20', dueDate: '2024-06-03', returnDate: null, status: 'overdue', fine: 100 },
  { id: '4', bookId: '5', bookTitle: 'A Brief History of Time', memberId: '1', memberName: 'Dr. Rajesh Kumar', memberType: 'teacher', class: null, issueDate: '2024-06-10', dueDate: '2024-07-10', returnDate: null, status: 'issued', fine: 0 },
]

// HR Leave Requests
export type LeaveProofDocument = {
  name: string
  size: number
  type: string
  lastModified?: number
  previewUrl?: string
}

export type LeaveRequest = {
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
  proofDocument: LeaveProofDocument | null
}

export const leaveRequestsData: LeaveRequest[] = [
  { id: '1', employeeId: '4', employeeName: 'Ms. Deepa Nair', department: 'History', leaveType: 'sick', startDate: '2024-06-20', endDate: '2024-06-25', days: 6, reason: 'Medical treatment and recovery from surgery', status: 'approved', appliedOn: '2024-06-18', approvedBy: 'Principal', approvedOn: '2024-06-19', proofDocument: { name: 'medical-certificate.pdf', size: 524288, type: 'application/pdf' } },
  { id: '2', employeeId: '2', employeeName: 'Mrs. Anita Singh', department: 'Mathematics', leaveType: 'casual', startDate: '2024-07-01', endDate: '2024-07-02', days: 2, reason: 'Personal work - attending family function', status: 'pending', appliedOn: '2024-06-25', approvedBy: null, approvedOn: null, proofDocument: null },
  { id: '3', employeeId: '3', employeeName: 'Mr. Vikram Rao', department: 'English', leaveType: 'earned', startDate: '2024-07-15', endDate: '2024-07-25', days: 11, reason: 'Annual vacation with family', status: 'pending', appliedOn: '2024-06-28', approvedBy: null, approvedOn: null, proofDocument: null },
  { id: '4', employeeId: '5', employeeName: 'Mr. Suresh Menon', department: 'Science', leaveType: 'casual', startDate: '2024-06-10', endDate: '2024-06-10', days: 1, reason: 'Passport renewal appointment', status: 'approved', appliedOn: '2024-06-08', approvedBy: 'Vice Principal', approvedOn: '2024-06-09', proofDocument: { name: 'appointment-slip.pdf', size: 186240, type: 'application/pdf' } },
]

// Exams Data
export const examsData = [
  { id: '1', examName: 'Mid-Term Mathematics', examType: 'mid_term', subject: 'Mathematics', class: '10-A', date: '2024-07-15', startTime: '09:00', duration: 180, totalMarks: 100, passingMarks: 35, room: 'Hall A', status: 'scheduled', studentsCount: 45 },
  { id: '2', examName: 'Unit Test - Physics', examType: 'unit_test', subject: 'Physics', class: '12-A', date: '2024-06-28', startTime: '10:00', duration: 60, totalMarks: 50, passingMarks: 18, room: 'Room 301', status: 'completed', studentsCount: 38 },
  { id: '3', examName: 'Mid-Term English', examType: 'mid_term', subject: 'English', class: '8-B', date: '2024-07-16', startTime: '09:00', duration: 180, totalMarks: 100, passingMarks: 35, room: 'Hall B', status: 'scheduled', studentsCount: 42 },
  { id: '4', examName: 'Practical - Chemistry', examType: 'practical', subject: 'Chemistry', class: '11-B', date: '2024-07-10', startTime: '11:00', duration: 120, totalMarks: 30, passingMarks: 12, room: 'Lab 1', status: 'scheduled', studentsCount: 35 },
]

// Classes Data
export const classesData = [
  { id: '1', name: 'Class 7', sections: ['A', 'B'], totalStudents: 85, classTeacher: 'Mrs. Priya Sharma' },
  { id: '2', name: 'Class 8', sections: ['A', 'B', 'C'], totalStudents: 120, classTeacher: 'Mr. Vikram Rao' },
  { id: '3', name: 'Class 9', sections: ['A', 'B', 'C'], totalStudents: 115, classTeacher: 'Ms. Deepa Nair' },
  { id: '4', name: 'Class 10', sections: ['A', 'B'], totalStudents: 90, classTeacher: 'Mrs. Anita Singh' },
  { id: '5', name: 'Class 11', sections: ['Science', 'Commerce'], totalStudents: 75, classTeacher: 'Mr. Amit Desai' },
  { id: '6', name: 'Class 12', sections: ['Science', 'Commerce'], totalStudents: 68, classTeacher: 'Dr. Rajesh Kumar' },
]

// Timetable Data
export const timetableData = [
  { id: '1', class: '10-A', day: 'Monday', periods: [
    { time: '09:00-09:45', subject: 'Mathematics', teacher: 'Mrs. Anita Singh', room: 'Room 201' },
    { time: '09:45-10:30', subject: 'Physics', teacher: 'Mr. Suresh Menon', room: 'Lab 1' },
    { time: '10:45-11:30', subject: 'English', teacher: 'Mr. Vikram Rao', room: 'Room 201' },
    { time: '11:30-12:15', subject: 'Chemistry', teacher: 'Dr. Rajesh Kumar', room: 'Lab 2' },
    { time: '12:15-01:00', subject: 'Computer Science', teacher: 'Mrs. Lakshmi Iyer', room: 'Computer Lab' },
    { time: '02:00-02:45', subject: 'Biology', teacher: 'Mrs. Priya Sharma', room: 'Room 201' },
    { time: '02:45-03:30', subject: 'Hindi', teacher: 'Mrs. Sunita Verma', room: 'Room 201' },
  ]},
]

// Notifications Data
export const notificationsData = [
  { id: '1', title: 'Fee Payment Reminder', message: 'Fee payment for Q2 is due on June 30, 2024', type: 'warning', targetAudience: 'parents', sentAt: '2024-06-20', readCount: 1250, totalRecipients: 2847 },
  { id: '2', title: 'Annual Day Celebration', message: 'Annual Day celebration scheduled for July 15, 2024. All students are requested to participate.', type: 'info', targetAudience: 'all', sentAt: '2024-06-18', readCount: 3000, totalRecipients: 3200 },
  { id: '3', title: 'PTM Schedule', message: 'Parent-Teacher Meeting scheduled for June 22, 2024 from 10 AM to 2 PM', type: 'info', targetAudience: 'parents', sentAt: '2024-06-15', readCount: 2100, totalRecipients: 2847 },
  { id: '4', title: 'Salary Credit', message: 'June 2024 salary has been credited to your account', type: 'success', targetAudience: 'staff', sentAt: '2024-06-28', readCount: 145, totalRecipients: 156 },
]

// Attendance Summary for Dashboard
export const attendanceSummary = {
  today: { present: 2680, absent: 167, late: 45, total: 2847 },
  thisWeek: { avgAttendance: 94.2, improvement: 2.3 },
  thisMonth: { avgAttendance: 93.8, workingDays: 22 },
}

// Fee Summary for Dashboard
export const feeSummary = {
  totalCollected: 47500000,
  totalPending: 1245000,
  totalOverdue: 380000,
  collectionRate: 96.8,
  thisMonth: { collected: 8750000, pending: 480000 },
}

// Parents Data
export const parentsData = [
  { id: '1', firstName: 'Rajesh', lastName: 'Sharma', name: 'Mr. Rajesh Sharma', email: 'rajesh.sharma@email.com', phone: '+91 98765 43200', occupation: 'Business Owner', address: '123 Green Park, Mumbai', children: ['Arjun Sharma'], studentIds: ['1'], status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajeshp' },
  { id: '2', firstName: 'Sunita', lastName: 'Patel', name: 'Mrs. Sunita Patel', email: 'sunita.patel@email.com', phone: '+91 98765 43201', occupation: 'Doctor', address: '456 Rose Garden, Mumbai', children: ['Priya Patel'], studentIds: ['2'], status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunitap' },
  { id: '3', firstName: 'Anil', lastName: 'Verma', name: 'Mr. Anil Verma', email: 'anil.verma@email.com', phone: '+91 98765 43202', occupation: 'Engineer', address: '789 Lake View, Mumbai', children: ['Rahul Verma'], studentIds: ['3'], status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anilv' },
  { id: '4', firstName: 'Vivek', lastName: 'Gupta', name: 'Mr. Vivek Gupta', email: 'vivek.gupta@email.com', phone: '+91 98765 43203', occupation: 'CA', address: '321 Hill Road, Mumbai', children: ['Sneha Gupta'], studentIds: ['4'], status: 'active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vivekg' },
  { id: '5', firstName: 'Suresh', lastName: 'Kumar', name: 'Mr. Suresh Kumar', email: 'suresh.kumar@email.com', phone: '+91 98765 43204', occupation: 'Teacher', address: '654 Ocean Drive, Mumbai', children: ['Amit Kumar'], studentIds: ['5'], status: 'inactive', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sureshk' },
]

// Subjects Data
export const subjectsData = [
  { id: '1', name: 'Mathematics', code: 'MATH10', class: '10-A', teacherId: '2', teacherName: 'Mrs. Anita Singh', weeklyHours: 6, status: 'active' },
  { id: '2', name: 'Physics', code: 'PHY12', class: '12-A', teacherId: '5', teacherName: 'Mr. Suresh Menon', weeklyHours: 5, status: 'active' },
  { id: '3', name: 'Chemistry', code: 'CHEM11', class: '11-B', teacherId: '1', teacherName: 'Dr. Rajesh Kumar', weeklyHours: 5, status: 'active' },
  { id: '4', name: 'English Literature', code: 'ENG08', class: '8-B', teacherId: '3', teacherName: 'Mr. Vikram Rao', weeklyHours: 4, status: 'active' },
  { id: '5', name: 'Computer Science', code: 'CS10', class: '10-A', teacherId: '8', teacherName: 'Mrs. Lakshmi Iyer', weeklyHours: 3, status: 'active' },
]

// Attendance Records (deterministic)
export const attendanceRecordsData = [
  { id: '1', entityType: 'student' as const, entityId: '1', name: 'Arjun Sharma', class: '10-A', date: '2024-06-28', status: 'present' as const, checkIn: '08:45', checkOut: '03:30', remarks: '' },
  { id: '2', entityType: 'student' as const, entityId: '2', name: 'Priya Patel', class: '8-B', date: '2024-06-28', status: 'present' as const, checkIn: '08:50', checkOut: '03:30', remarks: '' },
  { id: '3', entityType: 'student' as const, entityId: '3', name: 'Rahul Verma', class: '12-A', date: '2024-06-28', status: 'late' as const, checkIn: '09:15', checkOut: '03:30', remarks: 'Traffic delay' },
  { id: '4', entityType: 'student' as const, entityId: '4', name: 'Sneha Gupta', class: '9-C', date: '2024-06-28', status: 'absent' as const, checkIn: null, checkOut: null, remarks: 'Sick leave' },
  { id: '5', entityType: 'student' as const, entityId: '5', name: 'Amit Kumar', class: '11-B', date: '2024-06-28', status: 'present' as const, checkIn: '08:40', checkOut: '03:30', remarks: '' },
  { id: '6', entityType: 'teacher' as const, entityId: '1', name: 'Dr. Rajesh Kumar', class: 'Science', date: '2024-06-28', status: 'present' as const, checkIn: '08:00', checkOut: '04:00', remarks: '' },
  { id: '7', entityType: 'teacher' as const, entityId: '2', name: 'Mrs. Anita Singh', class: 'Mathematics', date: '2024-06-28', status: 'present' as const, checkIn: '08:05', checkOut: '04:00', remarks: '' },
  { id: '8', entityType: 'teacher' as const, entityId: '4', name: 'Ms. Deepa Nair', class: 'History', date: '2024-06-28', status: 'on-leave' as const, checkIn: null, checkOut: null, remarks: 'Approved sick leave' },
]

// Hostel Rooms
export const hostelRoomsData = [
  { id: '1', roomNo: 'A-101', block: 'Boys Block A', capacity: 4, occupied: 4, floor: 1, warden: 'Mr. Sharma', status: 'full', monthlyFee: 12000 },
  { id: '2', roomNo: 'A-102', block: 'Boys Block A', capacity: 4, occupied: 3, floor: 1, warden: 'Mr. Sharma', status: 'available', monthlyFee: 12000 },
  { id: '3', roomNo: 'B-201', block: 'Girls Block B', capacity: 3, occupied: 3, floor: 2, warden: 'Mrs. Nair', status: 'full', monthlyFee: 14000 },
  { id: '4', roomNo: 'B-202', block: 'Girls Block B', capacity: 3, occupied: 2, floor: 2, warden: 'Mrs. Nair', status: 'available', monthlyFee: 14000 },
]

// Inventory Items
export const inventoryData = [
  { id: '1', name: 'Desktop Computer', category: 'IT Equipment', sku: 'IT-DC-001', quantity: 45, minStock: 10, unit: 'pcs', location: 'Computer Lab', status: 'in-stock', lastRestocked: '2024-06-10' },
  { id: '2', name: 'Chemistry Lab Kit', category: 'Lab Supplies', sku: 'LAB-CH-012', quantity: 8, minStock: 15, unit: 'sets', location: 'Lab 2', status: 'low-stock', lastRestocked: '2024-05-20' },
  { id: '3', name: 'Whiteboard Markers', category: 'Stationery', sku: 'ST-WB-050', quantity: 120, minStock: 50, unit: 'pcs', location: 'Store Room', status: 'in-stock', lastRestocked: '2024-06-25' },
  { id: '4', name: 'Sports Football', category: 'Sports', sku: 'SP-FB-010', quantity: 5, minStock: 10, unit: 'pcs', location: 'Sports Room', status: 'low-stock', lastRestocked: '2024-04-15' },
]

// Billing / Subscription
export const billingPlansData = [
  { id: '1', planName: 'Enterprise', schools: 3, monthlyAmount: 49999, status: 'active', renewalDate: '2025-06-30', features: ['Unlimited students', 'All modules', 'Priority support'] },
  { id: '2', planName: 'Pro', schools: 1, monthlyAmount: 19999, status: 'active', renewalDate: '2025-03-15', features: ['Up to 2000 students', 'Core modules', 'Email support'] },
]

export const invoicesData = [
  { id: '1', invoiceNo: 'SUB-2024-001', plan: 'Enterprise', amount: 49999, status: 'paid', date: '2024-06-01', dueDate: '2024-06-01' },
  { id: '2', invoiceNo: 'SUB-2024-002', plan: 'Enterprise', amount: 49999, status: 'paid', date: '2024-05-01', dueDate: '2024-05-01' },
  { id: '3', invoiceNo: 'SUB-2024-003', plan: 'Enterprise', amount: 49999, status: 'pending', date: '2024-07-01', dueDate: '2024-07-15' },
]

// School Settings
export const schoolSettings = {
  schoolName: 'Sunrise International School',
  email: 'info@sunriseschool.edu',
  phone: '+91 22 4567 8900',
  address: '123 Education Lane, Andheri West',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400058',
  website: 'www.sunriseschool.edu',
  principalName: 'Dr. Meera Krishnan',
  establishedYear: 1995,
  affiliationNumber: 'CBSE/2020/1234567',
  affiliationBoard: 'CBSE',
  logo: '/logo.png',
  academicYear: '2024-25',
  feeStructure: {
    admissionFee: 50000,
    tuitionFeeMonthly: 8000,
    transportFeeMonthly: 3000,
    libraryFeeAnnual: 2000,
    labFeeAnnual: 5000,
  },
}
