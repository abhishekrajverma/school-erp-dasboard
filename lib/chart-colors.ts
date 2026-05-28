/** Recharts fills — use `var(--chart-N)` (oklch tokens), not `hsl(var(--chart-N))`. */

export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
] as const

export function chartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length]
}

/** Adds fill + percentOfTotal from amount values (no hardcoded percentages). */
export function enrichPieData<T extends { amount: number }>(
  data: T[]
): (T & { fill: string; percentOfTotal: number })[] {
  const total = data.reduce((sum, item) => sum + item.amount, 0)
  return data.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
    percentOfTotal: total > 0 ? (item.amount / total) * 100 : 0,
  }))
}

export const CHART_TOOLTIP_STYLE = {
  backgroundColor: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontSize: '12px',
}

export const CHART_AXIS_STROKE = 'var(--muted-foreground)'
export const CHART_GRID_STROKE = 'var(--border)'
