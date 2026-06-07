import { createResourceApi } from './create-resource-api'
import type { TimetableEntryDto } from './types/resources'

export const timetableApi = createResourceApi<TimetableEntryDto>('/timetable')
