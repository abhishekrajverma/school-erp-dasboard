export function slugifySchoolName(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function getSchoolWebsitePath(slug: string, section?: string) {
  const base = `/school/${slug}`
  return section ? `${base}/${section}` : base
}

export function formatFeeFrequency(frequency: string) {
  const labels: Record<string, string> = {
    'one-time': 'One-time',
    monthly: 'Per month',
    quarterly: 'Per quarter',
    annual: 'Per year',
  }
  return labels[frequency] ?? frequency
}
