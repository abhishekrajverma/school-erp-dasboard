import { createResourceApi } from './create-resource-api'
import type { PayrollRecordDto } from './types/resources'

export const payrollApi = createResourceApi<PayrollRecordDto>('/payroll')
