export type ParentNoticeType =
  | 'ptm'
  | 'event'
  | 'holiday'
  | 'academic'
  | 'fee'
  | 'sports'
  | 'general'

export type ParentNoticePriority = 'high' | 'medium' | 'low'

export type NoticeDetailItem = {
  icon?: string
  label: string
  value: string
}

export type ParentNotice = {
  id: string
  type: ParentNoticeType
  title: string
  summary: string
  priority: ParentNoticePriority
  publishedDate: string
  eventDate: string
  eventEndDate?: string
  audience: string
  isPinned?: boolean
  details: NoticeDetailItem[]
  actionLabel?: string
  actionHint?: string
}

const NOTICE_TYPE_LABELS: Record<ParentNoticeType, string> = {
  ptm: 'PTM',
  event: 'Event',
  holiday: 'Holiday',
  academic: 'Academic',
  fee: 'Fee',
  sports: 'Sports',
  general: 'General',
}

export function getNoticeTypeLabel(type: ParentNoticeType): string {
  return NOTICE_TYPE_LABELS[type] ?? 'Notice'
}

export function mapNotificationToParentNotice(notification: {
  id: string
  title: string
  message: string
  type: string
  targetAudience: string
  sentAt: string
}): ParentNotice {
  const type = (['ptm', 'event', 'holiday', 'academic', 'fee', 'sports', 'general'].includes(
    notification.type,
  )
    ? notification.type
    : 'general') as ParentNoticeType

  return {
    id: notification.id,
    type,
    title: notification.title,
    summary: notification.message,
    priority: 'medium',
    publishedDate: notification.sentAt,
    eventDate: notification.sentAt,
    audience: notification.targetAudience,
    details: [{ label: 'Message', value: notification.message }],
  }
}
