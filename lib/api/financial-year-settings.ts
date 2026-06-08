import { api } from './client'
import type {
  FinancialYearSettingsDto,
  SetCurrentFinancialYearRequest,
} from './types/financial-year-settings'

export const financialYearSettingsApi = {
  get: () => api<FinancialYearSettingsDto>('/financial-year-settings'),

  setCurrent: (name: string) =>
    api<FinancialYearSettingsDto>('/financial-year-settings/current', {
      method: 'PUT',
      body: JSON.stringify({ name } satisfies SetCurrentFinancialYearRequest),
    }),
}
