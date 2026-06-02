'use client'

import type { UseFormReturn } from 'react-hook-form'
import { FileUp } from 'lucide-react'
import { FormCard } from '@/components/admission/form-card'
import { FileUpload } from '@/components/admission/file-upload'
import type { AdmissionFormValues } from '@/lib/admission/types'
import { DOCUMENT_FIELDS } from '@/lib/admission/constants'
import type { UploadedFileMeta } from '@/lib/admission/types'

interface StepProps {
  form: UseFormReturn<AdmissionFormValues>
  documentErrors?: Record<string, string>
}

export function DocumentsStep({ form, documentErrors = {} }: StepProps) {
  const { watch, setValue } = form

  return (
    <FormCard
      title="Document Uploads"
      description="Upload clear scans or photos. Required documents are marked with an asterisk."
      icon={<FileUp className="h-5 w-5" />}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {DOCUMENT_FIELDS.map((doc) => {
          const key = doc.key as keyof AdmissionFormValues
          const value = watch(key) as UploadedFileMeta | null
          return (
            <FileUpload
              key={doc.key}
              id={`upload-${doc.key}`}
              label={doc.label}
              description={doc.description}
              required={doc.required}
              value={value}
              onChange={(file) =>
                setValue(key, file, { shouldValidate: true, shouldDirty: true })
              }
              error={documentErrors[doc.key]}
            />
          )
        })}
      </div>
    </FormCard>
  )
}
