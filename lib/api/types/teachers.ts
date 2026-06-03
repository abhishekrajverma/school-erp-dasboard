/** TODO: align with ASP.NET Core Teacher DTOs */

export type TeacherDto = {
  id: string
}

export type CreateTeacherRequest = Omit<TeacherDto, 'id'>
export type UpdateTeacherRequest = Partial<CreateTeacherRequest>
