'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Users, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { FormField } from '@/components/shared/page-components'
import { FormCard, FormGrid } from '@/components/admission/form-card'
import { YesNoField } from '@/components/admission/yes-no-field'
import type { AdmissionFormValues } from '@/lib/admission/types'
import { formatAadhaar, formatIndianMobile } from '@/lib/admission/validators'

interface StepProps {
  form: UseFormReturn<AdmissionFormValues>
}

export function ParentsStep({ form }: StepProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  const livesWithGuardian = watch('livesWithGuardian')

  return (
    <div className="space-y-6">
      <FormCard title="Father's Details" icon={<UserCircle className="h-5 w-5" />}>
        <FormGrid>
          <FormField label="Father's Name" required error={errors.fatherName?.message}>
            <Input {...register('fatherName')} placeholder="Full name" />
          </FormField>
          <FormField label="Academic Qualification" error={errors.fatherQualification?.message}>
            <Input {...register('fatherQualification')} placeholder="e.g., B.Tech, M.A." />
          </FormField>
          <FormField label="Occupation" required error={errors.fatherOccupation?.message}>
            <Input {...register('fatherOccupation')} placeholder="Profession" />
          </FormField>
          <FormField label="Organization / Company Name" error={errors.fatherOrganization?.message}>
            <Input {...register('fatherOrganization')} />
          </FormField>
          <FormField label="Office Address" error={errors.fatherOfficeAddress?.message} className="sm:col-span-2">
            <Textarea {...register('fatherOfficeAddress')} rows={2} />
          </FormField>
          <FormField label="Office Telephone" error={errors.fatherOfficePhone?.message}>
            <Input {...register('fatherOfficePhone')} inputMode="tel" />
          </FormField>
          <FormField label="Mobile Number" required error={errors.fatherMobile?.message}>
            <Input
              {...register('fatherMobile')}
              inputMode="tel"
              maxLength={11}
              onChange={(e) => setValue('fatherMobile', formatIndianMobile(e.target.value), { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Annual Income" error={errors.fatherAnnualIncome?.message}>
            <Input {...register('fatherAnnualIncome')} placeholder="e.g., 12,00,000" />
          </FormField>
          <FormField label="Aadhaar Number" error={errors.fatherAadhaar?.message}>
            <Input
              {...register('fatherAadhaar')}
              maxLength={14}
              onChange={(e) => setValue('fatherAadhaar', formatAadhaar(e.target.value), { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Email Address" error={errors.fatherEmail?.message}>
            <Input type="email" {...register('fatherEmail')} />
          </FormField>
        </FormGrid>
      </FormCard>

      <FormCard title="Mother's Details" icon={<UserCircle className="h-5 w-5" />}>
        <FormGrid>
          <FormField label="Mother's Name" required error={errors.motherName?.message}>
            <Input {...register('motherName')} placeholder="Full name" />
          </FormField>
          <FormField label="Academic Qualification" error={errors.motherQualification?.message}>
            <Input {...register('motherQualification')} />
          </FormField>
          <FormField label="Occupation" error={errors.motherOccupation?.message}>
            <Input {...register('motherOccupation')} />
          </FormField>
          <FormField label="Organization / Company Name" error={errors.motherOrganization?.message}>
            <Input {...register('motherOrganization')} />
          </FormField>
          <FormField label="Office Address" error={errors.motherOfficeAddress?.message} className="sm:col-span-2">
            <Textarea {...register('motherOfficeAddress')} rows={2} />
          </FormField>
          <FormField label="Office Telephone" error={errors.motherOfficePhone?.message}>
            <Input {...register('motherOfficePhone')} inputMode="tel" />
          </FormField>
          <FormField label="Mobile Number" required error={errors.motherMobile?.message}>
            <Input
              {...register('motherMobile')}
              inputMode="tel"
              maxLength={11}
              onChange={(e) => setValue('motherMobile', formatIndianMobile(e.target.value), { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Annual Income" error={errors.motherAnnualIncome?.message}>
            <Input {...register('motherAnnualIncome')} />
          </FormField>
          <FormField label="Aadhaar Number" error={errors.motherAadhaar?.message}>
            <Input
              {...register('motherAadhaar')}
              maxLength={14}
              onChange={(e) => setValue('motherAadhaar', formatAadhaar(e.target.value), { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Email Address" error={errors.motherEmail?.message}>
            <Input type="email" {...register('motherEmail')} />
          </FormField>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Guardian Details"
        description="Complete only if the student lives with a guardian."
        icon={<Users className="h-5 w-5" />}
      >
        <FormField
          label="Student Lives With Guardian"
          className="mb-4"
        >
          <YesNoField
            id="guardian"
            value={livesWithGuardian}
            onChange={(v) => setValue('livesWithGuardian', v, { shouldValidate: true })}
          />
        </FormField>

        {livesWithGuardian === 'yes' && (
          <>
            <Separator className="mb-4" />
            <FormGrid>
              <FormField label="Guardian Name" required error={errors.guardianName?.message}>
                <Input {...register('guardianName')} />
              </FormField>
              <FormField label="Relationship" error={errors.guardianRelationship?.message}>
                <Input {...register('guardianRelationship')} placeholder="e.g., Uncle, Grandmother" />
              </FormField>
              <FormField label="Occupation" error={errors.guardianOccupation?.message}>
                <Input {...register('guardianOccupation')} />
              </FormField>
              <FormField label="Mobile Number" required error={errors.guardianMobile?.message}>
                <Input
                  {...register('guardianMobile')}
                  inputMode="tel"
                  maxLength={11}
                  onChange={(e) => setValue('guardianMobile', formatIndianMobile(e.target.value), { shouldValidate: true })}
                />
              </FormField>
              <FormField label="Email Address" error={errors.guardianEmail?.message}>
                <Input type="email" {...register('guardianEmail')} />
              </FormField>
              <FormField label="Address" error={errors.guardianAddress?.message} className="sm:col-span-2">
                <Textarea {...register('guardianAddress')} rows={2} />
              </FormField>
            </FormGrid>
          </>
        )}
      </FormCard>
    </div>
  )
}
