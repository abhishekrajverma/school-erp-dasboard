import { z } from 'zod'
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/admission/constants'
import {
  isValidAadhaar,
  isValidEmail,
  isValidIndianMobile,
  isValidPinCode,
  normalizeDigits,
} from '@/lib/admission/validators'

const optionalMobile = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine((val) => !val || isValidIndianMobile(val), {
    message: 'Enter a valid 10-digit Indian mobile number',
  })

const requiredMobile = z
  .string()
  .min(1, 'Mobile number is required')
  .refine(isValidIndianMobile, {
    message: 'Enter a valid 10-digit Indian mobile number',
  })

const optionalAadhaar = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine((val) => !val || isValidAadhaar(val), {
    message: 'Enter a valid 12-digit Aadhaar number',
  })

const optionalEmail = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine((val) => !val || isValidEmail(val), {
    message: 'Enter a valid email address',
  })

const requiredEmail = z
  .string()
  .min(1, 'Email address is required')
  .refine(isValidEmail, { message: 'Enter a valid email address' })

export const uploadedFileMetaSchema = z.object({
  name: z.string(),
  size: z.number().max(MAX_FILE_SIZE_BYTES, 'File must be under 10 MB'),
  type: z
    .string()
    .refine(
      (t) =>
        (ALLOWED_FILE_TYPES as readonly string[]).includes(t) ||
        t === 'image/jpg',
      { message: 'Only JPG, PNG, and PDF files are allowed' },
    ),
  lastModified: z.number(),
  previewUrl: z.string().optional(),
})

export const siblingSchema = z.object({
  name: z.string().optional(),
  admissionNumber: z.string().optional(),
  class: z.string().optional(),
  section: z.string().optional(),
})

const admissionBaseSchema = z.object({
    // Section 1 — Student
    firstName: z.string().min(1, 'First name is required').max(80),
    lastName: z.string().min(1, 'Last name is required').max(80),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Gender is required',
    }),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    placeOfBirth: z.string().min(1, 'Place of birth is required'),
    religion: z.string().min(1, 'Religion is required'),
    category: z.enum(['general', 'sc', 'st', 'obc', 'ews', 'other'], {
      required_error: 'Category is required',
    }),
    aadhaarNumber: optionalAadhaar,
    bloodGroup: z.string().optional(),
    classSought: z.string().min(1, 'Class is required'),
    academicSession: z.string().min(1, 'Academic session is required'),
    previousSchoolTransfer: z.enum(['yes', 'no'], {
      required_error: 'Please specify transfer case',
    }),

    // Section 2 — Address
    houseNumber: z.string().min(1, 'House number is required'),
    street: z.string().min(1, 'Street / locality is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    pinCode: z
      .string()
      .min(1, 'PIN code is required')
      .refine(isValidPinCode, { message: 'Enter a valid 6-digit PIN code' }),
    country: z.string().default('India'),
    primaryMobile: requiredMobile,
    alternateMobile: optionalMobile,
    email: requiredEmail,

    // Transport facility
    optsForTransport: z.enum(['yes', 'no']).default('no'),
    transportRouteId: z.string().optional(),
    transportPickupStop: z.string().optional(),
    transportPickupAddress: z.string().optional(),
    transportShift: z.enum(['morning', 'evening', 'both']).optional(),

    // Section 3 — Father
    fatherName: z.string().min(1, "Father's name is required"),
    fatherQualification: z.string().optional(),
    fatherOccupation: z.string().min(1, 'Occupation is required'),
    fatherOrganization: z.string().optional(),
    fatherOfficeAddress: z.string().optional(),
    fatherOfficePhone: z.string().optional(),
    fatherMobile: requiredMobile,
    fatherAnnualIncome: z.string().optional(),
    fatherAadhaar: optionalAadhaar,
    fatherEmail: optionalEmail,

    // Section 4 — Mother
    motherName: z.string().min(1, "Mother's name is required"),
    motherQualification: z.string().optional(),
    motherOccupation: z.string().optional(),
    motherOrganization: z.string().optional(),
    motherOfficeAddress: z.string().optional(),
    motherOfficePhone: z.string().optional(),
    motherMobile: requiredMobile,
    motherAnnualIncome: z.string().optional(),
    motherAadhaar: optionalAadhaar,
    motherEmail: optionalEmail,

    // Section 5 — Guardian
    livesWithGuardian: z.enum(['yes', 'no']).default('no'),
    guardianName: z.string().optional(),
    guardianRelationship: z.string().optional(),
    guardianOccupation: z.string().optional(),
    guardianMobile: optionalMobile,
    guardianEmail: optionalEmail,
    guardianAddress: z.string().optional(),

    // Section 6 — Previous school
    passingYear: z.string().optional(),
    previousSchoolName: z.string().optional(),
    previousSchoolArea: z.string().optional(),
    previousBoard: z.string().optional(),
    previousPercentage: z.string().optional(),
    reasonForLeaving: z.string().optional(),

    // Section 7 — Siblings
    siblingInSameSchool: z.enum(['yes', 'no']).default('no'),
    siblings: z.array(siblingSchema).default([]),

    // Section 8 — Reference
    referenceName: z.string().optional(),
    referenceMobile: optionalMobile,
    referenceAddress: z.string().optional(),
    referenceRelationship: z.string().optional(),

    // Section 9 — Documents (metadata only in form state)
    studentPhoto: uploadedFileMetaSchema.nullable(),
    birthCertificate: uploadedFileMetaSchema.nullable(),
    fatherPhoto: uploadedFileMetaSchema.nullable(),
    motherPhoto: uploadedFileMetaSchema.nullable(),
    aadhaarCopy: uploadedFileMetaSchema.nullable(),
    categoryCertificate: uploadedFileMetaSchema.nullable(),
    transferCertificate: uploadedFileMetaSchema.nullable(),
    previousReportCard: uploadedFileMetaSchema.nullable(),
    addressProof: uploadedFileMetaSchema.nullable(),

    // Section 10 — Declaration
    declarationTruth: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the declaration' }),
    }),
    declarationPolicy: z.literal(true, {
      errorMap: () => ({ message: 'You must agree to admission policies' }),
    }),
    parentSignature: z.string().min(2, 'Parent signature is required'),
    studentSignature: z.string().min(2, 'Student signature is required'),
    declarationDate: z.string(),
})

function admissionRefine<T extends z.ZodTypeAny>(schema: T) {
  return schema.superRefine(
    (data: z.infer<typeof admissionBaseSchema>, ctx: z.RefinementCtx) => {
      if (data.livesWithGuardian === 'yes') {
        if (!data.guardianName?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Guardian name is required',
            path: ['guardianName'],
          })
        }
        if (!data.guardianMobile?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Guardian mobile is required',
            path: ['guardianMobile'],
          })
        }
      }

      if (data.optsForTransport === 'yes') {
        if (!data.transportRouteId?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select a transport route',
            path: ['transportRouteId'],
          })
        }
        if (!data.transportPickupStop?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Pickup stop / landmark is required',
            path: ['transportPickupStop'],
          })
        }
        if (!data.transportPickupAddress?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Pickup address is required',
            path: ['transportPickupAddress'],
          })
        }
        if (!data.transportShift) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Please select transport shift',
            path: ['transportShift'],
          })
        }
      }
    },
  )
}

export const admissionFormSchema = admissionRefine(admissionBaseSchema)

/** Draft schema — relaxed declaration for auto-save */
export const admissionDraftSchema = admissionBaseSchema.partial().extend({
  declarationTruth: z.boolean().optional(),
  declarationPolicy: z.boolean().optional(),
  currentStep: z.string().optional(),
  lastSavedAt: z.string().optional(),
})

export const admissionDefaultValues: z.input<typeof admissionBaseSchema> = {
  firstName: '',
  lastName: '',
  gender: 'male',
  dateOfBirth: '',
  placeOfBirth: '',
  religion: '',
  category: 'general',
  aadhaarNumber: '',
  bloodGroup: '',
  classSought: '',
  academicSession: '2026-27',
  previousSchoolTransfer: 'no',

  houseNumber: '',
  street: '',
  city: '',
  state: '',
  pinCode: '',
  country: 'India',
  primaryMobile: '',
  alternateMobile: '',
  email: '',

  optsForTransport: 'no',
  transportRouteId: '',
  transportPickupStop: '',
  transportPickupAddress: '',
  transportShift: undefined,

  fatherName: '',
  fatherQualification: '',
  fatherOccupation: '',
  fatherOrganization: '',
  fatherOfficeAddress: '',
  fatherOfficePhone: '',
  fatherMobile: '',
  fatherAnnualIncome: '',
  fatherAadhaar: '',
  fatherEmail: '',

  motherName: '',
  motherQualification: '',
  motherOccupation: '',
  motherOrganization: '',
  motherOfficeAddress: '',
  motherOfficePhone: '',
  motherMobile: '',
  motherAnnualIncome: '',
  motherAadhaar: '',
  motherEmail: '',

  livesWithGuardian: 'no',
  guardianName: '',
  guardianRelationship: '',
  guardianOccupation: '',
  guardianMobile: '',
  guardianEmail: '',
  guardianAddress: '',

  passingYear: '',
  previousSchoolName: '',
  previousSchoolArea: '',
  previousBoard: '',
  previousPercentage: '',
  reasonForLeaving: '',

  siblingInSameSchool: 'no',
  siblings: [],

  referenceName: '',
  referenceMobile: '',
  referenceAddress: '',
  referenceRelationship: '',

  studentPhoto: null,
  birthCertificate: null,
  fatherPhoto: null,
  motherPhoto: null,
  aadhaarCopy: null,
  categoryCertificate: null,
  transferCertificate: null,
  previousReportCard: null,
  addressProof: null,

  declarationTruth: false as unknown as true,
  declarationPolicy: false as unknown as true,
  parentSignature: '',
  studentSignature: '',
  declarationDate: new Date().toISOString().split('T')[0],
}

/** Per-step field keys for partial validation */
export const STEP_FIELDS = {
  personal: [
    'firstName',
    'lastName',
    'gender',
    'dateOfBirth',
    'placeOfBirth',
    'religion',
    'category',
    'aadhaarNumber',
    'bloodGroup',
    'classSought',
    'academicSession',
    'previousSchoolTransfer',
  ],
  address: [
    'houseNumber',
    'street',
    'city',
    'state',
    'pinCode',
    'country',
    'primaryMobile',
    'alternateMobile',
    'email',
    'optsForTransport',
    'transportRouteId',
    'transportPickupStop',
    'transportPickupAddress',
    'transportShift',
  ],
  parents: [
    'fatherName',
    'fatherQualification',
    'fatherOccupation',
    'fatherOrganization',
    'fatherOfficeAddress',
    'fatherOfficePhone',
    'fatherMobile',
    'fatherAnnualIncome',
    'fatherAadhaar',
    'fatherEmail',
    'motherName',
    'motherQualification',
    'motherOccupation',
    'motherOrganization',
    'motherOfficeAddress',
    'motherOfficePhone',
    'motherMobile',
    'motherAnnualIncome',
    'motherAadhaar',
    'motherEmail',
    'livesWithGuardian',
    'guardianName',
    'guardianRelationship',
    'guardianOccupation',
    'guardianMobile',
    'guardianEmail',
    'guardianAddress',
  ],
  academic: [
    'passingYear',
    'previousSchoolName',
    'previousSchoolArea',
    'previousBoard',
    'previousPercentage',
    'reasonForLeaving',
    'siblingInSameSchool',
    'siblings',
    'referenceName',
    'referenceMobile',
    'referenceAddress',
    'referenceRelationship',
  ],
  documents: [
    'studentPhoto',
    'birthCertificate',
    'fatherPhoto',
    'motherPhoto',
    'aadhaarCopy',
    'categoryCertificate',
    'transferCertificate',
    'previousReportCard',
    'addressProof',
  ],
  declaration: [
    'declarationTruth',
    'declarationPolicy',
    'parentSignature',
    'studentSignature',
    'declarationDate',
  ],
  review: [] as string[],
} as const

export function validateDocumentsStep(
  data: Pick<
    z.infer<typeof admissionBaseSchema>,
    'studentPhoto' | 'birthCertificate'
  >,
): { success: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}
  if (!data.studentPhoto) {
    errors.studentPhoto = 'Student photograph is required'
  }
  if (!data.birthCertificate) {
    errors.birthCertificate = 'Birth certificate is required'
  }
  return { success: Object.keys(errors).length === 0, errors }
}

export function stripPreviewUrls<T extends Record<string, unknown>>(data: T): T {
  const clone = { ...data }
  for (const key of Object.keys(clone)) {
    const val = clone[key]
    if (val && typeof val === 'object' && 'previewUrl' in (val as object)) {
      const { previewUrl: _, ...rest } = val as {
        previewUrl?: string
        [k: string]: unknown
      }
      clone[key as keyof T] = rest as T[keyof T]
    }
  }
  return clone
}

export function sanitizeMobileFields(values: z.infer<typeof admissionBaseSchema>) {
  const mobileFields = [
    'primaryMobile',
    'alternateMobile',
    'fatherMobile',
    'motherMobile',
    'guardianMobile',
    'referenceMobile',
  ] as const
  const copy = { ...values }
  for (const field of mobileFields) {
    if (copy[field]) {
      copy[field] = normalizeDigits(copy[field])
    }
  }
  if (copy.aadhaarNumber) copy.aadhaarNumber = normalizeDigits(copy.aadhaarNumber)
  if (copy.fatherAadhaar) copy.fatherAadhaar = normalizeDigits(copy.fatherAadhaar)
  if (copy.motherAadhaar) copy.motherAadhaar = normalizeDigits(copy.motherAadhaar)
  if (copy.pinCode) copy.pinCode = normalizeDigits(copy.pinCode)
  return copy
}
