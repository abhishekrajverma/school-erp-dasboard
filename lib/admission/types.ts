import type { z } from 'zod'
import type {
  admissionFormSchema,
  admissionDraftSchema,
} from '@/lib/admission/schema'
import type { AdmissionStepId } from '@/lib/admission/constants'

export type AdmissionFormValues = z.infer<typeof admissionFormSchema>
export type AdmissionDraftValues = z.infer<typeof admissionDraftSchema>

export interface UploadedFileMeta {
  name: string
  size: number
  type: string
  lastModified: number
  /** Object URL for image preview — revoke on unmount */
  previewUrl?: string
}

export type AdmissionDocuments = Record<
  | 'studentPhoto'
  | 'birthCertificate'
  | 'fatherPhoto'
  | 'motherPhoto'
  | 'aadhaarCopy'
  | 'categoryCertificate'
  | 'transferCertificate'
  | 'previousReportCard'
  | 'addressProof',
  UploadedFileMeta | null
>

export interface AdmissionWizardState {
  currentStep: AdmissionStepId
  lastSavedAt: string | null
  isDraftSaving: boolean
}

export interface StepValidationResult {
  success: boolean
  step: AdmissionStepId
}
