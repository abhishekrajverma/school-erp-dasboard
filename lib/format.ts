export function formatCurrency(amount: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits,
  }).format(amount)
}

export function formatDate(date: string | null) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
