export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },
  tenant: {
    all: ['tenant'] as const,
    current: () => [...queryKeys.tenant.all, 'current'] as const,
  },
  students: {
    all: ['students'] as const,
    lists: () => [...queryKeys.students.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.students.lists(), filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.students.all, 'detail', id] as const,
  },
  teachers: {
    all: ['teachers'] as const,
    lists: () => [...queryKeys.teachers.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.teachers.lists(), filters ?? {}] as const,
    detail: (id: string) => [...queryKeys.teachers.all, 'detail', id] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    overview: () => [...queryKeys.dashboard.all, 'overview'] as const,
  },
  fees: {
    all: ['fees'] as const,
    lists: () => [...queryKeys.fees.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.fees.lists(), filters ?? {}] as const,
  },
  attendance: {
    all: ['attendance'] as const,
    lists: () => [...queryKeys.attendance.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.attendance.lists(), filters ?? {}] as const,
  },
  admissions: {
    all: ['admissions'] as const,
    lists: () => [...queryKeys.admissions.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.admissions.lists(), filters ?? {}] as const,
  },
  parents: {
    all: ['parents'] as const,
    lists: () => [...queryKeys.parents.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.parents.lists(), filters ?? {}] as const,
  },
  exams: {
    all: ['exams'] as const,
    lists: () => [...queryKeys.exams.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.exams.lists(), filters ?? {}] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.notifications.lists(), filters ?? {}] as const,
  },
  leave: {
    all: ['leave'] as const,
    lists: () => [...queryKeys.leave.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.leave.lists(), filters ?? {}] as const,
  },
  payroll: {
    all: ['payroll'] as const,
    lists: () => [...queryKeys.payroll.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.payroll.lists(), filters ?? {}] as const,
  },
  timetable: {
    all: ['timetable'] as const,
    lists: () => [...queryKeys.timetable.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.timetable.lists(), filters ?? {}] as const,
  },
  hostel: {
    all: ['hostel'] as const,
    lists: () => [...queryKeys.hostel.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.hostel.lists(), filters ?? {}] as const,
  },
  inventory: {
    all: ['inventory'] as const,
    lists: () => [...queryKeys.inventory.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.inventory.lists(), filters ?? {}] as const,
  },
  academics: {
    all: ['academics'] as const,
    classes: () => [...queryKeys.academics.all, 'classes'] as const,
    subjects: () => [...queryKeys.academics.all, 'subjects'] as const,
  },
  transport: {
    all: ['transport'] as const,
    routes: () => [...queryKeys.transport.all, 'routes'] as const,
    vehicles: () => [...queryKeys.transport.all, 'vehicles'] as const,
  },
  library: {
    all: ['library'] as const,
    books: () => [...queryKeys.library.all, 'books'] as const,
    issues: () => [...queryKeys.library.all, 'issues'] as const,
  },
  parentPortal: {
    all: ['parent-portal'] as const,
    me: () => [...queryKeys.parentPortal.all, 'me'] as const,
    children: () => [...queryKeys.parentPortal.all, 'children'] as const,
    childFees: (childId: string) =>
      [...queryKeys.parentPortal.all, 'fees', childId] as const,
    childAttendance: (childId: string, filters?: Record<string, unknown>) =>
      [...queryKeys.parentPortal.all, 'attendance', childId, filters ?? {}] as const,
    childTransport: (childId: string) =>
      [...queryKeys.parentPortal.all, 'transport', childId] as const,
  },
  teacherPortal: {
    all: ['teacher-portal'] as const,
    me: () => [...queryKeys.teacherPortal.all, 'me'] as const,
    leaves: () => [...queryKeys.teacherPortal.all, 'leaves'] as const,
    payroll: () => [...queryKeys.teacherPortal.all, 'payroll'] as const,
    timetable: (filters?: Record<string, unknown>) =>
      [...queryKeys.teacherPortal.all, 'timetable', filters ?? {}] as const,
  },
  studentPortal: {
    all: ['student-portal'] as const,
    me: () => [...queryKeys.studentPortal.all, 'me'] as const,
    fees: () => [...queryKeys.studentPortal.all, 'fees'] as const,
    attendance: () => [...queryKeys.studentPortal.all, 'attendance'] as const,
    exams: () => [...queryKeys.studentPortal.all, 'exams'] as const,
    timetable: () => [...queryKeys.studentPortal.all, 'timetable'] as const,
    libraryIssues: () => [...queryKeys.studentPortal.all, 'library-issues'] as const,
  },
} as const
