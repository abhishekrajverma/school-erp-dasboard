export type ParentDto = {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  phone: string
  occupation: string | null
  address: string | null
  children: string[]
  studentIds: string[]
  status: string
  avatar: string | null
}

export type CreateParentRequest = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  occupation?: string
  address?: string
  /** Display names; backend does not derive these from studentIds. */
  children?: string[]
  studentIds?: string[]
  status?: string
}

export type UpdateParentRequest = Partial<CreateParentRequest>
