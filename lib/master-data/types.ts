/** Tenant-scoped school master data — drives IDs, academic calendar, and defaults. */
export type MasterData = {
  academicYear: string
  sessionStartDate: string
  sessionEndDate: string
  admissionNumberPrefix: string
  admissionNumberStartFrom: number
  admissionNumberPadding: number
  rollNumberPrefix: string
  rollNumberStartFrom: number
  employeeIdPrefix: string
  employeeIdStartFrom: number
  schoolCode: string
  defaultSections: string
  classLabelPrefix: string
  /** School-defined name for the lowest class, e.g. Nursery or Playgroup */
  classStartFrom: string
  /** School-defined name for the highest class, e.g. 12 or Class XII */
  classEndAt: string
  /** Optional comma-separated list of every class in order; overrides auto range */
  classList: string
  currency: string
  currencySymbol: string
  timezone: string
  feeDueDayOfMonth: number
  lateFeePercent: number
  minAttendancePercent: number
  workingDays: string
  affiliationBoard: string
  /** Show navbar birthday greeting when students have birthdays today */
  birthdayNavbarEnabled: boolean
  /** Template: use {names} and {count} placeholders */
  birthdayNavbarMessage: string
}

export const MASTER_DATA_UPDATED_EVENT = 'edusync-master-data-updated'
