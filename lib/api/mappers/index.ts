/**
 * Map ASP.NET Core DTOs ↔ frontend models.
 * Use when API shape differs from UI types in lib/schemas.ts or lib/erp-data.ts.
 */

export { toCreateStudentRequest, toUpdateStudentRequest, formatStudentClass } from './students'
