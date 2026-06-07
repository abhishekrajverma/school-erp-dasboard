/** Match month/day of an ISO date string to today (ignores year). */
export function isBirthdayToday(dateOfBirth: string | undefined, today = new Date()): boolean {
  if (!dateOfBirth) return false
  const parsed = new Date(dateOfBirth)
  if (Number.isNaN(parsed.getTime())) return false
  return parsed.getMonth() === today.getMonth() && parsed.getDate() === today.getDate()
}

export function formatBirthdayNavbarMessage(template: string, names: string[]): string {
  const trimmed = template.trim()
  const fallback = names.length === 1 ? `Happy Birthday, ${names[0]}! 🎂` : `Happy Birthday! 🎂`
  if (!trimmed) return fallback

  const uniqueNames = [...new Set(names.map((n) => n.trim()).filter(Boolean))]
  const namesLabel =
    uniqueNames.length === 0
      ? 'everyone'
      : uniqueNames.length <= 3
        ? uniqueNames.join(', ')
        : `${uniqueNames.slice(0, 2).join(', ')} +${uniqueNames.length - 2} more`

  return trimmed
    .replaceAll('{names}', namesLabel)
    .replaceAll('{name}', uniqueNames[0] ?? 'everyone')
    .replaceAll('{count}', String(uniqueNames.length))
}
