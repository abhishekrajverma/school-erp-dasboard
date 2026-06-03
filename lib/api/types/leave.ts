/** TODO: align with ASP.NET Core Leave DTOs */

export type LeaveRequestDto = {
  id: string
}

export type CreateLeaveRequest = Omit<LeaveRequestDto, 'id'>
