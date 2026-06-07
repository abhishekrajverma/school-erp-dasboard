import { createResourceApi } from './create-resource-api'
import type { NotificationDto } from './types/resources'

export const notificationsApi = createResourceApi<NotificationDto>('/notifications')
