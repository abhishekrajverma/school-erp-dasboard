export function exportToCsv<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
) {
  if (rows.length === 0) return

  const keys = columns?.map((c) => c.key) ?? (Object.keys(rows[0]) as (keyof T)[])
  const headers = columns?.map((c) => c.label) ?? keys.map(String)

  const escape = (value: unknown) => {
    const str = value == null ? '' : String(value)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const csv = [
    headers.join(','),
    ...rows.map((row) => keys.map((k) => escape(row[k])).join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
