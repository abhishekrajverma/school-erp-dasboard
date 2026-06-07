import { createResourceApi } from './create-resource-api'
import type { ClassDto, SubjectDto } from './types/resources'

export const academicsApi = {
  classes: createResourceApi<ClassDto>('/academics/classes'),
  subjects: createResourceApi<SubjectDto>('/academics/subjects'),
}
