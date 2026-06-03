import { schoolSettings } from '@/lib/erp-data'
import { DEFAULT_DEMO_TENANT } from '@/lib/tenant/constants'
import type { SchoolWebsite } from './types'
import { slugifySchoolName } from './utils'

const sunriseSlug = slugifySchoolName(schoolSettings.schoolName)

export const DEFAULT_SCHOOL_WEBSITE_SLUG = sunriseSlug

export const schoolWebsitesSeed: SchoolWebsite[] = [
  {
    slug: sunriseSlug,
    tenantId: 'demo-school-001',
    published: true,
    subscriptionPlan: 'enterprise',
    schoolName: schoolSettings.schoolName,
    tagline: 'Nurturing minds, shaping futures since 1995',
    logo: schoolSettings.logo,
    primaryColor: '#4f46e5',
    about:
      'Sunrise International School is a CBSE-affiliated institution committed to holistic education. Our campus blends academic rigour with sports, arts, and community service so every child discovers their strengths.',
    mission:
      'To provide quality education that develops intellectual curiosity, ethical values, and lifelong learning skills.',
    vision:
      'To be a leading school where students excel academically and grow into responsible global citizens.',
    principalName: schoolSettings.principalName,
    principalMessage:
      'Welcome to Sunrise International School. We believe every child deserves an environment where they feel safe, challenged, and inspired. Our dedicated faculty and modern facilities support learners from nursery through senior secondary.',
    establishedYear: schoolSettings.establishedYear,
    affiliationBoard: schoolSettings.affiliationBoard,
    affiliationNumber: schoolSettings.affiliationNumber,
    studentCount: 1840,
    teacherCount: 156,
    email: schoolSettings.email,
    phone: schoolSettings.phone,
    address: schoolSettings.address,
    city: schoolSettings.city,
    state: schoolSettings.state,
    pincode: schoolSettings.pincode,
    socialLinks: {
      facebook: 'https://facebook.com/sunriseschool',
      instagram: 'https://instagram.com/sunriseschool',
      youtube: 'https://youtube.com/@sunriseschool',
    },
    feeStructure: [
      {
        id: 'f1',
        name: 'Admission Fee',
        amount: schoolSettings.feeStructure.admissionFee,
        frequency: 'one-time',
        description: 'Payable once at the time of admission',
        classRange: 'All classes',
      },
      {
        id: 'f2',
        name: 'Tuition Fee',
        amount: schoolSettings.feeStructure.tuitionFeeMonthly,
        frequency: 'monthly',
        classRange: 'Class I – X',
      },
      {
        id: 'f3',
        name: 'Tuition Fee (Senior Secondary)',
        amount: 12000,
        frequency: 'monthly',
        classRange: 'Class XI – XII',
      },
      {
        id: 'f4',
        name: 'Transport Fee',
        amount: schoolSettings.feeStructure.transportFeeMonthly,
        frequency: 'monthly',
        description: 'Zone-based routes across Mumbai suburbs',
      },
      {
        id: 'f5',
        name: 'Library Fee',
        amount: schoolSettings.feeStructure.libraryFeeAnnual,
        frequency: 'annual',
      },
      {
        id: 'f6',
        name: 'Laboratory Fee',
        amount: schoolSettings.feeStructure.labFeeAnnual,
        frequency: 'annual',
        description: 'Science, computer, and robotics labs',
      },
      {
        id: 'f7',
        name: 'Smart Class & Digital Resources',
        amount: 4500,
        frequency: 'annual',
      },
      {
        id: 'f8',
        name: 'Sports & Activities',
        amount: 3500,
        frequency: 'annual',
        description: 'Includes inter-house events and coaching',
      },
    ],
    feeNotes:
      'Fees are subject to revision as per school management committee approval. Sibling discount of 10% on tuition fee available. Late payment fine: ₹100 per week after due date.',
    announcements: [
      {
        id: 'a1',
        title: 'Admission Open for 2025–26',
        date: '2025-05-15',
        excerpt: 'Applications are now open for Nursery to Class IX. Limited seats available.',
        body: 'Visit the admissions office or apply online through our portal. Entrance assessment for Class I onwards on 10 June 2025.',
        category: 'admission',
      },
      {
        id: 'a2',
        title: 'Summer Vacation Schedule',
        date: '2025-04-28',
        excerpt: 'School closes from 1 May to 15 June. Reopening on 16 June 2025.',
        category: 'holiday',
      },
      {
        id: 'a3',
        title: 'CBSE Class X Board Results',
        date: '2025-05-10',
        excerpt: 'Congratulations! 98.2% pass rate with 45 students scoring above 90%.',
        category: 'exam',
      },
      {
        id: 'a4',
        title: 'Annual Day Celebration',
        date: '2025-03-20',
        excerpt: 'Join us on 25 March at 5 PM for cultural performances and prize distribution.',
        category: 'event',
      },
    ],
    facilities: [
      'Smart Classrooms',
      'Science & Robotics Labs',
      'Library & Reading Room',
      'Sports Complex',
      'Swimming Pool',
      'Auditorium',
      'Transport Fleet',
      'Medical Room',
      'Cafeteria',
      'Wi-Fi Campus',
    ],
    admissionOpen: true,
    admissionDeadline: '2025-06-30',
    admissionProcess: [
      'Fill the online enquiry form or visit the admissions office',
      'Submit documents: birth certificate, previous report card, address proof',
      'Schedule interaction / assessment (where applicable)',
      'Receive admission offer and pay registration fee',
      'Complete fee payment and uniform booking before session start',
    ],
    officeHours: 'Mon – Sat, 8:00 AM – 2:00 PM',
  },
  {
    slug: DEFAULT_DEMO_TENANT.slug,
    tenantId: DEFAULT_DEMO_TENANT.id,
    published: true,
    subscriptionPlan: 'professional',
    schoolName: DEFAULT_DEMO_TENANT.name,
    tagline: 'Excellence in education for every learner',
    logo: '/logo.png',
    primaryColor: '#0d9488',
    about:
      'Demo International School offers a balanced curriculum with focus on STEM, languages, and co-curricular activities in a supportive learning community.',
    mission: 'Empower students with knowledge, skills, and values for a changing world.',
    vision: 'A school where innovation and compassion go hand in hand.',
    principalName: 'Mrs. Ananya Sharma',
    principalMessage:
      'We welcome families who seek a nurturing yet ambitious education for their children. Our team is here to guide you at every step.',
    establishedYear: 2010,
    affiliationBoard: 'CBSE',
    affiliationNumber: 'CBSE/2010/987654',
    studentCount: 920,
    teacherCount: 68,
    email: 'info@demointernational.edu',
    phone: '+91 11 2345 6789',
    address: '45 Knowledge Park, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201309',
    socialLinks: {},
    feeStructure: [
      { id: 'd1', name: 'Admission Fee', amount: 25000, frequency: 'one-time', classRange: 'All classes' },
      { id: 'd2', name: 'Tuition Fee', amount: 6500, frequency: 'monthly', classRange: 'Class I – VIII' },
      { id: 'd3', name: 'Tuition Fee', amount: 8500, frequency: 'monthly', classRange: 'Class IX – XII' },
      { id: 'd4', name: 'Transport Fee', amount: 2200, frequency: 'monthly' },
      { id: 'd5', name: 'Annual Charges', amount: 8000, frequency: 'annual', description: 'Lab, library, and activity fee combined' },
    ],
    feeNotes: 'Professional plan includes public website and parent portal access.',
    announcements: [
      {
        id: 'da1',
        title: 'Parent–Teacher Meeting',
        date: '2025-06-01',
        excerpt: 'PTM scheduled for 8 June. Slots will be shared via SMS.',
        category: 'general',
      },
    ],
    facilities: ['Digital Classrooms', 'Computer Lab', 'Playground', 'Music Room', 'Counselling Centre'],
    admissionOpen: true,
    admissionDeadline: '2025-07-15',
    admissionProcess: [
      'Submit enquiry form',
      'Document verification',
      'Student interaction',
      'Fee payment and enrollment',
    ],
    officeHours: 'Mon – Fri, 9:00 AM – 3:00 PM',
  },
  {
    slug: 'green-valley-academy',
    tenantId: 'TEN-GREEN-2024',
    published: true,
    subscriptionPlan: 'starter',
    schoolName: 'Green Valley Academy',
    tagline: 'Small classes. Big dreams.',
    logo: '/logo.png',
    primaryColor: '#16a34a',
    about:
      'Green Valley Academy is a boutique school serving pre-primary and primary learners with personalised attention and nature-based learning.',
    mission: 'Build strong foundations through play, discovery, and care.',
    vision: 'Every child confident, curious, and kind.',
    principalName: 'Mr. Rohit Mehta',
    principalMessage:
      'Our intimate campus lets us know every child by name. We partner closely with parents for the early years journey.',
    establishedYear: 2018,
    affiliationBoard: 'State Board',
    affiliationNumber: 'MH/EDU/2018/4421',
    studentCount: 380,
    teacherCount: 32,
    email: 'hello@greenvalley.edu',
    phone: '+91 20 4455 6677',
    address: '12 Valley Road, Baner',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411045',
    socialLinks: { instagram: 'https://instagram.com/greenvalleyacademy' },
    feeStructure: [
      { id: 'g1', name: 'Registration Fee', amount: 5000, frequency: 'one-time' },
      { id: 'g2', name: 'Monthly Fee', amount: 4500, frequency: 'monthly', classRange: 'Nursery – UKG' },
      { id: 'g3', name: 'Monthly Fee', amount: 5500, frequency: 'monthly', classRange: 'Class I – V' },
    ],
    announcements: [],
    facilities: ['Activity Room', 'Sand Pit', 'Organic Garden', 'Day Care'],
    admissionOpen: true,
    admissionProcess: ['Visit campus', 'Submit application', 'Confirm seat with deposit'],
    officeHours: 'Mon – Sat, 9:00 AM – 1:00 PM',
  },
]

export function getSeedSchoolWebsite(slug: string): SchoolWebsite | null {
  return schoolWebsitesSeed.find((site) => site.slug === slug) ?? null
}

export function getAllPublishedSchoolSlugs(): string[] {
  return schoolWebsitesSeed.filter((site) => site.published).map((site) => site.slug)
}
