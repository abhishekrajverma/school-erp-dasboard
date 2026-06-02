'use client'

import * as React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { CheckSquare, Square, Wallet, Percent, IndianRupee } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormSection, FormField } from '@/components/shared/page-components'
import { SCHOOL_FEE_TYPES } from '@/lib/fees/constants'
import { calculateMultiFeeTotals } from '@/lib/fees/calculations'
import { formatCurrency } from '@/lib/format'
import type { MultiFeePaymentFormData } from '@/lib/schemas'
import { cn } from '@/lib/utils'

interface MultiFeePaymentFormProps {
  form: UseFormReturn<MultiFeePaymentFormData>
  classOptions: string[]
}

export function MultiFeePaymentForm({ form, classOptions }: MultiFeePaymentFormProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form

  const feeLines = watch('feeLines')
  const watched = watch()
  const totals = calculateMultiFeeTotals(watched)

  const allSelected = feeLines.every((l) => l.enabled)
  const someSelected = feeLines.some((l) => l.enabled)

  const toggleAll = (enabled: boolean) => {
    feeLines.forEach((_, index) => {
      setValue(`feeLines.${index}.enabled`, enabled, { shouldDirty: true })
    })
  }

  const payFullAmount = () => {
    setValue('amountPaying', totals.netPayable, { shouldDirty: true })
    if (totals.netPayable >= totals.netPayable && totals.balance === 0) {
      setValue('status', 'paid')
    } else if (totals.netPayable > 0) {
      setValue('status', totals.amountPaying > 0 ? 'pending' : 'pending')
    }
  }

  React.useEffect(() => {
    if (totals.amountPaying >= totals.netPayable && totals.netPayable > 0) {
      setValue('status', 'paid')
    } else if (totals.amountPaying > 0 && totals.balance > 0) {
      setValue('status', 'pending')
    }
  }, [totals.amountPaying, totals.netPayable, totals.balance, setValue])

  const getFeeLabel = (feeType: string) =>
    SCHOOL_FEE_TYPES.find((f) => f.id === feeType)?.label ?? feeType

  return (
    <div className="space-y-6">
      <FormSection title="Student Details" description="Select student and due date for this payment.">
        <FormField label="Student Name" required error={errors.studentName?.message}>
          <Input {...register('studentName')} placeholder="Enter student name" />
        </FormField>
        <FormField label="Class" required error={errors.class?.message}>
          <Select value={watch('class')} onValueChange={(v) => setValue('class', v, { shouldValidate: true })}>
            <SelectTrigger>
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {classOptions.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Due Date" required error={errors.dueDate?.message}>
          <Input type="date" {...register('dueDate')} />
        </FormField>
      </FormSection>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-medium">Fee Types — Pay Together</h3>
            <p className="text-sm text-muted-foreground">
              Select one or more fees and enter amounts. All selected fees are paid on this single invoice.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => toggleAll(!allSelected)}
            >
              {allSelected ? (
                <Square className="h-3.5 w-3.5" />
              ) : (
                <CheckSquare className="h-3.5 w-3.5" />
              )}
              {allSelected ? 'Clear All' : 'Select All'}
            </Button>
          </div>
        </div>

        {errors.feeLines?.message && (
          <p className="text-xs text-destructive" role="alert">
            {typeof errors.feeLines.message === 'string'
              ? errors.feeLines.message
              : 'Please fix fee line errors'}
          </p>
        )}

        <div className="rounded-xl border border-border overflow-hidden">
          <div className="hidden sm:grid sm:grid-cols-[auto_1fr_120px_120px] gap-3 bg-muted/50 px-4 py-2.5 text-xs font-medium text-muted-foreground border-b border-border">
            <span className="w-8" />
            <span>Fee Type</span>
            <span>Amount (₹)</span>
            <span>Line Discount (₹)</span>
          </div>
          <div className="divide-y divide-border">
            {feeLines.map((line, index) => {
              const meta = SCHOOL_FEE_TYPES.find((f) => f.id === line.feeType)
              return (
                <div
                  key={line.feeType}
                  className={cn(
                    'grid gap-3 p-4 sm:grid-cols-[auto_1fr_120px_120px] sm:items-center sm:gap-3 transition-colors',
                    line.enabled && 'bg-primary/5',
                  )}
                >
                  <Checkbox
                    id={`fee-${line.feeType}`}
                    checked={line.enabled}
                    onCheckedChange={(checked) =>
                      setValue(`feeLines.${index}.enabled`, checked === true, {
                        shouldValidate: true,
                      })
                    }
                    aria-label={`Include ${meta?.label}`}
                  />
                  <div className="space-y-0.5 min-w-0">
                    <Label
                      htmlFor={`fee-${line.feeType}`}
                      className="font-medium cursor-pointer capitalize"
                    >
                      {getFeeLabel(line.feeType)}
                    </Label>
                    {meta?.description && (
                      <p className="text-xs text-muted-foreground">{meta.description}</p>
                    )}
                  </div>
                  <FormField label="Amount" className="sm:space-y-1">
                    <Input
                      type="number"
                      min={0}
                      disabled={!line.enabled}
                      {...register(`feeLines.${index}.amount`, { valueAsNumber: true })}
                      placeholder="0"
                      className="h-9"
                    />
                  </FormField>
                  <FormField label="Discount" className="sm:space-y-1">
                    <Input
                      type="number"
                      min={0}
                      disabled={!line.enabled}
                      {...register(`feeLines.${index}.lineDiscount`, { valueAsNumber: true })}
                      placeholder="0"
                      className="h-9"
                    />
                  </FormField>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <Separator />

      <FormSection
        title="Discount & Adjustments"
        description="Apply overall discount on top of line discounts, or add a fine."
      >
        <FormField label="Global Discount (₹)" error={errors.globalDiscount?.message}>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min={0}
              className="pl-9"
              {...register('globalDiscount', { valueAsNumber: true })}
            />
          </div>
        </FormField>
        <FormField label="Discount (%)" error={errors.discountPercent?.message}>
          <div className="relative">
            <Percent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="number"
              min={0}
              max={100}
              className="pl-9"
              {...register('discountPercent', { valueAsNumber: true })}
            />
          </div>
        </FormField>
        <FormField label="Fine / Late Fee (₹)" error={errors.fine?.message}>
          <Input type="number" min={0} {...register('fine', { valueAsNumber: true })} />
        </FormField>
      </FormSection>

      <FormSection title="Payment" description="Enter amount received now. Use Pay Full to settle all selected fees at once.">
        <FormField label="Amount Paying Now (₹)" required>
          <div className="flex gap-2">
            <Input
              type="number"
              min={0}
              {...register('amountPaying', { valueAsNumber: true })}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              className="gap-1.5 shrink-0"
              onClick={payFullAmount}
              disabled={!someSelected || totals.netPayable <= 0}
            >
              <Wallet className="h-4 w-4" />
              Pay Full
            </Button>
          </div>
        </FormField>
        <FormField label="Payment Method">
          <Select
            value={watch('paymentMethod') || ''}
            onValueChange={(v) =>
              setValue('paymentMethod', v as MultiFeePaymentFormData['paymentMethod'])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Status">
          <Select
            value={watch('status')}
            onValueChange={(v) => setValue('status', v as MultiFeePaymentFormData['status'])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </FormSection>

      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal ({feeLines.filter((l) => l.enabled).length} fees)</span>
          <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
        </div>
        {totals.lineDiscountTotal > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Line discounts</span>
            <span>−{formatCurrency(totals.lineDiscountTotal)}</span>
          </div>
        )}
        {(totals.globalDiscount > 0 || totals.percentDiscountAmount > 0) && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Global discount</span>
            <span>
              −{formatCurrency(totals.globalDiscount + totals.percentDiscountAmount)}
            </span>
          </div>
        )}
        {totals.fine > 0 && (
          <div className="flex justify-between text-destructive">
            <span>Fine</span>
            <span>+{formatCurrency(totals.fine)}</span>
          </div>
        )}
        <Separator className="my-2" />
        <div className="flex justify-between text-base font-semibold">
          <span>Net payable</span>
          <span>{formatCurrency(totals.netPayable)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Paying now</span>
          <span className="font-medium text-green-600 dark:text-green-400">
            {formatCurrency(totals.amountPaying)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Balance due</span>
          <span className={cn('font-medium', totals.balance > 0 && 'text-yellow-600 dark:text-yellow-400')}>
            {formatCurrency(totals.balance)}
          </span>
        </div>
      </div>
    </div>
  )
}
