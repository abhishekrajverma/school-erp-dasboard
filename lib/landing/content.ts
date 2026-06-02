import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Bell,
  Bus,
  CalendarCheck,
  ClipboardList,
  Cloud,
  CreditCard,
  FileText,
  Fingerprint,
  GraduationCap,
  ShieldCheck,
  Library,
  Lock,
  Smartphone,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'

export const brand = {
  name: 'EduSync',
  tagline: 'India’s #1 Multi-Tenant School ERP',
  domain: 'edusync.in',
}

export const hero = {
  badge: 'Now with AI Insights & WhatsApp Alerts',
  headline: 'Run Your Entire School From One Powerful ERP Platform',
  headlineAccent: 'Powerful ERP Platform',
  subheadline:
    'Admissions, attendance, fees, exams, transport, payroll, parent apps, and real-time analytics — all on secure cloud infrastructure built for CBSE, ICSE, State Board & international schools.',
  primaryCta: 'Start 14-Day Free Trial',
  secondaryCta: 'Explore Live Demo',
  note: 'No credit card required · Setup in under 15 minutes',
}

export const trustBadges = [
  { label: '99.9% Uptime SLA', icon: Cloud },
  { label: 'ISO-Aligned Security', icon: Lock },
  { label: 'Daily Auto Backups', icon: Zap },
  { label: 'Multi-Tenant Isolation', icon: Fingerprint },
  { label: 'RBAC & Audit Logs', icon: ShieldCheck },
]

export const stats = [
  { value: 3240, suffix: '+', label: 'Schools & Institutes', detail: 'Across 28 states' },
  { value: 2.4, suffix: 'M+', label: 'Students Managed', detail: 'K-12 to higher ed' },
  { value: 847, suffix: 'Cr+', label: 'Fees Collected', detail: 'Via Razorpay & UPI' },
  { value: 18, suffix: 'M+', label: 'Notifications Sent', detail: 'SMS, email & WhatsApp' },
]

export const marqueeSchools = [
  'Delhi Public Academy',
  'Green Valley International',
  'Sunrise Coaching Hub',
  'Heritage Global School',
  'National Public School',
  'Bright Minds College',
  'Little Scholars Pre-School',
  'Metro Elite Institute',
]

export const techStack = [
  { name: 'Next.js 16', desc: 'Edge-ready frontend' },
  { name: 'PostgreSQL', desc: 'Tenant-isolated data' },
  { name: 'Razorpay', desc: 'UPI & card payments' },
  { name: 'Redis', desc: 'Real-time caching' },
  { name: 'WebSockets', desc: 'Live attendance sync' },
  { name: 'OpenAPI', desc: 'Enterprise integrations' },
]

export interface FeatureItem {
  name: string
  description: string
  icon: LucideIcon
  metric: string
  span?: 'wide' | 'tall' | 'default'
  gradient: string
}

export const features: FeatureItem[] = [
  {
    name: 'Smart Admissions',
    description: 'Online forms, document OCR, merit lists, and seat allocation with automated parent notifications.',
    icon: ClipboardList,
    metric: '68% faster enrolment',
    span: 'wide',
    gradient: 'from-violet-500/20 to-indigo-600/5',
  },
  {
    name: 'Student 360°',
    description: 'Complete lifecycle from admission to alumni with health, transport, and academic history.',
    icon: GraduationCap,
    metric: '1 profile · all modules',
    gradient: 'from-blue-500/20 to-cyan-600/5',
  },
  {
    name: 'Live Attendance',
    description: 'Biometric, RFID, or mobile marking with instant parent SMS and defaulter dashboards.',
    icon: CalendarCheck,
    metric: '93.8% avg daily rate',
    span: 'tall',
    gradient: 'from-emerald-500/20 to-teal-600/5',
  },
  {
    name: 'Fee Automation',
    description: 'Installments, concessions, late fees, receipts, and Razorpay settlement reconciliation.',
    icon: CreditCard,
    metric: '₹2.1L collected/day avg',
    gradient: 'from-amber-500/20 to-orange-600/5',
  },
  {
    name: 'Exam Intelligence',
    description: 'Schedules, hall tickets, OMR import, grade books, and report card generation in one click.',
    icon: FileText,
    metric: '12 report types',
    gradient: 'from-rose-500/20 to-pink-600/5',
  },
  {
    name: 'Parent App',
    description: 'Fees, homework, circulars, bus tracking, and two-way messaging on iOS & Android.',
    icon: Smartphone,
    metric: '4.8★ app rating',
    span: 'wide',
    gradient: 'from-fuchsia-500/20 to-purple-600/5',
  },
  {
    name: 'Teacher Workspace',
    description: 'Timetable, lesson plans, assignments, and class performance at a glance.',
    icon: Users,
    metric: '40% less admin time',
    gradient: 'from-sky-500/20 to-blue-600/5',
  },
  {
    name: 'Payroll & HR',
    description: 'Salary structures, PF/ESI, leave policies, and payslip distribution.',
    icon: Wallet,
    metric: 'Compliant with Indian payroll',
    gradient: 'from-lime-500/20 to-green-600/5',
  },
  {
    name: 'Transport GPS',
    description: 'Routes, stops, live bus map, and parent alerts when the vehicle is near.',
    icon: Bus,
    metric: '26 buses tracked live',
    gradient: 'from-orange-500/20 to-red-600/5',
  },
  {
    name: 'Library & Inventory',
    description: 'ISBN catalog, issue/return, stock alerts, and asset depreciation.',
    icon: Library,
    metric: '14K books catalogued',
    gradient: 'from-indigo-500/20 to-violet-600/5',
  },
  {
    name: 'Broadcast Hub',
    description: 'WhatsApp, SMS, email, and in-app push for fees due, events, and emergencies.',
    icon: Bell,
    metric: '98% delivery rate',
    gradient: 'from-yellow-500/20 to-amber-600/5',
  },
  {
    name: 'Executive Analytics',
    description: 'Board-ready dashboards for revenue, attendance trends, and academic outcomes.',
    icon: BarChart3,
    metric: 'Real-time KPI wall',
    span: 'wide',
    gradient: 'from-primary/25 to-chart-2/10',
  },
]

export const testimonials = [
  {
    quote:
      'We migrated 1,800 students from spreadsheets in a weekend. Fee collection jumped 34% in the first term.',
    author: 'Dr. Priya Menon',
    role: 'Principal',
    school: 'Green Valley International, Bengaluru',
    avatar: 'PM',
  },
  {
    quote:
      'Parent complaints dropped sharply once bus tracking and fee receipts went live on the mobile app.',
    author: 'Rahul Sharma',
    role: 'School Owner',
    school: 'Sunrise Coaching Hub, Pune',
    avatar: 'RS',
  },
  {
    quote:
      'The multi-tenant setup let us run 4 branches under one login. Reports that took days now take minutes.',
    author: 'Anita Desai',
    role: 'Administrator',
    school: 'Heritage Global School, Mumbai',
    avatar: 'AD',
  },
]

export const pricing = [
  {
    key: 'starter',
    name: 'Starter',
    price: 2999,
    period: 'month',
    description: 'Perfect for boutique schools & pre-primary chains',
    cta: 'Choose Starter',
    highlight: false,
    features: [
      'Up to 500 students',
      'Admission & student records',
      'Attendance + parent portal',
      'Basic SMS alerts',
      'Standard reports',
      'Email support',
    ],
  },
  {
    key: 'professional',
    name: 'Professional',
    price: 5999,
    period: 'month',
    description: 'Most chosen by growing CBSE/ICSE institutions',
    cta: 'Choose Professional',
    highlight: true,
    features: [
      'Up to 2,000 students',
      'Everything in Starter',
      'Fees, exams & transport',
      'WhatsApp + mobile app',
      'Payroll & HR module',
      'Advanced analytics',
      'Priority chat support',
    ],
  },
  {
    key: 'enterprise',
    name: 'Enterprise',
    price: null,
    period: 'custom',
    description: 'Groups, universities & white-label partners',
    cta: 'Contact Sales',
    highlight: false,
    features: [
      'Unlimited students',
      'All modules + API access',
      'Dedicated infrastructure',
      'Custom domain & branding',
      'SSO & LDAP integration',
      'Dedicated success manager',
      '99.95% SLA',
    ],
  },
]

export const faqs = [
  {
    q: 'How fast can we go live?',
    a: 'Most schools complete onboarding in 15–45 minutes. Import students via Excel, configure classes, and start collecting fees the same day.',
  },
  {
    q: 'Is our data isolated from other schools?',
    a: 'Yes. Each tenant runs on logically isolated databases with encryption at rest, role-based access, and full audit trails.',
  },
  {
    q: 'Do you support Indian payment methods?',
    a: 'Razorpay integration supports UPI, cards, net banking, and automated fee reminders with GST-compliant invoices.',
  },
  {
    q: 'Can parents use a mobile app?',
    a: 'Yes. Branded parent apps are available on Professional and Enterprise plans with push notifications and bus tracking.',
  },
]

export const dashboardPreview = {
  schoolName: 'Delhi Public Academy',
  session: '2025–26',
  kpis: [
    { label: 'Active Students', value: '2,847', change: '+124', up: true },
    { label: 'Fee Collected', value: '₹1.42 Cr', change: '87%', up: true },
    { label: 'Attendance Today', value: '94.2%', change: '+1.2%', up: true },
    { label: 'Pending Admissions', value: '38', change: '12 new', up: false },
  ],
  chartBars: [42, 68, 55, 82, 71, 88, 76, 94, 85, 91, 78, 96],
  activities: [
    { text: 'Fee received — Class 10-A', time: '2m ago', type: 'success' },
    { text: 'Bus Route 7 delayed 8 min', time: '5m ago', type: 'warning' },
    { text: 'New admission: Riya Kapoor', time: '12m ago', type: 'info' },
  ],
}
