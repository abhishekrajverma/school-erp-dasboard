export type DashboardStats = {
  totalStudents: number
  totalTeachers: number
  pendingFees: number
  monthlyRevenue: number
  attendancePercentage: number
  salaryPaid: number
  transportRoutes: number
  newAdmissions: number
}

export type MonthlyFeePoint = {
  month: string
  collected: number
  pending: number
}

export type AttendanceDayPoint = {
  day: string
  present: number
  absent: number
}

export type DashboardDto = {
  stats: DashboardStats
  monthlyFeeCollection: MonthlyFeePoint[]
  studentAttendance: AttendanceDayPoint[]
  attendanceSummary: {
    today: { present: number; absent: number; late: number; total: number }
    thisWeek: { avgAttendance: number; improvement: number }
    thisMonth: { avgAttendance: number; workingDays: number }
  }
  feeSummary: {
    totalCollected: number
    totalPending: number
    totalOverdue: number
    collectionRate: number
    thisMonth: { collected: number; pending: number }
  }
}
