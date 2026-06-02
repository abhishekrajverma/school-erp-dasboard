'use client'

import type { UseFormReturn } from 'react-hook-form'
import {
  User,
  MapPin,
  Users,
  BookOpen,
  FileUp,
  FileSignature,
  Pencil,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FormCard } from '@/components/admission/form-card'
import type { AdmissionFormValues } from '@/lib/admission/types'
import { DOCUMENT_FIELDS, GENDER_OPTIONS, CATEGORY_OPTIONS } from '@/lib/admission/constants'
import type { AdmissionStepId } from '@/lib/admission/constants'

interface ReviewStepProps {
  form: UseFormReturn<AdmissionFormValues>
  onEditStep: (step: AdmissionStepId) => void
}

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  if (!value?.trim()) return null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 py-2 border-b border-border/50 last:border-0">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium sm:col-span-2">{value}</dd>
    </div>
  )
}

function SectionHeader({
  title,
  step,
  onEdit,
}: {
  title: string
  step: AdmissionStepId
  onEdit: (step: AdmissionStepId) => void
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-sm font-semibold">{title}</h4>
      <Button type="button" variant="ghost" size="sm" className="gap-1 h-8" onClick={() => onEdit(step)}>
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </Button>
    </div>
  )
}

export function ReviewStep({ form, onEditStep }: ReviewStepProps) {
  const data = form.getValues()

  const genderLabel = GENDER_OPTIONS.find((g) => g.value === data.gender)?.label
  const categoryLabel = CATEGORY_OPTIONS.find((c) => c.value === data.category)?.label

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm">
          Please review all information carefully before submitting. Use{' '}
          <strong>Edit</strong> to make changes to any section.
        </p>
      </div>

      <FormCard title="Student Personal Details" icon={<User className="h-5 w-5" />}>
        <SectionHeader title="" step="personal" onEdit={onEditStep} />
        <dl>
          <ReviewRow label="Full Name" value={`${data.firstName} ${data.lastName}`} />
          <ReviewRow label="Gender" value={genderLabel} />
          <ReviewRow label="Date of Birth" value={data.dateOfBirth} />
          <ReviewRow label="Place of Birth" value={data.placeOfBirth} />
          <ReviewRow label="Religion" value={data.religion} />
          <ReviewRow label="Category" value={categoryLabel} />
          <ReviewRow label="Aadhaar" value={data.aadhaarNumber} />
          <ReviewRow label="Blood Group" value={data.bloodGroup} />
          <ReviewRow label="Class Sought" value={data.classSought} />
          <ReviewRow label="Academic Session" value={data.academicSession} />
          <ReviewRow
            label="Transfer Case"
            value={data.previousSchoolTransfer === 'yes' ? 'Yes' : 'No'}
          />
        </dl>
      </FormCard>

      <FormCard title="Present Address" icon={<MapPin className="h-5 w-5" />}>
        <SectionHeader title="" step="address" onEdit={onEditStep} />
        <dl>
          <ReviewRow
            label="Address"
            value={`${data.houseNumber}, ${data.street}, ${data.city}, ${data.state} - ${data.pinCode}, ${data.country}`}
          />
          <ReviewRow label="Primary Mobile" value={data.primaryMobile} />
          <ReviewRow label="Alternate Mobile" value={data.alternateMobile} />
          <ReviewRow label="Email" value={data.email} />
        </dl>
      </FormCard>

      <FormCard title="Parents & Guardian" icon={<Users className="h-5 w-5" />}>
        <SectionHeader title="" step="parents" onEdit={onEditStep} />
        <dl>
          <ReviewRow label="Father" value={`${data.fatherName} · ${data.fatherOccupation} · ${data.fatherMobile}`} />
          <ReviewRow label="Mother" value={`${data.motherName} · ${data.motherMobile}`} />
          {data.livesWithGuardian === 'yes' && (
            <ReviewRow label="Guardian" value={`${data.guardianName} (${data.guardianRelationship})`} />
          )}
        </dl>
      </FormCard>

      {(data.previousSchoolName || data.siblingInSameSchool === 'yes') && (
        <FormCard title="Academic & References" icon={<BookOpen className="h-5 w-5" />}>
          <SectionHeader title="" step="academic" onEdit={onEditStep} />
          <dl>
            <ReviewRow label="Previous School" value={data.previousSchoolName} />
            <ReviewRow label="Board" value={data.previousBoard} />
            {data.siblings?.length > 0 && (
              <ReviewRow
                label="Siblings"
                value={data.siblings.map((s) => s.name).filter(Boolean).join(', ')}
              />
            )}
            <ReviewRow label="Reference" value={data.referenceName} />
          </dl>
        </FormCard>
      )}

      <FormCard title="Documents" icon={<FileUp className="h-5 w-5" />}>
        <SectionHeader title="" step="documents" onEdit={onEditStep} />
        <div className="flex flex-wrap gap-2">
          {DOCUMENT_FIELDS.map((doc) => {
            const file = data[doc.key as keyof AdmissionFormValues] as { name?: string } | null
            return (
              <Badge
                key={doc.key}
                variant={file?.name ? 'secondary' : 'outline'}
                className={!file?.name && doc.required ? 'border-destructive/50 text-destructive' : ''}
              >
                {doc.label}: {file?.name ?? (doc.required ? 'Missing' : 'Not uploaded')}
              </Badge>
            )
          })}
        </div>
      </FormCard>

      <FormCard title="Declaration" icon={<FileSignature className="h-5 w-5" />}>
        <SectionHeader title="" step="declaration" onEdit={onEditStep} />
        <dl>
          <ReviewRow label="Declarations" value={data.declarationTruth && data.declarationPolicy ? 'Accepted' : 'Pending'} />
          <ReviewRow label="Parent Signature" value={data.parentSignature} />
          <ReviewRow label="Student Signature" value={data.studentSignature} />
          <ReviewRow label="Date" value={data.declarationDate} />
        </dl>
      </FormCard>

      <Separator />
    </div>
  )
}
