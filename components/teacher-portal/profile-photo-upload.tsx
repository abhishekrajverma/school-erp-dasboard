'use client'

import * as React from 'react'
import { Camera, Loader2, Upload, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  PROFILE_PHOTO_ACCEPT,
  PROFILE_PHOTO_MAX_BYTES,
} from '@/lib/teacher-portal'

interface ProfilePhotoUploadProps {
  id: string
  name: string
  photoUrl: string
  fallbackInitials: string
  hasCustomPhoto: boolean
  onChange: (dataUrl: string | null) => void
  error?: string
}

function validateProfilePhoto(file: File): string | null {
  const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '')
  const typeOk =
    file.type === 'image/jpeg' ||
    file.type === 'image/jpg' ||
    file.type === 'image/png' ||
    ext === '.jpg' ||
    ext === '.jpeg' ||
    ext === '.png'
  if (!typeOk) return 'Only JPG or PNG images are allowed'
  if (file.size > PROFILE_PHOTO_MAX_BYTES) return 'Photo must be under 5 MB'
  return null
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read image'))
    reader.readAsDataURL(file)
  })
}

export function ProfilePhotoUpload({
  id,
  name,
  photoUrl,
  fallbackInitials,
  hasCustomPhoto,
  onChange,
  error,
}: ProfilePhotoUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [uploadProgress, setUploadProgress] = React.useState(0)
  const [localError, setLocalError] = React.useState<string | null>(null)

  const processFile = React.useCallback(
    async (file: File) => {
      const validationError = validateProfilePhoto(file)
      if (validationError) {
        setLocalError(validationError)
        return
      }
      setLocalError(null)
      setIsUploading(true)
      setUploadProgress(0)

      try {
        for (const step of [25, 55, 85, 100]) {
          await new Promise((r) => setTimeout(r, 60))
          setUploadProgress(step)
        }
        const dataUrl = await readFileAsDataUrl(file)
        onChange(dataUrl)
      } catch {
        setLocalError('Could not upload photo. Please try again.')
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
        if (inputRef.current) inputRef.current.value = ''
      }
    },
    [onChange],
  )

  const handleFiles = (files: FileList | null) => {
    const file = files?.[0]
    if (file) void processFile(file)
  }

  const displayError = error ?? localError

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div
          className="relative shrink-0"
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragging(false)
            handleFiles(e.dataTransfer.files)
          }}
        >
          <Avatar
            className={cn(
              'h-28 w-28 ring-4 ring-background shadow-lg transition-all',
              isDragging && 'ring-primary scale-[1.02]',
            )}
          >
            <AvatarImage src={photoUrl} alt={name} />
            <AvatarFallback className="text-xl font-semibold">{fallbackInitials}</AvatarFallback>
          </Avatar>
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105"
              aria-label="Change profile photo"
            >
              <Camera className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-3 min-w-0">
          <div>
            <p className="text-sm font-medium">Profile photo</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Passport-style photo · JPG or PNG · Max 5 MB
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={isUploading}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload photo
            </Button>
            {hasCustomPhoto && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-destructive"
                disabled={isUploading}
                onClick={() => {
                  setLocalError(null)
                  onChange(null)
                  if (inputRef.current) inputRef.current.value = ''
                }}
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          {isUploading && (
            <Progress value={uploadProgress} className="h-1.5 max-w-xs" />
          )}
        </div>
      </div>

      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 transition-colors cursor-pointer sm:hidden',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50 hover:bg-muted/30',
          displayError && 'border-destructive/50',
        )}
      >
        <Upload className="h-6 w-6 text-muted-foreground" />
        <p className="text-xs text-muted-foreground text-center">
          Tap to upload or drag a photo here
        </p>
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        className="sr-only"
        accept={PROFILE_PHOTO_ACCEPT}
        onChange={(e) => handleFiles(e.target.files)}
        aria-invalid={!!displayError}
      />

      {displayError && (
        <p className="text-xs text-destructive" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}
