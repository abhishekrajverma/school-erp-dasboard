import type { StudentFormData } from '@/lib/schemas'
import type { CreateStudentRequest, UpdateStudentRequest } from '@/lib/api/types/students'

/** "Class 10" + section "A" → "10-A" (EduSync API format) */
export function formatStudentClass(className: string, section: string): string {
  const normalized = className.replace(/^Class\s+/i, '').trim()
  if (normalized.includes('-')) return normalized
  return section ? `${normalized}-${section}` : normalized
}

function deriveRollNo(admissionNumber: string, fallbackSeed: number): string {
  const digits = admissionNumber.replace(/\D/g, '')
  if (digits.length >= 3) return digits.slice(-4)
  return String(1000 + fallbackSeed)
}

export function toCreateStudentRequest(
  form: StudentFormData,
  options?: { rollNoSeed?: number },
): CreateStudentRequest {
  const classLabel = formatStudentClass(form.class, form.section)

  return {
    firstName: form.firstName,
    lastName: form.lastName,
    name: `${form.firstName} ${form.lastName}`.trim(),
    email: form.email,
    phone: form.phone,
    dateOfBirth: form.dateOfBirth,
    gender: form.gender,
    class: classLabel,
    section: form.section,
    rollNo: deriveRollNo(form.admissionNumber, options?.rollNoSeed ?? 0),
    admissionNo: form.admissionNumber,
    bloodGroup: form.bloodGroup,
    address: form.address,
    parentName: form.parentName,
    parentPhone: form.parentPhone,
    parentEmail: form.parentEmail,
    status: form.status,
  }
}

export function toUpdateStudentRequest(form: StudentFormData): UpdateStudentRequest {
  const classLabel = formatStudentClass(form.class, form.section)

  return {
    firstName: form.firstName,
    lastName: form.lastName,
    name: `${form.firstName} ${form.lastName}`.trim(),
    email: form.email,
    phone: form.phone,
    class: classLabel,
    section: form.section,
    address: form.address,
    parentName: form.parentName,
    parentPhone: form.parentPhone,
    parentEmail: form.parentEmail,
    status: form.status,
  }
}
