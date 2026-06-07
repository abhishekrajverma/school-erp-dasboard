import type { MasterData } from './types'

function currentAcademicYear(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  // April–March academic year (common in India)
  if (month >= 3) return `${year}-${String(year + 1).slice(-2)}`
  return `${year - 1}-${String(year).slice(-2)}`
}

export const DEFAULT_MASTER_DATA: MasterData = {
  academicYear: currentAcademicYear(),
  sessionStartDate: '',
  sessionEndDate: '',
  admissionNumberPrefix: 'ADM',
  admissionNumberStartFrom: 1001,
  admissionNumberPadding: 4,
  rollNumberPrefix: '',
  rollNumberStartFrom: 1,
  employeeIdPrefix: 'EMP',
  employeeIdStartFrom: 1001,
  schoolCode: '',
  defaultSections: 'A, B, C, D',
  classLabelPrefix: 'Class',
  classStartFrom: 'Nursery',
  classEndAt: '12',
  classList: '',
  currency: 'INR',
  currencySymbol: '₹',
  timezone: 'Asia/Kolkata',
  feeDueDayOfMonth: 10,
  lateFeePercent: 2,
  minAttendancePercent: 75,
  workingDays: 'Mon, Tue, Wed, Thu, Fri',
  affiliationBoard: 'CBSE',
  birthdayNavbarEnabled: true,
  birthdayNavbarMessage: 'Happy Birthday, {names}! 🎂',
}
