import type { FeeRecordDto } from '@/lib/api/types/fees'

export type PaymentMethodId = 'upi' | 'card' | 'net_banking' | 'wallet'

export const PAYMENT_METHODS: { id: PaymentMethodId; label: string }[] = [
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Debit / Credit Card' },
  { id: 'net_banking', label: 'Net Banking' },
  { id: 'wallet', label: 'School Wallet' },
]

export type ParentFeePayment = {
  id: string
  receiptNo: string
  transactionId: string
  feeRecordId: string
  invoiceNo: string
  studentId: string
  studentName: string
  parentId: string
  parentName: string
  amount: number
  paymentMethod: PaymentMethodId
  paidAt: string
  feeType: string
  class: string
}

export function summarizeParentFees(fees: FeeRecordDto[]) {
  const total = fees.reduce((s, f) => s + f.totalFee, 0)
  const paid = fees.reduce((s, f) => s + f.paid, 0)
  const pending = fees.reduce((s, f) => s + f.pending, 0)
  const overdue = fees.filter((f) => f.status === 'overdue').length
  const pendingCount = fees.filter((f) => f.pending > 0).length
  return { total, paid, pending, overdue, pendingCount, invoiceCount: fees.length }
}

export function feeTypeLabel(feeType: string) {
  const labels: Record<string, string> = {
    tuition: 'Tuition Fee',
    transport: 'Transport Fee',
    library: 'Library Fee',
    computer: 'Computer / IT Fee',
    'smart-class': 'Smart Class Fee',
    combined: 'Combined Fees',
  }
  return labels[feeType] ?? feeType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function getSchoolInvoiceMeta(school?: {
  name?: string
  address?: string
  phone?: string
  email?: string
  affiliation?: string
}) {
  return {
    schoolName: school?.name ?? 'School',
    address: school?.address ?? '',
    phone: school?.phone ?? '',
    email: school?.email ?? '',
    affiliation: school?.affiliation ?? '',
  }
}

export function buildPaymentReceipt(params: {
  fee: FeeRecordDto
  amount: number
  paymentMethod: PaymentMethodId
  parentId: string
  parentName: string
}): ParentFeePayment {
  const { fee, amount, paymentMethod, parentId, parentName } = params
  const prefix =
    paymentMethod === 'upi'
      ? 'UPI'
      : paymentMethod === 'card'
        ? 'CARD'
        : paymentMethod === 'wallet'
          ? 'WLT'
          : 'NBT'

  return {
    id: String(Date.now()),
    receiptNo: `RCP-${Date.now().toString(36).toUpperCase()}`,
    transactionId: `${prefix}${Math.floor(100000000000 + Math.random() * 900000000000)}`,
    feeRecordId: fee.id,
    invoiceNo: fee.invoiceNo,
    studentId: fee.studentId,
    studentName: fee.studentName,
    parentId,
    parentName,
    amount,
    paymentMethod,
    paidAt: new Date().toISOString(),
    feeType: fee.feeType,
    class: fee.class,
  }
}
