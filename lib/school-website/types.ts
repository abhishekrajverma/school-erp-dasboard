export type FeeFrequency = 'one-time' | 'monthly' | 'quarterly' | 'annual'

export type SchoolWebsiteFeeItem = {
  id: string
  name: string
  amount: number
  frequency: FeeFrequency
  description?: string
  classRange?: string
}

export type AnnouncementCategory = 'general' | 'exam' | 'holiday' | 'admission' | 'event'

export type SchoolAnnouncement = {
  id: string
  title: string
  date: string
  excerpt: string
  body?: string
  category: AnnouncementCategory
}

export type SubscriptionPlan = 'starter' | 'professional' | 'enterprise'

export type SchoolWebsite = {
  slug: string
  tenantId: string
  published: boolean
  subscriptionPlan: SubscriptionPlan
  schoolName: string
  tagline: string
  logo: string
  primaryColor: string
  about: string
  mission: string
  vision: string
  principalName: string
  principalMessage: string
  establishedYear: number
  affiliationBoard: string
  affiliationNumber: string
  studentCount: number
  teacherCount: number
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  socialLinks: {
    facebook?: string
    instagram?: string
    youtube?: string
  }
  feeStructure: SchoolWebsiteFeeItem[]
  feeNotes?: string
  announcements: SchoolAnnouncement[]
  facilities: string[]
  admissionOpen: boolean
  admissionDeadline?: string
  admissionProcess: string[]
  officeHours: string
}

export type SchoolWebsitePatch = Partial<Omit<SchoolWebsite, 'slug' | 'tenantId'>>
