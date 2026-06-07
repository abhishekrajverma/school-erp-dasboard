export type FeeRecordDto = {
  id: string
  invoiceNo: string
  studentId: string
  studentName: string
  class: string
  feeType: string
  totalFee: number
  paid: number
  pending: number
  discount: number
  fine: number
  dueDate: string
  paidDate: string | null
  status: string
  paymentMethod: string | null
  feeItems: unknown | null
}

export type PaymentDto = {
  id: string
}
