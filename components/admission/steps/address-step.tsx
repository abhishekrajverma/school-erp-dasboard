'use client'

import type { UseFormReturn } from 'react-hook-form'
import { MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField } from '@/components/shared/page-components'
import { FormCard, FormGrid } from '@/components/admission/form-card'
import type { AdmissionFormValues } from '@/lib/admission/types'
import { INDIAN_STATES } from '@/lib/admission/constants'
import { formatIndianMobile } from '@/lib/admission/validators'

interface StepProps {
  form: UseFormReturn<AdmissionFormValues>
}

export function AddressStep({ form }: StepProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  return (
    <FormCard
      title="Present Address"
      description="Residential address and contact details for correspondence."
      icon={<MapPin className="h-5 w-5" />}
    >
      <FormGrid>
        <FormField label="House Number" required error={errors.houseNumber?.message}>
          <Input {...register('houseNumber')} placeholder="Flat / House No." />
        </FormField>
        <FormField label="Street / Locality" required error={errors.street?.message}>
          <Input {...register('street')} placeholder="Street, colony, landmark" />
        </FormField>
        <FormField label="City" required error={errors.city?.message}>
          <Input {...register('city')} placeholder="City" autoComplete="address-level2" />
        </FormField>
        <FormField label="State" required error={errors.state?.message}>
          <Select value={watch('state')} onValueChange={(v) => setValue('state', v, { shouldValidate: true })}>
            <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
            <SelectContent className="max-h-60">
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="PIN Code" required error={errors.pinCode?.message}>
          <Input
            {...register('pinCode')}
            placeholder="6-digit PIN"
            inputMode="numeric"
            maxLength={6}
          />
        </FormField>
        <FormField label="Country" error={errors.country?.message}>
          <Input {...register('country')} readOnly className="bg-muted/50" />
        </FormField>
        <FormField label="Primary Mobile Number" required error={errors.primaryMobile?.message}>
          <Input
            {...register('primaryMobile')}
            placeholder="10-digit mobile"
            inputMode="tel"
            maxLength={11}
            onChange={(e) => setValue('primaryMobile', formatIndianMobile(e.target.value), { shouldValidate: true })}
          />
        </FormField>
        <FormField label="Alternate Mobile Number" error={errors.alternateMobile?.message}>
          <Input
            {...register('alternateMobile')}
            placeholder="Optional"
            inputMode="tel"
            maxLength={11}
            onChange={(e) => setValue('alternateMobile', formatIndianMobile(e.target.value), { shouldValidate: true })}
          />
        </FormField>
        <FormField label="Email Address" required error={errors.email?.message} className="sm:col-span-2">
          <Input type="email" {...register('email')} placeholder="parent@email.com" autoComplete="email" />
        </FormField>
      </FormGrid>
    </FormCard>
  )
}
