/** April–March financial year label, e.g. 2025-26 */
export function currentFinancialYear(reference = new Date()): string {
  const year = reference.getFullYear()
  const month = reference.getMonth()
  if (month >= 3) return `${year}-${String(year + 1).slice(-2)}`
  return `${year - 1}-${String(year).slice(-2)}`
}

/** Normalize 23-24 → 2023-24 for consistent storage and API headers */
export function normalizeFinancialYear(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return currentFinancialYear()

  const match = trimmed.match(/^(\d{2,4})\s*[-/]\s*(\d{2,4})$/)
  if (!match) return trimmed

  let start = match[1]
  let end = match[2]

  if (start.length === 2) {
    const endNum = Number(end.length === 2 ? end : end.slice(-2))
    const century = endNum >= 50 ? 19 : 20
    start = `${century}${start}`
  }

  if (end.length === 4) end = end.slice(-2)
  if (end.length === 2 && start.length === 4) {
    return `${start}-${end}`
  }

  return trimmed
}

export function parseFinancialYearsList(raw: string | undefined | null): string[] {
  if (!raw?.trim()) return defaultFinancialYearsList()

  const seen = new Set<string>()
  const result: string[] = []

  for (const part of raw.split(/[,;\n]+/)) {
    const normalized = normalizeFinancialYear(part)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    result.push(normalized)
  }

  return result.length > 0 ? result : defaultFinancialYearsList()
}

export function defaultFinancialYearsList(reference = new Date()): string[] {
  const current = currentFinancialYear(reference)
  const startYear = Number(current.slice(0, 4))
  return [startYear - 2, startYear - 1, startYear].map(
    (y) => `${y}-${String(y + 1).slice(-2)}`,
  )
}

export function formatFinancialYearsList(years: string[]): string {
  return years.map(normalizeFinancialYear).join(', ')
}

export function displayFinancialYear(value: string): string {
  const normalized = normalizeFinancialYear(value)
  const match = normalized.match(/^(\d{4})-(\d{2})$/)
  if (!match) return normalized
  return `${match[1].slice(-2)}-${match[2]}`
}
