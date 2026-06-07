import type { StudentFormData, ParentFormData } from '@/lib/schemas'
import type { CreateParentRequest, ParentDto } from '@/lib/api/types/parents'

const TITLE_PREFIX = /^(Mr\.|Mrs\.|Ms\.|Dr\.|Col\.)\s+/i

export function parseParentName(fullName: string): { firstName: string; lastName: string } {
  const cleaned = fullName.trim().replace(TITLE_PREFIX, '')
  const parts = cleaned.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return { firstName: 'Parent', lastName: 'Guardian' }
  if (parts.length === 1) return { firstName: parts[0], lastName: parts[0] }
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') }
}

/** Parent records require an email; derive one from phone when the student form omits it. */
export function resolveParentEmail(form: Pick<StudentFormData, 'parentEmail' | 'parentPhone'>): string | null {
  const email = form.parentEmail?.trim()
  if (email) return email
  const digits = form.parentPhone?.replace(/\D/g, '') ?? ''
  if (digits.length >= 10) return `parent-${digits}@guardian.local`
  return null
}

export function studentDisplayName(form: Pick<StudentFormData, 'firstName' | 'lastName'>): string {
  return `${form.firstName} ${form.lastName}`.trim()
}

export function toCreateParentFromStudent(
  form: StudentFormData,
  studentId: string,
): CreateParentRequest | null {
  if (!form.parentName?.trim()) return null
  const email = resolveParentEmail(form)
  if (!email) return null

  const { firstName, lastName } = parseParentName(form.parentName)
  const childName = studentDisplayName(form)
  return {
    firstName,
    lastName,
    email,
    phone: form.parentPhone,
    address: form.address,
    studentIds: [studentId],
    children: childName ? [childName] : [],
    status: form.status ?? 'active',
  }
}

export function findMatchingParent(
  parents: ParentDto[],
  form: Pick<StudentFormData, 'parentEmail' | 'parentPhone'>,
): ParentDto | undefined {
  const email = resolveParentEmail(form)?.toLowerCase()
  if (!email) return undefined
  return parents.find(
    (p) =>
      p.email.toLowerCase() === email ||
      (form.parentPhone && p.phone.replace(/\s/g, '') === form.parentPhone.replace(/\s/g, '')),
  )
}

/** API may return linked studentIds without populating the children name list. */
export function getParentChildrenLabels(
  parent: ParentDto,
  studentNameById: Map<string, string>,
): string[] {
  if (parent.children.length > 0) return parent.children
  return parent.studentIds
    .map((id) => studentNameById.get(id))
    .filter((name): name is string => Boolean(name))
}

export function countLinkedStudents(parent: ParentDto): number {
  if (parent.children.length > 0) return parent.children.length
  return parent.studentIds.length
}

/** Build API payload fields from selected student ids (backend needs both ids and names). */
export function buildParentStudentLinks(
  studentIds: string[],
  studentNameById: Map<string, string>,
): { studentIds: string[]; children: string[] } {
  const ids = [...new Set(studentIds)]
  const children = ids
    .map((id) => studentNameById.get(id))
    .filter((name): name is string => Boolean(name))
  return { studentIds: ids, children }
}

export function toParentFormValues(parent: ParentDto): ParentFormData {
  return {
    firstName: parent.firstName,
    lastName: parent.lastName,
    email: parent.email,
    phone: parent.phone,
    occupation: parent.occupation ?? '',
    address: parent.address ?? '',
    studentIds: parent.studentIds ?? [],
    status: (parent.status === 'inactive' ? 'inactive' : 'active') as ParentFormData['status'],
  }
}

export const emptyParentFormValues: ParentFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  occupation: '',
  address: '',
  studentIds: [],
  status: 'active',
}
