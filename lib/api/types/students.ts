/** TODO: align with ASP.NET Core Student DTOs */

export type StudentDto = {
  id: string
  // extend when wiring to backend
}

export type CreateStudentRequest = Omit<StudentDto, 'id'>
export type UpdateStudentRequest = Partial<CreateStudentRequest>
