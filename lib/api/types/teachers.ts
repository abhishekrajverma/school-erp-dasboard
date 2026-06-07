export type TeacherDto = {
  id: string
  firstName: string
  lastName: string
  name: string
  employeeId: string
  department: string
  subject: string
  qualification: string
  experience: number
  email: string
  phone: string
  salary: number
  joiningDate: string
  status: string
  classes: string[]
  avatar: string
}

export type CreateTeacherRequest = {
  firstName: string
  lastName: string
  email: string
  employeeId?: string
  department?: string
  subject?: string
  qualification?: string
  experience?: number
  phone?: string
  salary?: number
  joiningDate?: string
  status?: string
  classes?: string[]
}

export type UpdateTeacherRequest = Partial<CreateTeacherRequest>
