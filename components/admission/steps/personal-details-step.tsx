'use client'

import type { UseFormReturn } from 'react-hook-form'
import { User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormField } from '@/components/shared/page-components'
import { SchoolClassSelect } from '@/components/shared/school-class-select'
import { FormCard, FormGrid } from '@/components/admission/form-card'
import { YesNoField } from '@/components/admission/yes-no-field'
import type { AdmissionFormValues } from '@/lib/admission/types'
import {
  ACADEMIC_SESSION_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
} from '@/lib/admission/constants'
import { formatAadhaar } from '@/lib/admission/validators'

interface StepProps {
  form: UseFormReturn<AdmissionFormValues>
}

export function PersonalDetailsStep({ form }: StepProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  return (
    <FormCard
      title="Student Personal Details"
      description="Enter the applicant's basic information as per official documents."
      icon={<User className="h-5 w-5" />}
    >
      <FormGrid>
        <FormField label="First Name" required error={errors.firstName?.message}>
          <Input {...register('firstName')} placeholder="As per birth certificate" autoComplete="given-name" />
        </FormField>
        <FormField label="Last Name" required error={errors.lastName?.message}>
          <Input {...register('lastName')} placeholder="Surname / family name" autoComplete="family-name" />
        </FormField>
        <FormField label="Gender" required error={errors.gender?.message}>
          <Select value={watch('gender')} onValueChange={(v) => setValue('gender', v as AdmissionFormValues['gender'], { shouldValidate: true })}>
            <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Date of Birth" required error={errors.dateOfBirth?.message}>
          <Input type="date" {...register('dateOfBirth')} max={new Date().toISOString().split('T')[0]} />
        </FormField>
        <FormField label="Place of Birth" required error={errors.placeOfBirth?.message}>
          <Input {...register('placeOfBirth')} placeholder="City, State" />
        </FormField>
        <FormField label="Religion" required error={errors.religion?.message}>
          <Input {...register('religion')} placeholder="e.g., Hindu, Muslim, Christian" />
        </FormField>
        <FormField label="Category" required error={errors.category?.message}>
          <Select value={watch('category')} onValueChange={(v) => setValue('category', v as AdmissionFormValues['category'], { shouldValidate: true })}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Aadhaar Number" error={errors.aadhaarNumber?.message}>
          <Input
            {...register('aadhaarNumber')}
            placeholder="XXXX XXXX XXXX"
            inputMode="numeric"
            maxLength={14}
            onChange={(e) => setValue('aadhaarNumber', formatAadhaar(e.target.value), { shouldValidate: true })}
          />
        </FormField>
        <FormField label="Blood Group" error={errors.bloodGroup?.message}>
          <Select value={watch('bloodGroup') || ''} onValueChange={(v) => setValue('bloodGroup', v)}>
            <SelectTrigger><SelectValue placeholder="Select blood group" /></SelectTrigger>
            <SelectContent>
              {BLOOD_GROUP_OPTIONS.map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Class To Which Admission Is Sought" required error={errors.classSought?.message}>
          <SchoolClassSelect
            value={watch('classSought')}
            onValueChange={(v) => setValue('classSought', v, { shouldValidate: true })}
          />
        </FormField>
        <FormField label="Academic Session" required error={errors.academicSession?.message}>
          <Select value={watch('academicSession')} onValueChange={(v) => setValue('academicSession', v, { shouldValidate: true })}>
            <SelectTrigger><SelectValue placeholder="Select session" /></SelectTrigger>
            <SelectContent>
              {ACADEMIC_SESSION_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label="Previous School Transfer Case"
          required
          error={errors.previousSchoolTransfer?.message}
          className="sm:col-span-2"
        >
          <YesNoField
            id="transfer"
            value={watch('previousSchoolTransfer')}
            onChange={(v) => setValue('previousSchoolTransfer', v, { shouldValidate: true })}
          />
        </FormField>
      </FormGrid>
    </FormCard>
  )
}
