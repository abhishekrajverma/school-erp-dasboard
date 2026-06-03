import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Bell,
  BookOpen,
  Bus,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  FileText,
  GraduationCap,
  MessageCircle,
  Smartphone,
  UserCircle,
  Users,
  Wallet,
} from 'lucide-react'

export type PlatformAudienceId = 'parents' | 'students' | 'teachers' | 'school'

export type PlatformFeature = {
  id: string
  title: string
  summary: string
  details: string[]
  icon: LucideIcon
  audiences: PlatformAudienceId[]
}

export type PlatformAudience = {
  id: PlatformAudienceId
  label: string
  headline: string
  description: string
}

export const platformAudiences: PlatformAudience[] = [
  {
    id: 'parents',
    label: 'For Parents',
    headline: 'Stay connected to your child every day',
    description:
      'Use the Parent Portal on web or our mobile app to see attendance, pay fees, read notices, and track the school bus — without visiting the office.',
  },
  {
    id: 'students',
    label: 'For Students',
    headline: 'Your classes, homework, and results in one place',
    description:
      'Students sign in to view timetables, assignments, exam schedules, and report cards whenever they need them.',
  },
  {
    id: 'teachers',
    label: 'For Teachers',
    headline: 'Less paperwork, more time for teaching',
    description:
      'Mark attendance, upload homework, enter marks, and message parents from a single teacher workspace.',
  },
  {
    id: 'school',
    label: 'For the School Office',
    headline: 'Everything the administration team needs',
    description:
      'Admissions, fees, payroll, transport, library, inventory, and reports — managed securely in the background so families get a smooth experience.',
  },
]

export const parentAppHighlights = [
  {
    title: 'Live attendance',
    description: 'See when your child is marked present, late, or absent — with instant alerts.',
    icon: CalendarCheck,
  },
  {
    title: 'Fee payments',
    description: 'View dues, download receipts, and pay online via UPI, card, or net banking.',
    icon: CreditCard,
  },
  {
    title: 'Bus tracking',
    description: 'Know when the school bus is near your stop with live route updates.',
    icon: Bus,
  },
  {
    title: 'Notices & homework',
    description: 'Circulars, events, and class homework appear in one notifications feed.',
    icon: Bell,
  },
  {
    title: 'Exam & report cards',
    description: 'Access marks, grade cards, and exam timetables as soon as they are published.',
    icon: FileText,
  },
  {
    title: 'Direct messaging',
    description: 'Receive messages from class teachers and reply without sharing personal numbers.',
    icon: MessageCircle,
  },
]

export const platformFeatures: PlatformFeature[] = [
  {
    id: 'parent-portal',
    title: 'Parent Dashboard (Web)',
    summary: 'A secure login for every parent — see all children in one account.',
    details: [
      'Overview of attendance, fees due, and recent notices',
      'Switch between multiple children if you have more than one enrolled',
      'Download fee receipts and payment history',
      'Update contact details and profile information',
    ],
    icon: UserCircle,
    audiences: ['parents'],
  },
  {
    id: 'mobile-app',
    title: 'Parent & Student Mobile App',
    summary: 'iOS and Android app — the same information as the portal, built for your phone.',
    details: [
      'Push notifications for attendance, fees, and emergencies',
      'Track school bus location on a live map',
      'Pay fees and view homework on the go',
      'Works alongside the web portal with one school login',
    ],
    icon: Smartphone,
    audiences: ['parents', 'students'],
  },
  {
    id: 'attendance',
    title: 'Attendance Tracking',
    summary: 'Daily attendance marked in class appears for parents the same day.',
    details: [
      'Monthly attendance charts per child',
      'SMS or app alert if your child is absent',
      'Leave requests can be submitted online where enabled',
    ],
    icon: CalendarCheck,
    audiences: ['parents', 'teachers', 'school'],
  },
  {
    id: 'fees',
    title: 'Online Fee Management',
    summary: 'Transparent fee breakdowns with safe digital payments.',
    details: [
      'Term-wise and annual fee schedules',
      'Partial payments, concessions, and late-fee rules shown clearly',
      'Instant digital receipts after every payment',
      'Reminders before due dates so you never miss a deadline',
    ],
    icon: CreditCard,
    audiences: ['parents', 'school'],
  },
  {
    id: 'transport',
    title: 'Transport & Bus Tracking',
    summary: 'Assigned route, stop, and driver details with optional GPS tracking.',
    details: [
      'See your child’s bus route and pickup/drop timings',
      'Alerts when the vehicle is approaching your stop',
      'Contact transport office from the app in case of delays',
    ],
    icon: Bus,
    audiences: ['parents', 'school'],
  },
  {
    id: 'exams',
    title: 'Exams & Report Cards',
    summary: 'Exam schedules, hall tickets, and results when the school publishes them.',
    details: [
      'Upcoming exam dates by subject',
      'Download report cards and progress summaries',
      'Historical performance to track improvement over terms',
    ],
    icon: FileText,
    audiences: ['parents', 'students', 'teachers'],
  },
  {
    id: 'academics',
    title: 'Timetable & Homework',
    summary: 'Class timetable, subjects, and homework shared by teachers.',
    details: [
      'Weekly class schedule for each child',
      'Homework and study material uploaded by teachers',
      'Academic calendar with holidays and events',
    ],
    icon: BookOpen,
    audiences: ['parents', 'students', 'teachers'],
  },
  {
    id: 'admissions',
    title: 'Online Admissions',
    summary: 'Apply for a seat, upload documents, and track application status online.',
    details: [
      'Digital enquiry and registration forms',
      'Document upload checklist',
      'Status updates from the admissions office',
    ],
    icon: ClipboardList,
    audiences: ['parents', 'school'],
  },
  {
    id: 'notices',
    title: 'Notices & Announcements',
    summary: 'School circulars, events, and emergency alerts in one feed.',
    details: [
      'Category filters: general, exams, holidays, admissions',
      'Push notifications for urgent messages',
      'Archive of past announcements for reference',
    ],
    icon: Bell,
    audiences: ['parents', 'students', 'teachers'],
  },
  {
    id: 'student-portal',
    title: 'Student Portal',
    summary: 'Students view their own timetable, assignments, and results.',
    details: [
      'Personal dashboard with today’s classes',
      'Assignment submissions and deadlines',
      'Library and activity updates where applicable',
    ],
    icon: GraduationCap,
    audiences: ['students'],
  },
  {
    id: 'teacher-portal',
    title: 'Teacher Portal',
    summary: 'Class lists, attendance, marks, and parent communication for staff.',
    details: [
      'Mark attendance from phone or computer',
      'Enter exam marks and generate class reports',
      'Share homework and messages with parents',
    ],
    icon: Users,
    audiences: ['teachers'],
  },
  {
    id: 'payroll',
    title: 'Staff Payroll & HR',
    summary: 'Internal tool for salary, leave, and staff records (school office only).',
    details: [
      'Payslips and leave balances for staff',
      'HR records kept separate from parent-facing apps',
    ],
    icon: Wallet,
    audiences: ['school'],
  },
  {
    id: 'analytics',
    title: 'School Analytics',
    summary: 'Leadership dashboards for attendance trends, fee collection, and academics.',
    details: [
      'Real-time summaries for principals and administrators',
      'Helps the school improve services parents rely on',
    ],
    icon: BarChart3,
    audiences: ['school'],
  },
]

export const accessSteps = [
  {
    step: 1,
    title: 'Get your login from the school',
    description: 'After admission, the office shares your Parent ID or registered mobile/email.',
  },
  {
    step: 2,
    title: 'Sign in on web or download the app',
    description: 'Use Portal Login on this website, or install the app from the App Store / Play Store.',
  },
  {
    step: 3,
    title: 'Add your children',
    description: 'Your account automatically links to enrolled students. Contact the office if any child is missing.',
  },
  {
    step: 4,
    title: 'Turn on notifications',
    description: 'Enable push alerts for attendance, fees, bus, and urgent school messages.',
  },
]

export function getFeaturesForAudience(audience: PlatformAudienceId) {
  return platformFeatures.filter((f) => f.audiences.includes(audience))
}
