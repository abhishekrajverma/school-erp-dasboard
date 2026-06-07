export type AdmissionDto = {
  id: string
  applicationNo: string
  status: string
  currentStep: string
  applicantName: string
  classSought: string
  academicSession: string
  createdAt: string
  submittedAt: string | null
}

export type CreateAdmissionRequest = {
  applicantName: string
  classSought: string
  academicSession?: string
  [key: string]: unknown
}

export type UpdateAdmissionRequest = Partial<CreateAdmissionRequest> & {
  status?: string
  currentStep?: string
}
