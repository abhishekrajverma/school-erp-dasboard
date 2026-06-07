import { createResourceApi } from './create-resource-api'
import type { HostelRoomDto } from './types/resources'

export const hostelApi = createResourceApi<HostelRoomDto>('/hostel/rooms')
