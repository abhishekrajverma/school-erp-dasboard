import type { StudentFormData } from '@/lib/schemas'
import type { ParentDto } from '@/lib/api/types/parents'
import type { CreateParentRequest } from '@/lib/api/types/parents'
import { isApiError } from '@/lib/api/interceptors/errors'
import {
  findMatchingParent,
  studentDisplayName,
  toCreateParentFromStudent,
} from '@/lib/api/mappers/parents'

type CreateParentFn = (body: CreateParentRequest) => Promise<ParentDto>
type UpdateParentFn = (args: {
  id: string
  body: {
    studentIds?: string[]
    children?: string[]
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    address?: string
  }
}) => Promise<ParentDto>

/** Create or link a `/parents` record from student guardian fields. */
export async function syncParentFromStudent(
  form: StudentFormData,
  studentId: string,
  parents: ParentDto[],
  createParent: CreateParentFn,
  updateParent: UpdateParentFn,
): Promise<void> {
  const parentBody = toCreateParentFromStudent(form, studentId)
  if (!parentBody) return

  const existing = findMatchingParent(parents, form)
  if (existing) {
    const childName = studentDisplayName(form)
    const studentIds = [...new Set([...existing.studentIds, studentId])]
    const children = childName
      ? [...new Set([...existing.children, childName])]
      : existing.children
    try {
      await updateParent({
        id: existing.id,
        body: {
          studentIds,
          children,
          firstName: parentBody.firstName,
          lastName: parentBody.lastName,
          email: parentBody.email,
          phone: parentBody.phone,
          address: parentBody.address,
        },
      })
      return
    } catch (err) {
      // Cached parent list can reference a record that was deleted server-side.
      if (!isApiError(err) || err.status !== 404) throw err
    }
  }

  await createParent(parentBody)
}
