import { createResourceApi } from './create-resource-api'
import type { ParentDto, CreateParentRequest, UpdateParentRequest } from './types/parents'

export const parentsApi = createResourceApi<ParentDto, CreateParentRequest, UpdateParentRequest>(
  '/parents',
)
