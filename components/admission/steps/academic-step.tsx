'use client'

import type { UseFormReturn, FieldArrayWithId } from 'react-hook-form'
import { useFieldArray } from 'react-hook-form'
import { BookOpen, Users, UserPlus, Plus, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
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
import { BOARD_OPTIONS } from '@/lib/admission/constants'
import { formatIndianMobile } from '@/lib/admission/validators'

interface StepProps {
  form: UseFormReturn<AdmissionFormValues>
}

export function AcademicStep({ form }: StepProps) {
  const {
    register,
    control,
    formState: { errors },
    setValue,
    watch,
  } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'siblings',
  })

  const siblingInSchool = watch('siblingInSameSchool')

  return (
    <div className="space-y-6">
      <FormCard
        title="School Last Attended (If Any)"
        description="Details of the previous school, if applicable."
        icon={<BookOpen className="h-5 w-5" />}
      >
        <FormGrid>
          <FormField label="Passing Year" error={errors.passingYear?.message}>
            <Input {...register('passingYear')} placeholder="e.g., 2025" inputMode="numeric" maxLength={4} />
          </FormField>
          <FormField label="School Name" error={errors.previousSchoolName?.message}>
            <Input {...register('previousSchoolName')} />
          </FormField>
          <FormField label="Area / Location" error={errors.previousSchoolArea?.message}>
            <Input {...register('previousSchoolArea')} />
          </FormField>
          <FormField label="Board" error={errors.previousBoard?.message}>
            <Select value={watch('previousBoard') || ''} onValueChange={(v) => setValue('previousBoard', v)}>
              <SelectTrigger><SelectValue placeholder="Select board" /></SelectTrigger>
              <SelectContent>
                {BOARD_OPTIONS.map((b) => (
                  <SelectItem key={b} value={b}>{b}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Percentage / GPA" error={errors.previousPercentage?.message}>
            <Input {...register('previousPercentage')} placeholder="e.g., 92% or 9.2 GPA" />
          </FormField>
          <FormField label="Reason For Leaving" error={errors.reasonForLeaving?.message} className="sm:col-span-2">
            <Textarea {...register('reasonForLeaving')} rows={2} />
          </FormField>
        </FormGrid>
      </FormCard>

      <FormCard
        title="Sibling Details"
        description="If a sibling is already studying in this school."
        icon={<Users className="h-5 w-5" />}
      >
        <FormField label="Sibling Studying In Same School" className="mb-4">
          <YesNoField
            id="sibling-school"
            value={siblingInSchool}
            onChange={(v) => {
              setValue('siblingInSameSchool', v)
              if (v === 'yes' && fields.length === 0) {
                append({ name: '', admissionNumber: '', class: '', section: '' })
              }
            }}
          />
        </FormField>

        {siblingInSchool === 'yes' && (
          <div className="space-y-4">
            {fields.map((field: FieldArrayWithId<AdmissionFormValues, 'siblings', 'id'>, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-border bg-muted/20 p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sibling {index + 1}</span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <FormGrid>
                  <FormField label="Sibling Name">
                    <Input {...register(`siblings.${index}.name`)} />
                  </FormField>
                  <FormField label="Admission Number">
                    <Input {...register(`siblings.${index}.admissionNumber`)} />
                  </FormField>
                  <FormField label="Class">
                    <SchoolClassSelect
                      value={watch(`siblings.${index}.class`) || ''}
                      onValueChange={(v) => setValue(`siblings.${index}.class`, v)}
                    />
                  </FormField>
                  <FormField label="Section">
                    <Input {...register(`siblings.${index}.section`)} placeholder="e.g., A" />
                  </FormField>
                </FormGrid>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => append({ name: '', admissionNumber: '', class: '', section: '' })}
            >
              <Plus className="h-4 w-4" />
              Add Another Sibling
            </Button>
          </div>
        )}
      </FormCard>

      <FormCard
        title="Reference Details"
        description="Reference, if any, who has recommended admission."
        icon={<UserPlus className="h-5 w-5" />}
      >
        <FormGrid>
          <FormField label="Reference Name" error={errors.referenceName?.message}>
            <Input {...register('referenceName')} />
          </FormField>
          <FormField label="Mobile Number" error={errors.referenceMobile?.message}>
            <Input
              {...register('referenceMobile')}
              inputMode="tel"
              maxLength={11}
              onChange={(e) => setValue('referenceMobile', formatIndianMobile(e.target.value), { shouldValidate: true })}
            />
          </FormField>
          <FormField label="Address" error={errors.referenceAddress?.message} className="sm:col-span-2">
            <Textarea {...register('referenceAddress')} rows={2} />
          </FormField>
          <FormField label="Relationship" error={errors.referenceRelationship?.message}>
            <Input {...register('referenceRelationship')} placeholder="e.g., Alumni, Staff" />
          </FormField>
        </FormGrid>
      </FormCard>
    </div>
  )
}
