import { createResourceApi } from './create-resource-api'
import type { LeaveRequestDto } from './types/resources'

export const leaveApi = createResourceApi<LeaveRequestDto>('/leave-requests')
