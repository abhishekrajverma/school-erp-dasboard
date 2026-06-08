export type FinancialYearEntryDto = {
  id: string
  name: string
  startDate: string
  endDate: string
  isCurrent: boolean
}

export type FinancialYearSettingsDto = {
  years: FinancialYearEntryDto[]
  defaultYear: string
  hideInUi: boolean
}

export type SetCurrentFinancialYearRequest = {
  name: string
}
