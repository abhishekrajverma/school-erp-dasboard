export function slugifySchool(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function tenantIdFromSchoolCode(schoolCode: string): string {
  const code = schoolCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '')
  return `TEN-${code || 'SCHOOL'}-${new Date().getFullYear()}`
}
