import { ADMISSION_DRAFT_KEY } from '@/lib/admission/constants'
import type { AdmissionFormValues } from '@/lib/admission/types'
import { stripPreviewUrls } from '@/lib/admission/schema'

export interface StoredAdmissionDraft {
  data: Partial<AdmissionFormValues>
  currentStep: string
  lastSavedAt: string
  version: number
}

const DRAFT_VERSION = 1

export function loadAdmissionDraft(): StoredAdmissionDraft | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(ADMISSION_DRAFT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredAdmissionDraft
    if (parsed.version !== DRAFT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

export function saveAdmissionDraft(
  data: Partial<AdmissionFormValues>,
  currentStep: string,
): StoredAdmissionDraft {
  const payload: StoredAdmissionDraft = {
    data: stripPreviewUrls(data as Record<string, unknown>) as Partial<AdmissionFormValues>,
    currentStep,
    lastSavedAt: new Date().toISOString(),
    version: DRAFT_VERSION,
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMISSION_DRAFT_KEY, JSON.stringify(payload))
  }
  return payload
}

export function clearAdmissionDraft(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMISSION_DRAFT_KEY)
  }
}
