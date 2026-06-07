import type { AdmissionFormValues } from '@/lib/admission/types'
import type { CreateAdmissionRequest } from '@/lib/api/types/admissions'

/** Map wizard form values to the backend admission payload. */
export function mapAdmissionFormToRequest(
  data: AdmissionFormValues,
): CreateAdmissionRequest {
  const applicantName = `${data.firstName} ${data.lastName}`.trim()
  return {
    ...data,
    applicantName,
    classSought: data.classSought,
    academicSession: data.academicSession,
  }
}
