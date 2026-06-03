'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileText,
  Loader2,
  Receipt,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SlideOver } from '@/components/shared/slide-over'
import { StatCard, Tabs } from '@/components/shared/page-components'
import { StatusBadge } from '@/components/shared/data-table'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { FeeRecord } from '@/lib/erp-data'
import {
  getParentChildFees,
  getParentPaymentHistory,
  payParentFee,
  summarizeParentFees,
  feeTypeLabel,
  PAYMENT_METHODS,
  type ParentFeePayment,
  type PaymentMethodId,
} from '@/lib/parent-fees'
import { ParentFeeInvoiceDialog } from '@/components/parent-portal/parent-fee-invoice'

type FeeFilter = 'all' | 'pending' | 'paid'

export function ParentFeesPanel({
  studentId,
  studentName,
  parentId,
  parentName,
}: {
  studentId: string
  studentName: string
  parentId: string
  parentName: string
}) {
  const { toast } = useToast()
  const [fees, setFees] = React.useState<FeeRecord[]>([])
  const [payments, setPayments] = React.useState<ParentFeePayment[]>([])
  const [filter, setFilter] = React.useState<FeeFilter>('all')
  const [payingFee, setPayingFee] = React.useState<FeeRecord | null>(null)
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethodId>('upi')
  const [isPaying, setIsPaying] = React.useState(false)
  const [lastPayment, setLastPayment] = React.useState<ParentFeePayment | null>(null)
  const [lastPaidFee, setLastPaidFee] = React.useState<FeeRecord | null>(null)
  const [showInvoice, setShowInvoice] = React.useState(false)
  const [viewPayment, setViewPayment] = React.useState<ParentFeePayment | null>(null)

  const refresh = React.useCallback(() => {
    setFees(getParentChildFees(studentId))
    setPayments(getParentPaymentHistory(parentId, studentId))
  }, [studentId, parentId])

  React.useEffect(() => {
    refresh()
  }, [refresh])

  const summary = summarizeParentFees(fees)
  const filteredFees = fees.filter((f) => {
    if (filter === 'pending') return f.pending > 0
    if (filter === 'paid') return f.status === 'paid' && f.pending === 0
    return true
  })

  const handlePay = async () => {
    if (!payingFee || payingFee.pending <= 0) return
    setIsPaying(true)
    await new Promise((r) => setTimeout(r, 1200))
    try {
      const { updatedFee, payment } = payParentFee({
        fee: payingFee,
        amount: payingFee.pending,
        paymentMethod,
        parentId,
        parentName,
      })
      refresh()
      setPayingFee(null)
      setLastPayment(payment)
      setLastPaidFee(updatedFee)
      setShowInvoice(true)
      toast({
        title: 'Payment successful',
        description: `${formatCurrency(payment.amount)} paid for ${feeTypeLabel(payment.feeType)}.`,
      })
    } catch (e) {
      toast({
        title: 'Payment failed',
        description: e instanceof Error ? e.message : 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsPaying(false)
    }
  }

  const openReceipt = (payment: ParentFeePayment) => {
    const fee = fees.find((f) => f.id === payment.feeRecordId) ?? null
    setViewPayment(payment)
    setLastPaidFee(fee)
    setLastPayment(payment)
    setShowInvoice(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold tracking-tight">Fees — {studentName}</h3>
        <p className="text-sm text-muted-foreground">
          Pay pending fees securely and download invoices for your records
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total fees"
          value={formatCurrency(summary.total)}
          icon={Wallet}
        />
        <StatCard
          title="Paid"
          value={formatCurrency(summary.paid)}
          changeType="positive"
          icon={CheckCircle2}
        />
        <StatCard
          title="Amount due"
          value={formatCurrency(summary.pending)}
          change={summary.overdue > 0 ? `${summary.overdue} overdue` : undefined}
          changeType={summary.overdue > 0 ? 'negative' : 'neutral'}
          icon={CreditCard}
        />
        <StatCard
          title="Invoices"
          value={summary.invoiceCount}
          change={summary.pendingCount ? `${summary.pendingCount} to pay` : 'All clear'}
          changeType="neutral"
          icon={FileText}
        />
      </div>

      {summary.pending > 0 && (
        <Card className="overflow-hidden border-primary/20">
          <div className="bg-linear-to-r from-primary/15 via-primary/5 to-transparent px-5 py-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Pay outstanding balance</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(summary.pending)} due across {summary.pendingCount} invoice
                    {summary.pendingCount !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="gap-2 shadow-md"
                onClick={() => {
                  const next = fees.find((f) => f.pending > 0)
                  if (next) setPayingFee(next)
                }}
              >
                Pay now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Tabs
        tabs={[
          { id: 'all', label: 'All', count: fees.length },
          {
            id: 'pending',
            label: 'Due',
            count: fees.filter((f) => f.pending > 0).length,
          },
          {
            id: 'paid',
            label: 'Paid',
            count: fees.filter((f) => f.pending === 0).length,
          },
        ]}
        activeTab={filter}
        onChange={(id) => setFilter(id as FeeFilter)}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredFees.map((fee, index) => {
          const progress = fee.totalFee > 0 ? Math.round((fee.paid / fee.totalFee) * 100) : 0
          const canPay = fee.pending > 0

          return (
            <motion.div
              key={fee.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  'relative overflow-hidden transition-shadow hover:shadow-md',
                  fee.status === 'overdue' && 'border-destructive/40',
                  canPay && 'ring-1 ring-primary/10',
                )}
              >
                {fee.status === 'overdue' && (
                  <div className="absolute left-0 top-0 h-1 w-full bg-destructive" />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{feeTypeLabel(fee.feeType)}</CardTitle>
                      <CardDescription className="font-mono text-xs">
                        {fee.invoiceNo}
                      </CardDescription>
                    </div>
                    <StatusBadge status={fee.status} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-1.5 flex justify-between text-xs">
                      <span className="text-muted-foreground">Payment progress</span>
                      <span className="font-medium tabular-nums">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-muted/50 px-2 py-2">
                      <p className="text-[10px] uppercase text-muted-foreground">Total</p>
                      <p className="text-sm font-semibold tabular-nums">
                        {formatCurrency(fee.totalFee)}
                      </p>
                    </div>
                    <div className="rounded-lg bg-success/10 px-2 py-2">
                      <p className="text-[10px] uppercase text-muted-foreground">Paid</p>
                      <p className="text-sm font-semibold tabular-nums text-success">
                        {formatCurrency(fee.paid)}
                      </p>
                    </div>
                    <div
                      className={cn(
                        'rounded-lg px-2 py-2',
                        canPay ? 'bg-primary/10' : 'bg-muted/50',
                      )}
                    >
                      <p className="text-[10px] uppercase text-muted-foreground">Due</p>
                      <p
                        className={cn(
                          'text-sm font-semibold tabular-nums',
                          canPay && 'text-primary',
                        )}
                      >
                        {formatCurrency(fee.pending)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>Due {formatDate(fee.dueDate)}</span>
                    {fee.paidDate && <span>Paid {formatDate(fee.paidDate)}</span>}
                    {fee.fine > 0 && (
                      <Badge variant="destructive" className="text-[10px]">
                        Fine {formatCurrency(fee.fine)}
                      </Badge>
                    )}
                    {fee.discount > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        −{formatCurrency(fee.discount)} discount
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {canPay ? (
                      <Button className="flex-1 gap-2" onClick={() => setPayingFee(fee)}>
                        <CreditCard className="h-4 w-4" />
                        Pay {formatCurrency(fee.pending)}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1 gap-2"
                        onClick={() => {
                          const p = payments.find((pay) => pay.feeRecordId === fee.id)
                          if (p) {
                            openReceipt(p)
                            return
                          }
                          toast({
                            title: 'Receipt on file',
                            description: `Invoice ${fee.invoiceNo} was paid at school. Contact office for a copy.`,
                          })
                        }}
                      >
                        <Receipt className="h-4 w-4" />
                        View receipt
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredFees.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No invoices in this category.
          </CardContent>
        </Card>
      )}

      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your payment history</CardTitle>
            <CardDescription>Payments made by you for {studentName} only</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {payments.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm">{feeTypeLabel(p.feeType)}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.receiptNo} · {formatDate(p.paidAt.split('T')[0])}
                  </p>
                </div>
                <p className="font-semibold tabular-nums text-success">
                  {formatCurrency(p.amount)}
                </p>
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => openReceipt(p)}>
                  <FileText className="h-3.5 w-3.5" />
                  Invoice
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <SlideOver
        open={!!payingFee}
        onClose={() => !isPaying && setPayingFee(null)}
        title="Pay school fee"
        description={
          payingFee
            ? `${feeTypeLabel(payingFee.feeType)} · ${payingFee.invoiceNo}`
            : undefined
        }
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" disabled={isPaying} onClick={() => setPayingFee(null)}>
              Cancel
            </Button>
            <Button disabled={isPaying} onClick={handlePay} className="gap-2 min-w-[140px]">
              {isPaying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  Confirm payment
                  {payingFee && ` · ${formatCurrency(payingFee.pending)}`}
                </>
              )}
            </Button>
          </div>
        }
      >
        {payingFee && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Student</span>
                <span className="font-medium">{studentName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Invoice</span>
                <span className="font-mono">{payingFee.invoiceNo}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="font-medium">Amount to pay</span>
                <span className="text-xl font-bold text-primary tabular-nums">
                  {formatCurrency(payingFee.pending)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Payment method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as PaymentMethodId)}
                className="grid gap-2"
              >
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3 transition-colors hover:bg-muted/40',
                      paymentMethod === m.id && 'border-primary bg-primary/5',
                    )}
                  >
                    <RadioGroupItem value={m.id} />
                    <span className="text-sm font-medium">{m.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <p className="text-xs text-muted-foreground">
              Demo payment — no real money is charged. A receipt will be generated instantly.
            </p>
          </div>
        )}
      </SlideOver>

      <ParentFeeInvoiceDialog
        open={showInvoice}
        onClose={() => {
          setShowInvoice(false)
          setViewPayment(null)
        }}
        payment={viewPayment ?? lastPayment}
        fee={lastPaidFee}
      />
    </div>
  )
}
