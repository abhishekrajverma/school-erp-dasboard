export type PlanKey = 'starter' | 'professional' | 'enterprise'

export type EnquiryStatus = 'new' | 'contacted' | 'approved' | 'rejected'

export type SchoolStatus = 'pending' | 'live' | 'suspended'

export type SchoolEnquiry = {
  id: string
  planKey: PlanKey
  planName: string
  schoolName: string
  schoolCode: string
  schoolEmail: string
  contactNumber: string
  principalName: string
  website: string
  address: string
  city: string
  state: string
  country: string
  studentStrength: string
  status: EnquiryStatus
  notes: string
  createdAt: string
  updatedAt: string
}

export type ManagedSchool = {
  id: string
  slug: string
  name: string
  planKey: PlanKey
  planName: string
  status: SchoolStatus
  enquiryId?: string
  schoolCode: string
  schoolEmail: string
  contactNumber: string
  principalName: string
  city: string
  state: string
  studentStrength: string
  activatedAt?: string
  createdAt: string
  updatedAt: string
}

export type CompanyStore = {
  enquiries: SchoolEnquiry[]
  schools: ManagedSchool[]
}

export type CreateEnquiryInput = Omit<
  SchoolEnquiry,
  'id' | 'status' | 'notes' | 'createdAt' | 'updatedAt'
>

export type CompanyOverview = {
  totalEnquiries: number
  newEnquiries: number
  liveSchools: number
  pendingSchools: number
  suspendedSchools: number
  byPlan: Record<PlanKey, number>
}
