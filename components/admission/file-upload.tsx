'use client'

import * as React from 'react'
import { FileText, ImageIcon, Upload, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  ALLOWED_FILE_EXTENSIONS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '@/lib/admission/constants'
import type { UploadedFileMeta } from '@/lib/admission/types'

interface FileUploadProps {
  id: string
  label: string
  description?: string
  required?: boolean
  value: UploadedFileMeta | null
  onChange: (file: UploadedFileMeta | null) => void
  error?: string
}

function validateFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  const typeOk =
    (ALLOWED_FILE_TYPES as readonly string[]).includes(file.type) ||
    file.type === 'image/jpg' ||
    (ALLOWED_FILE_EXTENSIONS as readonly string[]).includes(ext)
  if (!typeOk) return 'Only JPG, PNG, and PDF files are allowed'
  if (file.size > MAX_FILE_SIZE_BYTES) return 'File size must be under 10 MB'
  return null
}

function fileToMeta(file: File): UploadedFileMeta {
  const isImage = file.type.startsWith('image/')
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    previewUrl: isImage ? URL.createObjectURL(file) : undefined,
  }
}

export function FileUpload({
  id,
  label,
  description,
  required,
  value,
  onChange,
  error,
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [isUploading, setIsUploading] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)

  React.useEffect(() => {
    return () => {
      if (value?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(value.previewUrl)
      }
    }
  }, [value?.previewUrl])

  const processFile = React.useCallback(
    async (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setLocalError(validationError)
        return
      }
      setLocalError(null)
      setIsUploading(true)
      setUploadProgress(0)

      const steps = [20, 45, 70, 90, 100]
      for (const step of steps) {
        await new Promise((r) => setTimeout(r, 80))
        setUploadProgress(step)
      }

      if (value?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(value.previewUrl)
      }
      onChange(fileToMeta(file))
      setIsUploading(false)
      setUploadProgress(0)
    },
    [onChange, value?.previewUrl],
  )

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (file) void processFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const displayError = error ?? localError

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground hover:text-destructive"
            onClick={() => {
              if (value.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(value.previewUrl)
              }
              onChange(null)
              if (inputRef.current) inputRef.current.value = ''
            }}
            aria-label={`Remove ${label}`}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {value ? (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
          {value.previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value.previewUrl}
              alt={`Preview of ${value.name}`}
              className="h-16 w-16 rounded-md object-cover border border-border"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary/10">
              {value.type === 'application/pdf' ? (
                <FileText className="h-8 w-8 text-primary" />
              ) : (
                <ImageIcon className="h-8 w-8 text-primary" />
              )}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{value.name}</p>
            <p className="text-xs text-muted-foreground">
              {(value.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              inputRef.current?.click()
            }
          }}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/30',
            displayError && 'border-destructive/50',
          )}
          aria-describedby={displayError ? `${id}-error` : undefined}
        >
          {isUploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading…</p>
              <Progress value={uploadProgress} className="w-full max-w-xs h-1.5" />
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium">Drag & drop or click to upload</p>
              <p className="text-xs text-muted-foreground text-center">
                JPG, PNG, PDF · Max 10 MB
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        className="sr-only"
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        onChange={(e) => handleFiles(e.target.files)}
        aria-invalid={!!displayError}
      />

      {displayError && (
        <p id={`${id}-error`} className="text-xs text-destructive" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}
