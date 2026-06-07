export type StudentDto = {
  id: string
  firstName: string
  lastName: string
  name: string
  class: string
  section: string
  rollNo: string
  admissionNo: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  bloodGroup: string
  address: string | null
  parentName: string | null
  parentPhone: string | null
  parentEmail: string | null
  status: string
  feeStatus: string | null
  attendance: number
  avatar: string | null
}

export type CreateStudentRequest = {
  firstName: string
  lastName: string
  name?: string
  email: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  class: string
  section?: string
  rollNo?: string
  admissionNo?: string
  bloodGroup?: string
  address?: string
  parentName?: string
  parentPhone?: string
  parentEmail?: string
  status?: string
}

export type UpdateStudentRequest = Partial<CreateStudentRequest>
