import type { MultiFeePaymentFormData } from '@/lib/schemas'

export interface FeePaymentTotals {
  subtotal: number
  lineDiscountTotal: number
  globalDiscount: number
  percentDiscountAmount: number
  totalDiscount: number
  fine: number
  netPayable: number
  amountPaying: number
  balance: number
}

export function calculateMultiFeeTotals(
  data: Pick<
    MultiFeePaymentFormData,
    'feeLines' | 'globalDiscount' | 'discountPercent' | 'fine' | 'amountPaying'
  >,
): FeePaymentTotals {
  const activeLines = data.feeLines.filter((l) => l.enabled && l.amount > 0)
  const subtotal = activeLines.reduce((sum, l) => sum + l.amount, 0)
  const lineDiscountTotal = activeLines.reduce((sum, l) => sum + (l.lineDiscount || 0), 0)
  const afterLineDiscount = Math.max(0, subtotal - lineDiscountTotal)
  const percentDiscountAmount = Math.round(
    (afterLineDiscount * (data.discountPercent || 0)) / 100,
  )
  const globalDiscount = data.globalDiscount || 0
  const totalDiscount = lineDiscountTotal + globalDiscount + percentDiscountAmount
  const fine = data.fine || 0
  const netPayable = Math.max(0, subtotal - totalDiscount + fine)
  const amountPaying = data.amountPaying || 0
  const balance = Math.max(0, netPayable - amountPaying)

  return {
    subtotal,
    lineDiscountTotal,
    globalDiscount,
    percentDiscountAmount,
    totalDiscount,
    fine,
    netPayable,
    amountPaying,
    balance,
  }
}

export function buildDefaultFeeLines(): MultiFeePaymentFormData['feeLines'] {
  return [
    { enabled: false, feeType: 'tuition', amount: 0, lineDiscount: 0 },
    { enabled: false, feeType: 'transport', amount: 0, lineDiscount: 0 },
    { enabled: false, feeType: 'library', amount: 0, lineDiscount: 0 },
    { enabled: false, feeType: 'computer', amount: 0, lineDiscount: 0 },
    { enabled: false, feeType: 'smart-class', amount: 0, lineDiscount: 0 },
  ]
}
