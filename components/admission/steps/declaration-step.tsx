'use client'

import type { UseFormReturn } from 'react-hook-form'
import { FileSignature } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FormField } from '@/components/shared/page-components'
import { FormCard, FormGrid } from '@/components/admission/form-card'
import type { AdmissionFormValues } from '@/lib/admission/types'

interface StepProps {
  form: UseFormReturn<AdmissionFormValues>
}

export function DeclarationStep({ form }: StepProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  const declarationTruth = watch('declarationTruth')
  const declarationPolicy = watch('declarationPolicy')

  return (
    <FormCard
      title="Declaration"
      description="Please read carefully and sign below to submit your application."
      icon={<FileSignature className="h-5 w-5" />}
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="declarationTruth"
              checked={declarationTruth === true}
              onCheckedChange={(checked) =>
                setValue('declarationTruth', checked === true ? true : (false as unknown as true), {
                  shouldValidate: true,
                })
              }
              aria-invalid={!!errors.declarationTruth}
            />
            <Label htmlFor="declarationTruth" className="font-normal leading-relaxed cursor-pointer">
              I hereby declare that all information provided by me is true and correct.
              <span className="text-destructive ml-1">*</span>
            </Label>
          </div>
          {errors.declarationTruth && (
            <p className="text-xs text-destructive pl-7">{errors.declarationTruth.message}</p>
          )}

          <div className="flex items-start gap-3">
            <Checkbox
              id="declarationPolicy"
              checked={declarationPolicy === true}
              onCheckedChange={(checked) =>
                setValue('declarationPolicy', checked === true ? true : (false as unknown as true), {
                  shouldValidate: true,
                })
              }
              aria-invalid={!!errors.declarationPolicy}
            />
            <Label htmlFor="declarationPolicy" className="font-normal leading-relaxed cursor-pointer">
              I agree to the school&apos;s admission policies and terms.
              <span className="text-destructive ml-1">*</span>
            </Label>
          </div>
          {errors.declarationPolicy && (
            <p className="text-xs text-destructive pl-7">{errors.declarationPolicy.message}</p>
          )}
        </div>

        <FormGrid>
          <FormField label="Parent / Guardian Signature" required error={errors.parentSignature?.message}>
            <Input {...register('parentSignature')} placeholder="Type full name as signature" />
          </FormField>
          <FormField label="Student Signature" required error={errors.studentSignature?.message}>
            <Input {...register('studentSignature')} placeholder="Type student name as signature" />
          </FormField>
          <FormField label="Date" className="sm:col-span-2">
            <Input {...register('declarationDate')} type="date" readOnly className="bg-muted/50 max-w-xs" />
          </FormField>
        </FormGrid>
      </div>
    </FormCard>
  )
}
