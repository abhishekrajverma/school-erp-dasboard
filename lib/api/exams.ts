import { createResourceApi } from './create-resource-api'
import type { ExamDto } from './types/resources'

export const examsApi = createResourceApi<ExamDto>('/exams')
