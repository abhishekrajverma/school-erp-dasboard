export const SCHOOL_CONFIG = {
  name: 'Delhi Public School',
  shortName: 'DPS',
  academicSession: '2026-27',
  logoInitials: 'DPS',
} as const

export const ADMISSION_DRAFT_KEY = 'edusync-admission-draft-v1'

export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const

export const CATEGORY_OPTIONS = [
  { value: 'general', label: 'General' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'obc', label: 'OBC' },
  { value: 'ews', label: 'EWS' },
  { value: 'other', label: 'Other' },
] as const

export const BLOOD_GROUP_OPTIONS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
] as const

export const CLASS_OPTIONS = [
  'Nursery',
  'LKG',
  'UKG',
  'Class I',
  'Class II',
  'Class III',
  'Class IV',
  'Class V',
  'Class VI',
  'Class VII',
  'Class VIII',
  'Class IX',
  'Class X',
  'Class XI',
  'Class XII',
] as const

export const ACADEMIC_SESSION_OPTIONS = [
  '2024-25',
  '2025-26',
  '2026-27',
  '2027-28',
] as const

export const BOARD_OPTIONS = [
  'CBSE',
  'ICSE',
  'State Board',
  'IB',
  'IGCSE',
  'Other',
] as const

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const

export const TRANSPORT_SHIFT_OPTIONS = [
  { value: 'morning', label: 'Morning only' },
  { value: 'evening', label: 'Evening only' },
  { value: 'both', label: 'Morning & Evening' },
] as const

export const ADMISSION_STEPS = [
  { id: 'personal', label: 'Personal Details', shortLabel: 'Personal' },
  { id: 'address', label: 'Address', shortLabel: 'Address' },
  { id: 'parents', label: 'Parents', shortLabel: 'Parents' },
  { id: 'academic', label: 'School & References', shortLabel: 'Academic' },
  { id: 'documents', label: 'Documents', shortLabel: 'Documents' },
  { id: 'declaration', label: 'Declaration', shortLabel: 'Declaration' },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review' },
] as const

export type AdmissionStepId = (typeof ADMISSION_STEPS)[number]['id']

export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/pdf',
] as const

export const ALLOWED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.pdf'] as const

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

export const DOCUMENT_FIELDS = [
  {
    key: 'studentPhoto',
    label: 'Student Photograph',
    required: true,
    description: 'Recent passport-size photograph',
  },
  {
    key: 'birthCertificate',
    label: 'Birth Certificate',
    required: true,
    description: 'Official birth certificate issued by authority',
  },
  {
    key: 'fatherPhoto',
    label: "Father's Photograph",
    required: false,
    description: 'Passport-size photograph of father',
  },
  {
    key: 'motherPhoto',
    label: "Mother's Photograph",
    required: false,
    description: 'Passport-size photograph of mother',
  },
  {
    key: 'aadhaarCopy',
    label: 'Aadhaar Card Copy',
    required: false,
    description: 'Student or parent Aadhaar copy',
  },
  {
    key: 'categoryCertificate',
    label: 'Category Certificate',
    required: false,
    description: 'SC/ST/OBC/EWS certificate if applicable',
  },
  {
    key: 'transferCertificate',
    label: 'Transfer Certificate',
    required: false,
    description: 'From previous school if applicable',
  },
  {
    key: 'previousReportCard',
    label: 'Previous Report Card',
    required: false,
    description: 'Last academic year report card',
  },
  {
    key: 'addressProof',
    label: 'Address Proof',
    required: false,
    description: 'Utility bill, ration card, or rental agreement',
  },
] as const

export type DocumentFieldKey = (typeof DOCUMENT_FIELDS)[number]['key']
