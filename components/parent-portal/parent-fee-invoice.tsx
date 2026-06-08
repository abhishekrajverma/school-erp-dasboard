'use client'

import * as React from 'react'
import { Download, Printer, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/format'
import {
  feeTypeLabel,
  getSchoolInvoiceMeta,
  PAYMENT_METHODS,
  type ParentFeePayment,
} from '@/lib/parent-fees'
import type { FeeRecordDto } from '@/lib/api/types/fees'

export function ParentFeeInvoiceDialog({
  open,
  onClose,
  payment,
  fee,
}: {
  open: boolean
  onClose: () => void
  payment: ParentFeePayment | null
  fee: FeeRecordDto | null
}) {
  const invoiceRef = React.useRef<HTMLDivElement>(null)
  const school = getSchoolInvoiceMeta()

  if (!payment) return null

  const methodLabel =
    PAYMENT_METHODS.find((m) => m.id === payment.paymentMethod)?.label ?? payment.paymentMethod

  const handlePrint = () => {
    const content = invoiceRef.current
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html><head><title>Receipt ${payment.receiptNo}</title>
      <style>
        body { font-family: system-ui, sans-serif; padding: 24px; max-width: 640px; margin: 0 auto; }
        h1 { font-size: 1.25rem; margin: 0 0 4px; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        td, th { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 1.1rem; }
        .muted { color: #666; font-size: 0.875rem; }
      </style></head><body>${content.innerHTML}</body></html>
    `)
    win.document.close()
    win.print()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Payment receipt
          </DialogTitle>
          <DialogDescription>
            Invoice generated for your payment. Download or print for your records.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={invoiceRef}
          className="rounded-xl border border-border bg-linear-to-br from-muted/30 to-background p-5 space-y-4"
        >
          <div className="flex justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">{school.schoolName}</h2>
              <p className="text-xs text-muted-foreground mt-1">{school.address}</p>
              <p className="text-xs text-muted-foreground">{school.phone}</p>
            </div>
            <div className="text-right text-xs">
              <p className="font-semibold text-foreground">TAX INVOICE / RECEIPT</p>
              <p className="text-muted-foreground mt-1">{payment.receiptNo}</p>
              <p className="text-muted-foreground">{formatDate(payment.paidAt.split('T')[0])}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Student</p>
              <p className="font-medium">{payment.studentName}</p>
              <p className="text-muted-foreground">Class {payment.class}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Paid by</p>
              <p className="font-medium">{payment.parentName}</p>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="py-2 text-left font-medium">Description</th>
                <th className="py-2 text-left font-medium">Invoice</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/60">
                <td className="py-3">{feeTypeLabel(payment.feeType)}</td>
                <td className="py-3 text-muted-foreground">{payment.invoiceNo}</td>
                <td className="py-3 text-right font-semibold tabular-nums">
                  {formatCurrency(payment.amount)}
                </td>
              </tr>
            </tbody>
          </table>

          {fee && (fee.discount > 0 || fee.fine > 0) && (
            <div className="text-xs text-muted-foreground space-y-1">
              {fee.discount > 0 && <p>Discount on invoice: {formatCurrency(fee.discount)}</p>}
              {fee.fine > 0 && <p>Late fine on invoice: {formatCurrency(fee.fine)}</p>}
            </div>
          )}

          <div className="flex justify-between items-center rounded-lg bg-primary/10 px-4 py-3">
            <span className="font-medium">Amount paid</span>
            <span className="text-xl font-bold text-primary tabular-nums">
              {formatCurrency(payment.amount)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Transaction ID:</span>
              <br />
              {payment.transactionId}
            </p>
            <p className="text-right">
              <span className="font-medium text-foreground">Payment mode:</span>
              <br />
              {methodLabel}
            </p>
          </div>

          <p className="text-[10px] text-center text-muted-foreground pt-2">
            This is a computer-generated receipt. No signature required.
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button className="gap-2" onClick={handlePrint}>
            <Download className="h-4 w-4" />
            Download / Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
