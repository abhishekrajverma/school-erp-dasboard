'use client'

import { motion } from 'framer-motion'
import { formatCurrency } from '@/lib/format'
import type { SchoolWebsiteFeeItem } from '@/lib/school-website/types'
import { formatFeeFrequency } from '@/lib/school-website/utils'
import { staggerContainer, staggerItem, viewportOnce } from '@/components/school-website/school-site-motion'

type FeeStructureTableProps = {
  fees: SchoolWebsiteFeeItem[]
  notes?: string
  accentColor?: string
  animated?: boolean
}

function FeeRow({
  fee,
  accentColor,
  animated,
  index,
}: {
  fee: SchoolWebsiteFeeItem
  accentColor?: string
  animated?: boolean
  index: number
}) {
  const className = 'border-b border-border/30 transition-colors last:border-0 hover:bg-muted/30'
  const cells = (
    <>
      <td className="px-5 py-4">
        <p className="font-medium">{fee.name}</p>
        {fee.description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{fee.description}</p>
        )}
      </td>
      <td className="px-5 py-4 text-muted-foreground">{fee.classRange ?? '—'}</td>
      <td className="px-5 py-4 text-base font-semibold" style={accentColor ? { color: accentColor } : undefined}>
        {formatCurrency(fee.amount)}
      </td>
      <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
        {formatFeeFrequency(fee.frequency)}
      </td>
    </>
  )

  if (animated) {
    return (
      <motion.tr
        variants={staggerItem}
        className={className}
        transition={{ delay: index * 0.04 }}
      >
        {cells}
      </motion.tr>
    )
  }

  return <tr className={className}>{cells}</tr>
}

export function FeeStructureTable({ fees, notes, accentColor, animated }: FeeStructureTableProps) {
  return (
    <div className="space-y-4">
      <div className="school-glass-card overflow-hidden rounded-2xl border border-border/50 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b border-border/50 text-left text-xs uppercase tracking-wider text-muted-foreground"
              style={accentColor ? { backgroundColor: `${accentColor}10` } : undefined}
            >
              <th className="px-5 py-4 font-semibold">Fee Type</th>
              <th className="px-5 py-4 font-semibold">Class / Details</th>
              <th className="px-5 py-4 font-semibold">Amount</th>
              <th className="hidden px-5 py-4 font-semibold sm:table-cell">Frequency</th>
            </tr>
          </thead>
          {animated ? (
            <motion.tbody
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
            >
              {fees.map((fee, index) => (
                <FeeRow key={fee.id} fee={fee} accentColor={accentColor} animated animated index={index} />
              ))}
            </motion.tbody>
          ) : (
            <tbody>
              {fees.map((fee, index) => (
                <FeeRow key={fee.id} fee={fee} accentColor={accentColor} index={index} />
              ))}
            </tbody>
          )}
        </table>
      </div>
      {notes && (
        <motion.p
          {...(animated ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: viewportOnce } : {})}
          className="rounded-2xl border border-border/40 bg-muted/40 px-5 py-4 text-sm leading-relaxed text-muted-foreground"
        >
          {notes}
        </motion.p>
      )}
    </div>
  )
}
