import type { FeeRecord } from './erp-data'
import { feeRecordsData, schoolSettings } from './erp-data'
import { getChildFees } from './parent-portal'

const FEE_STATE_KEY = 'edusync-parent-fee-records-v1'
const PAYMENTS_KEY = 'edusync-parent-fee-payments-v1'

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

/** Extra demo invoices so parents can pay online (merged per student) */
const DEMO_EXTRA_FEES: Record<string, FeeRecord[]> = {
  '1': [
    {
      id: '1-extra-transport',
      invoiceNo: 'INV2024T001',
      studentId: '1',
      studentName: 'Arjun Sharma',
      class: '10-A',
      feeType: 'transport',
      totalFee: 3500,
      paid: 0,
      pending: 3500,
      discount: 0,
      fine: 0,
      dueDate: '2024-07-15',
      paidDate: null,
      status: 'pending',
      paymentMethod: null,
      feeItems: [{ feeType: 'transport', amount: 3500, lineDiscount: 0 }],
    },
    {
      id: '1-extra-lab',
      invoiceNo: 'INV2024L001',
      studentId: '1',
      studentName: 'Arjun Sharma',
      class: '10-A',
      feeType: 'computer',
      totalFee: 5000,
      paid: 0,
      pending: 5000,
      discount: 500,
      fine: 0,
      dueDate: '2024-07-20',
      paidDate: null,
      status: 'pending',
      paymentMethod: null,
      feeItems: [{ feeType: 'computer', amount: 5000, lineDiscount: 500 }],
    },
  ],
}

function loadFeeOverrides(): Record<string, FeeRecord[]> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(FEE_STATE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, FeeRecord[]>) : {}
  } catch {
    return {}
  }
}

function saveFeeOverrides(data: Record<string, FeeRecord[]>) {
  localStorage.setItem(FEE_STATE_KEY, JSON.stringify(data))
}

function loadPayments(): ParentFeePayment[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(PAYMENTS_KEY)
    return raw ? (JSON.parse(raw) as ParentFeePayment[]) : []
  } catch {
    return []
  }
}

function savePayments(payments: ParentFeePayment[]) {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments))
}

function mergeFeeRecords(studentId: string, overrides: FeeRecord[]): FeeRecord[] {
  const base = getChildFees(studentId)
  const extras = DEMO_EXTRA_FEES[studentId] ?? []
  const byId = new Map<string, FeeRecord>()

  for (const f of [...base, ...extras]) byId.set(f.id, { ...f })
  for (const f of overrides) byId.set(f.id, { ...f })

  return [...byId.values()].sort((a, b) => {
    const order = { overdue: 0, pending: 1, paid: 2 }
    const sa = order[a.status as keyof typeof order] ?? 3
    const sb = order[b.status as keyof typeof order] ?? 3
    if (sa !== sb) return sa - sb
    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
  })
}

export function getParentChildFees(studentId: string): FeeRecord[] {
  const overrides = loadFeeOverrides()[studentId] ?? []
  return mergeFeeRecords(studentId, overrides)
}

export function getParentPaymentHistory(
  parentId: string,
  studentId?: string,
): ParentFeePayment[] {
  return loadPayments()
    .filter((p) => p.parentId === parentId && (!studentId || p.studentId === studentId))
    .sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime())
}

export function summarizeParentFees(fees: FeeRecord[]) {
  const total = fees.reduce((s, f) => s + f.totalFee, 0)
  const paid = fees.reduce((s, f) => s + f.paid, 0)
  const pending = fees.reduce((s, f) => s + f.pending, 0)
  const overdue = fees.filter((f) => f.status === 'overdue').length
  const pendingCount = fees.filter((f) => f.pending > 0).length
  return { total, paid, pending, overdue, pendingCount, invoiceCount: fees.length }
}

function generateReceiptNo() {
  return `RCP-${Date.now().toString(36).toUpperCase()}`
}

function generateTransactionId(method: PaymentMethodId) {
  const prefix = method === 'upi' ? 'UPI' : method === 'card' ? 'CARD' : method === 'wallet' ? 'WLT' : 'NBT'
  return `${prefix}${Math.floor(100000000000 + Math.random() * 900000000000)}`
}

export function payParentFee(params: {
  fee: FeeRecord
  amount: number
  paymentMethod: PaymentMethodId
  parentId: string
  parentName: string
}): { updatedFee: FeeRecord; payment: ParentFeePayment } {
  const { fee, amount, paymentMethod, parentId, parentName } = params
  const payAmount = Math.min(amount, fee.pending)
  if (payAmount <= 0) {
    throw new Error('Nothing to pay on this invoice')
  }

  const newPaid = fee.paid + payAmount
  const newPending = Math.max(0, fee.pending - payAmount)
  const today = new Date().toISOString().split('T')[0]

  const updatedFee: FeeRecord = {
    ...fee,
    paid: newPaid,
    pending: newPending,
    paidDate: newPending === 0 ? today : fee.paidDate,
    status: newPending === 0 ? 'paid' : fee.status === 'overdue' ? 'overdue' : 'pending',
    paymentMethod: newPending === 0 ? paymentMethod : fee.paymentMethod,
  }

  const overrides = loadFeeOverrides()
  const studentFees = mergeFeeRecords(fee.studentId, overrides[fee.studentId] ?? [])
  overrides[fee.studentId] = studentFees.map((f) => (f.id === fee.id ? updatedFee : f))
  saveFeeOverrides(overrides)

  const payment: ParentFeePayment = {
    id: String(Date.now()),
    receiptNo: generateReceiptNo(),
    transactionId: generateTransactionId(paymentMethod),
    feeRecordId: fee.id,
    invoiceNo: fee.invoiceNo,
    studentId: fee.studentId,
    studentName: fee.studentName,
    parentId,
    parentName,
    amount: payAmount,
    paymentMethod,
    paidAt: new Date().toISOString(),
    feeType: fee.feeType,
    class: fee.class,
  }

  const payments = loadPayments()
  payments.unshift(payment)
  savePayments(payments)

  return { updatedFee, payment }
}

export function getSchoolInvoiceMeta() {
  return {
    schoolName: schoolSettings.schoolName,
    address: `${schoolSettings.address}, ${schoolSettings.city}`,
    phone: schoolSettings.phone,
    email: schoolSettings.email,
    affiliation: schoolSettings.affiliationBoard,
  }
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

/** Sync erp base when no overrides — export for tests */
export function resetParentFeeDemo(studentId: string) {
  const overrides = loadFeeOverrides()
  delete overrides[studentId]
  saveFeeOverrides(overrides)
}

export { feeRecordsData }
