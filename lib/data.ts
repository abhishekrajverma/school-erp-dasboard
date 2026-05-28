// Realistic School ERP dummy data

export const schools = [
  { id: '1', name: 'Sunrise International School', code: 'SIS', plan: 'Enterprise', city: 'Mumbai' },
  { id: '2', name: 'Green Valley Academy', code: 'GVA', plan: 'Pro', city: 'Delhi' },
  { id: '3', name: 'Cambridge Public School', code: 'CPS', plan: 'Enterprise', city: 'Bangalore' },
]

export const currentSchool = schools[0]

export const dashboardStats = {
  totalStudents: 2847,
  totalTeachers: 156,
  pendingFees: 1245000,
  monthlyRevenue: 8750000,
  attendancePercentage: 94.2,
  salaryPaid: 4250000,
  transportRoutes: 24,
  newAdmissions: 89,
}

export const monthlyFeeCollection = [
  { month: 'Jan', collected: 7200000, pending: 800000 },
  { month: 'Feb', collected: 7800000, pending: 650000 },
  { month: 'Mar', collected: 8100000, pending: 720000 },
  { month: 'Apr', collected: 7500000, pending: 890000 },
  { month: 'May', collected: 8400000, pending: 560000 },
  { month: 'Jun', collected: 8750000, pending: 480000 },
]

export const studentAttendanceData = [
  { day: 'Mon', present: 2680, absent: 167 },
  { day: 'Tue', present: 2712, absent: 135 },
  { day: 'Wed', present: 2695, absent: 152 },
  { day: 'Thu', present: 2701, absent: 146 },
  { day: 'Fri', present: 2650, absent: 197 },
]

export const revenueGrowth = [
  { month: 'Jan', revenue: 7200000, expenses: 5100000 },
  { month: 'Feb', revenue: 7800000, expenses: 5300000 },
  { month: 'Mar', revenue: 8100000, expenses: 5450000 },
  { month: 'Apr', revenue: 7500000, expenses: 5200000 },
  { month: 'May', revenue: 8400000, expenses: 5600000 },
  { month: 'Jun', revenue: 8750000, expenses: 5800000 },
]

export const admissionTrend = [
  { month: 'Jan', admissions: 45 },
  { month: 'Feb', admissions: 38 },
  { month: 'Mar', admissions: 62 },
  { month: 'Apr', admissions: 51 },
  { month: 'May', admissions: 78 },
  { month: 'Jun', admissions: 89 },
]

export const salaryDistribution = [
  { department: 'Teaching', amount: 2850000 },
  { department: 'Administration', amount: 650000 },
  { department: 'Support Staff', amount: 450000 },
  { department: 'Transport', amount: 300000 },
]

export const recentFeePayments = [
  { id: '1', student: 'Arjun Sharma', class: '10-A', amount: 45000, date: '2024-06-15', status: 'completed' },
  { id: '2', student: 'Priya Patel', class: '8-B', amount: 42000, date: '2024-06-15', status: 'completed' },
  { id: '3', student: 'Rahul Verma', class: '12-A', amount: 48000, date: '2024-06-14', status: 'completed' },
  { id: '4', student: 'Sneha Gupta', class: '9-C', amount: 44000, date: '2024-06-14', status: 'pending' },
  { id: '5', student: 'Amit Kumar', class: '11-B', amount: 46000, date: '2024-06-13', status: 'completed' },
]

export const upcomingExams = [
  { id: '1', subject: 'Mathematics', class: '10-A', date: '2024-06-20', time: '09:00 AM' },
  { id: '2', subject: 'Physics', class: '12-A', date: '2024-06-21', time: '09:00 AM' },
  { id: '3', subject: 'English', class: '8-B', date: '2024-06-22', time: '10:00 AM' },
  { id: '4', subject: 'Chemistry', class: '11-B', date: '2024-06-23', time: '09:00 AM' },
]

export const teacherAttendance = [
  { id: '1', name: 'Dr. Rajesh Kumar', department: 'Science', status: 'present', time: '08:15 AM' },
  { id: '2', name: 'Mrs. Anita Singh', department: 'Mathematics', status: 'present', time: '08:20 AM' },
  { id: '3', name: 'Mr. Vikram Rao', department: 'English', status: 'late', time: '08:45 AM' },
  { id: '4', name: 'Ms. Deepa Nair', department: 'History', status: 'absent', time: '-' },
  { id: '5', name: 'Mr. Suresh Menon', department: 'Physics', status: 'present', time: '08:10 AM' },
]

export const pendingSalaryApprovals = [
  { id: '1', name: 'Dr. Rajesh Kumar', amount: 85000, month: 'June 2024', status: 'pending' },
  { id: '2', name: 'Mrs. Anita Singh', amount: 72000, month: 'June 2024', status: 'pending' },
  { id: '3', name: 'Mr. Vikram Rao', amount: 68000, month: 'June 2024', status: 'approved' },
]

export const schoolNotices = [
  { id: '1', title: 'Annual Day Celebration', date: '2024-06-25', priority: 'high' },
  { id: '2', title: 'Parent-Teacher Meeting', date: '2024-06-22', priority: 'medium' },
  { id: '3', title: 'Summer Vacation Notice', date: '2024-06-28', priority: 'high' },
  { id: '4', title: 'Sports Day Registration', date: '2024-06-20', priority: 'low' },
]

export const recentAdmissions = [
  { id: '1', name: 'Aditya Kapoor', class: '6-A', date: '2024-06-15', guardian: 'Mr. Rajiv Kapoor' },
  { id: '2', name: 'Meera Joshi', class: '4-B', date: '2024-06-14', guardian: 'Mrs. Sunita Joshi' },
  { id: '3', name: 'Rohan Das', class: '9-C', date: '2024-06-13', guardian: 'Mr. Amit Das' },
]

export const transportData = [
  { id: '1', route: 'Route A - North Zone', bus: 'MH-01-AB-1234', driver: 'Ramesh Kumar', students: 42, status: 'active' },
  { id: '2', route: 'Route B - South Zone', bus: 'MH-01-CD-5678', driver: 'Sunil Yadav', students: 38, status: 'active' },
  { id: '3', route: 'Route C - East Zone', bus: 'MH-01-EF-9012', driver: 'Mohan Patil', students: 45, status: 'maintenance' },
]

export const todaysClasses = [
  { id: '1', subject: 'Mathematics', class: '10-A', teacher: 'Mrs. Anita Singh', time: '09:00 - 09:45', room: 'Room 201' },
  { id: '2', subject: 'Physics', class: '12-A', teacher: 'Mr. Suresh Menon', time: '10:00 - 10:45', room: 'Lab 1' },
  { id: '3', subject: 'English', class: '8-B', teacher: 'Mr. Vikram Rao', time: '11:00 - 11:45', room: 'Room 105' },
  { id: '4', subject: 'Chemistry', class: '11-B', teacher: 'Dr. Rajesh Kumar', time: '12:00 - 12:45', room: 'Lab 2' },
]

export const students = [
  { id: '1', name: 'Arjun Sharma', class: '10-A', rollNo: '1001', email: 'arjun.s@school.edu', phone: '+91 98765 43210', status: 'active', feeStatus: 'paid', attendance: 96 },
  { id: '2', name: 'Priya Patel', class: '8-B', rollNo: '802', email: 'priya.p@school.edu', phone: '+91 98765 43211', status: 'active', feeStatus: 'pending', attendance: 94 },
  { id: '3', name: 'Rahul Verma', class: '12-A', rollNo: '1201', email: 'rahul.v@school.edu', phone: '+91 98765 43212', status: 'active', feeStatus: 'paid', attendance: 92 },
  { id: '4', name: 'Sneha Gupta', class: '9-C', rollNo: '903', email: 'sneha.g@school.edu', phone: '+91 98765 43213', status: 'active', feeStatus: 'overdue', attendance: 88 },
  { id: '5', name: 'Amit Kumar', class: '11-B', rollNo: '1102', email: 'amit.k@school.edu', phone: '+91 98765 43214', status: 'inactive', feeStatus: 'paid', attendance: 78 },
]

export const teachers = [
  { id: '1', name: 'Dr. Rajesh Kumar', department: 'Science', subject: 'Chemistry', email: 'rajesh.k@school.edu', phone: '+91 98765 12340', salary: 85000, status: 'active' },
  { id: '2', name: 'Mrs. Anita Singh', department: 'Mathematics', subject: 'Mathematics', email: 'anita.s@school.edu', phone: '+91 98765 12341', salary: 72000, status: 'active' },
  { id: '3', name: 'Mr. Vikram Rao', department: 'English', subject: 'English Literature', email: 'vikram.r@school.edu', phone: '+91 98765 12342', salary: 68000, status: 'active' },
  { id: '4', name: 'Ms. Deepa Nair', department: 'History', subject: 'History & Civics', email: 'deepa.n@school.edu', phone: '+91 98765 12343', salary: 65000, status: 'on-leave' },
  { id: '5', name: 'Mr. Suresh Menon', department: 'Science', subject: 'Physics', email: 'suresh.m@school.edu', phone: '+91 98765 12344', salary: 78000, status: 'active' },
]

export const feeRecords = [
  { id: '1', student: 'Arjun Sharma', class: '10-A', totalFee: 120000, paid: 120000, pending: 0, dueDate: '2024-06-30', status: 'paid' },
  { id: '2', student: 'Priya Patel', class: '8-B', totalFee: 100000, paid: 58000, pending: 42000, dueDate: '2024-06-15', status: 'pending' },
  { id: '3', student: 'Rahul Verma', class: '12-A', totalFee: 140000, paid: 140000, pending: 0, dueDate: '2024-06-30', status: 'paid' },
  { id: '4', student: 'Sneha Gupta', class: '9-C', totalFee: 110000, paid: 44000, pending: 66000, dueDate: '2024-05-31', status: 'overdue' },
  { id: '5', student: 'Amit Kumar', class: '11-B', totalFee: 130000, paid: 130000, pending: 0, dueDate: '2024-06-30', status: 'paid' },
]

export const payrollRecords = [
  { id: '1', employee: 'Dr. Rajesh Kumar', department: 'Science', basicSalary: 70000, allowances: 15000, deductions: 5000, netSalary: 80000, status: 'pending' },
  { id: '2', employee: 'Mrs. Anita Singh', department: 'Mathematics', basicSalary: 60000, allowances: 12000, deductions: 4000, netSalary: 68000, status: 'pending' },
  { id: '3', employee: 'Mr. Vikram Rao', department: 'English', basicSalary: 55000, allowances: 13000, deductions: 4500, netSalary: 63500, status: 'approved' },
  { id: '4', employee: 'Ms. Deepa Nair', department: 'History', basicSalary: 52000, allowances: 13000, deductions: 4000, netSalary: 61000, status: 'approved' },
  { id: '5', employee: 'Mr. Suresh Menon', department: 'Science', basicSalary: 65000, allowances: 13000, deductions: 4500, netSalary: 73500, status: 'paid' },
]

export const navigationItems = [
  { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
  { name: 'Students', href: '/students', icon: 'GraduationCap' },
  { name: 'Teachers', href: '/teachers', icon: 'Users' },
  { name: 'Parents', href: '/parents', icon: 'UserCircle' },
  { name: 'Academics', href: '/academics', icon: 'BookOpen' },
  { name: 'Attendance', href: '/attendance', icon: 'CalendarCheck' },
  { name: 'Fees Management', href: '/fees', icon: 'CreditCard' },
  { name: 'Salary & Payroll', href: '/payroll', icon: 'Wallet' },
  { name: 'Transport', href: '/transport', icon: 'Bus' },
  { name: 'Exams', href: '/exams', icon: 'FileText' },
  { name: 'Library', href: '/library', icon: 'Library' },
  { name: 'Hostel', href: '/hostel', icon: 'Building' },
  { name: 'Timetable', href: '/timetable', icon: 'Clock' },
  { name: 'Inventory', href: '/inventory', icon: 'Package' },
  { name: 'HR Management', href: '/hr', icon: 'Briefcase' },
  { name: 'Notifications', href: '/notifications', icon: 'Bell' },
  { name: 'Reports', href: '/reports', icon: 'BarChart3' },
  { name: 'Settings', href: '/settings', icon: 'Settings' },
  { name: 'Billing', href: '/billing', icon: 'Receipt' },
]
