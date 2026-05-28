'use client'

import { Sector } from 'recharts'
import type { LegendProps } from 'recharts'
import type { PieSectorDataItem } from 'recharts/types/polar/Pie'
import { formatCurrency } from '@/lib/format'

interface PieSlicePayload {
  fill?: string
  department?: string
  category?: string
  amount?: number
  percentOfTotal?: number
}

interface TooltipPayloadItem {
  name?: string
  value?: number
  fill?: string
  percent?: number
  payload?: PieSlicePayload
}

interface PieChartTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
}

function getSlicePercent(entry: TooltipPayloadItem): number | null {
  const data = entry.payload
  if (data?.percentOfTotal != null) return data.percentOfTotal
  if (entry.percent != null) return entry.percent * 100
  return null
}

function getSliceLabel(entry: TooltipPayloadItem): string {
  const data = entry.payload
  return entry.name ?? data?.department ?? data?.category ?? '—'
}

export function PieChartTooltip({ active, payload }: PieChartTooltipProps) {
  if (!active || !payload?.length) return null

  const entry = payload[0]
  const data = entry.payload
  const color = entry.fill ?? data?.fill ?? 'var(--chart-1)'
  const label = getSliceLabel(entry)
  const amount = Number(entry.value ?? data?.amount ?? 0)
  const percent = getSlicePercent(entry)

  return (
    <div
      className="min-w-[168px] overflow-hidden rounded-xl border border-border/70 bg-card/95 shadow-lg backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-150"
      style={{
        boxShadow: `0 12px 28px -8px color-mix(in oklch, ${color} 35%, transparent)`,
      }}
    >
      <div className="h-1 w-full" style={{ backgroundColor: color }} />
      <div className="space-y-2.5 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 shrink-0 rounded-full ring-2 ring-offset-1 ring-offset-card"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 10px color-mix(in oklch, ${color} 50%, transparent)`,
            }}
          />
          <span className="text-sm font-semibold leading-none tracking-tight" style={{ color }}>
            {label}
          </span>
        </div>
        <p className="text-xl font-bold tabular-nums tracking-tight text-foreground">
          {formatCurrency(amount)}
        </p>
        {percent != null && (
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              backgroundColor: `color-mix(in oklch, ${color} 20%, var(--card))`,
              color,
            }}
          >
            {percent.toFixed(1)}% of total
          </span>
        )}
      </div>
    </div>
  )
}

export function PieChartLegend({ payload }: LegendProps) {
  if (!payload?.length) return null

  return (
    <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {payload.map((entry) => {
        const item = entry.payload as PieSlicePayload | undefined
        const name = String(entry.value ?? item?.category ?? item?.department ?? '')
        const color = entry.color ?? item?.fill ?? 'var(--chart-1)'
        const percent = item?.percentOfTotal ?? 0

        return (
          <li key={name} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-muted-foreground">{name}</span>
            <span className="font-semibold tabular-nums" style={{ color }}>
              {percent.toFixed(1)}%
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/** Slightly enlarges the hovered pie slice. */
export function pieActiveShape(props: PieSectorDataItem) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={(outerRadius ?? 0) + 8}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="var(--background)"
      strokeWidth={2}
    />
  )
}
