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
  /** Main event / action date */
  eventDate: string
  eventEndDate?: string
  audience: string
  isPinned?: boolean
  details: NoticeDetailItem[]
  actionLabel?: string
  actionHint?: string
}

export const parentNoticesData: ParentNotice[] = [
  {
    id: 'n-ptm-1',
    type: 'ptm',
    title: 'Parent–Teacher Meeting (PTM) — Term II',
    summary:
      'Mandatory PTM for all parents to discuss academic progress, attendance, and term goals with class teachers.',
    priority: 'high',
    publishedDate: '2024-06-15',
    eventDate: '2024-06-22',
    audience: 'All parents · Classes 6–12',
    isPinned: true,
    actionLabel: 'Add to calendar',
    actionHint: 'Arrive 15 minutes before your slot',
    details: [
      { label: 'Date', value: 'Saturday, 22 June 2024' },
      { label: 'Reporting time', value: '9:45 AM (please be seated by 10:00 AM)' },
      { label: 'Meeting hours', value: '10:00 AM – 2:00 PM' },
      { label: 'Venue', value: 'Block A — Your child\'s classroom & Hall B for group briefing' },
      { label: 'Class-wise slots', value: '10:00–11:00 AM · Classes 6–8  |  11:30 AM–1:00 PM · Classes 9–10  |  1:30–2:00 PM · Classes 11–12' },
      { label: 'Agenda', value: 'Report card review · Attendance · Behaviour · Summer goals · Optional subject choices' },
      { label: 'Documents to bring', value: 'School ID card · Term I report card · Notebook samples (if requested by teacher)' },
      { label: 'Dress code', value: 'Formal / semi-formal attire requested' },
      { label: 'Coordinator', value: 'Mrs. Anita Singh (Academic Coordinator)' },
      { label: 'Helpline', value: '+91 22 4567 8901 (Transport desk ext. 204)' },
      { label: 'RSVP deadline', value: '20 June 2024 via parent portal or class WhatsApp group' },
    ],
  },
  {
    id: 'n-event-1',
    type: 'event',
    title: 'Annual Day Celebration 2024',
    summary:
      'Grand cultural programme featuring dance, music, and awards. Parents are invited as guests of honour.',
    priority: 'high',
    publishedDate: '2024-06-18',
    eventDate: '2024-07-15',
    audience: 'All students & parents',
    details: [
      { label: 'Date', value: 'Monday, 15 July 2024' },
      { label: 'Venue', value: 'School Auditorium & Main Ground' },
      { label: 'Parent entry', value: '4:30 PM (gates open 4:00 PM)' },
      { label: 'Programme start', value: '5:00 PM sharp' },
      { label: 'Expected end', value: '8:30 PM' },
      { label: 'Seating', value: 'Pre-assigned by class — check SMS on 12 July' },
      { label: 'Dress code', value: 'Students: costume as per class teacher · Parents: smart casual' },
      { label: 'Parking', value: 'Gate 2 only · No entry from Gate 1 on event day' },
      { label: 'Refreshments', value: 'Light snacks for parents in Hall C after prize distribution' },
    ],
  },
  {
    id: 'n-holiday-1',
    type: 'holiday',
    title: 'Summer Vacation — School Closed',
    summary:
      'School will remain closed for summer break. Reopening and new session details are below.',
    priority: 'high',
    publishedDate: '2024-06-28',
    eventDate: '2024-05-01',
    eventEndDate: '2024-06-15',
    audience: 'All students',
    details: [
      { label: 'Vacation period', value: '1 May 2024 – 15 June 2024' },
      { label: 'School reopens', value: 'Monday, 17 June 2024' },
      { label: 'Reporting time (Day 1)', value: '8:00 AM – 8:30 AM' },
      { label: 'Summer homework', value: 'Submit on reopening day — download from Academics tab' },
      { label: 'Office hours (break)', value: 'Mon–Fri 10 AM – 1 PM only at admin block' },
      { label: 'Transport', value: 'Buses resume regular routes from 17 June' },
      { label: 'Contact', value: 'info@sunriseschool.edu · +91 22 4567 8900' },
    ],
  },
  {
    id: 'n-sports-1',
    type: 'sports',
    title: 'Sports Day Registration Open',
    summary:
      'Register your child for track & field events. Trials will be held before the main sports meet.',
    priority: 'medium',
    publishedDate: '2024-06-10',
    eventDate: '2024-06-20',
    eventEndDate: '2024-07-05',
    audience: 'Classes 5–12',
    details: [
      { label: 'Registration deadline', value: '5 July 2024' },
      { label: 'Trial dates', value: '20–22 June 2024 · 7:00 AM at sports ground' },
      { label: 'Main sports day', value: 'Saturday, 10 August 2024' },
      { label: 'Events', value: '100m · 200m · Relay · Long jump · Shot put · Kabaddi (senior)' },
      { label: 'Medical', value: 'Fitness certificate required for track events' },
      { label: 'Kit', value: 'House colour T-shirt will be issued — ₹350 via fees module' },
      { label: 'Register via', value: 'Class teacher or sports department counter' },
    ],
  },
  {
    id: 'n-academic-1',
    type: 'academic',
    title: 'Mid-Term Examination Schedule',
    summary:
      'Mid-term exams for all classes. Timetable and exam rules are published below.',
    priority: 'medium',
    publishedDate: '2024-06-12',
    eventDate: '2024-07-15',
    eventEndDate: '2024-07-23',
    audience: 'Classes 6–12',
    details: [
      { label: 'Exam period', value: '15 July – 23 July 2024' },
      { label: 'Hall ticket', value: 'Available from 10 July on student portal' },
      { label: 'Reporting time', value: '8:45 AM · Exam starts 9:00 AM' },
      { label: 'Duration', value: '3 hours per paper (practicals as per separate sheet)' },
      { label: 'Items allowed', value: 'Pen, geometry box, school ID — no calculators unless specified' },
      { label: 'Leave during exams', value: 'No casual leave — medical leave needs doctor certificate' },
      { label: 'Results', value: 'Expected by 5 August 2024 on portal' },
    ],
  },
  {
    id: 'n-fee-1',
    type: 'fee',
    title: 'Quarter 2 Fee Payment Reminder',
    summary:
      'Fees for April–June quarter are due. Pay online via the parent portal to avoid late fine.',
    priority: 'high',
    publishedDate: '2024-06-20',
    eventDate: '2024-06-30',
    audience: 'All parents',
    details: [
      { label: 'Due date', value: '30 June 2024' },
      { label: 'Late fine', value: '₹100 per day after due date' },
      { label: 'Payment modes', value: 'UPI · Card · Net banking (Fees tab)' },
      { label: 'Components', value: 'Tuition · Transport (if opted) · Activity fee' },
      { label: 'Receipt', value: 'Instant invoice after online payment' },
      { label: 'Accounts office', value: 'Mon–Sat 9 AM – 3 PM for cash/cheque' },
      { label: 'Queries', value: 'fees@sunriseschool.edu · +91 22 4567 8910' },
    ],
    actionLabel: 'Pay fees now',
    actionHint: 'Opens Fees tab in this portal',
  },
  {
    id: 'n-general-1',
    type: 'general',
    title: 'New School Mobile App — Download Link',
    summary:
      'We have launched the EduSync parent app for notices, fees, and attendance. Install before 1 July.',
    priority: 'low',
    publishedDate: '2024-06-05',
    eventDate: '2024-07-01',
    audience: 'All parents',
    details: [
      { label: 'Go-live date', value: '1 July 2024' },
      { label: 'Android', value: 'Play Store — search "EduSync School"' },
      { label: 'iOS', value: 'App Store — search "EduSync School"' },
      { label: 'Login', value: 'Use registered parent email · OTP on first sign-in' },
      { label: 'Support workshop', value: '29 June 2024 · 11 AM · Computer lab (optional)' },
    ],
  },
]

export function getParentNoticesRich(): ParentNotice[] {
  return [...parentNoticesData].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  })
}

export function getNoticeTypeLabel(type: ParentNoticeType): string {
  const labels: Record<ParentNoticeType, string> = {
    ptm: 'PTM',
    event: 'Event',
    holiday: 'Holiday',
    academic: 'Academic',
    fee: 'Fees',
    sports: 'Sports',
    general: 'General',
  }
  return labels[type]
}

export function countNoticesByType(notices: ParentNotice[]) {
  return notices.reduce(
    (acc, n) => {
      acc[n.type] = (acc[n.type] ?? 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
}
