'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { AdmissionHeader } from '@/components/admission/admission-header'
import { AdmissionProgress } from '@/components/admission/admission-progress'
import { StickyDraftBar } from '@/components/admission/sticky-draft-bar'
import { PersonalDetailsStep } from '@/components/admission/steps/personal-details-step'
import { AddressStep } from '@/components/admission/steps/address-step'
import { ParentsStep } from '@/components/admission/steps/parents-step'
import { AcademicStep } from '@/components/admission/steps/academic-step'
import { DocumentsStep } from '@/components/admission/steps/documents-step'
import { DeclarationStep } from '@/components/admission/steps/declaration-step'
import { ReviewStep } from '@/components/admission/steps/review-step'
import { useToast } from '@/hooks/use-toast'
import {
  ADMISSION_STEPS,
  type AdmissionStepId,
} from '@/lib/admission/constants'
import {
  admissionFormSchema,
  admissionDefaultValues,
  STEP_FIELDS,
  validateDocumentsStep,
  sanitizeMobileFields,
} from '@/lib/admission/schema'
import type { AdmissionFormValues } from '@/lib/admission/types'
import {
  loadAdmissionDraft,
  saveAdmissionDraft,
  clearAdmissionDraft,
} from '@/lib/admission/storage'

const AUTO_SAVE_MS = 3000

export function AdmissionFormWizard() {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = React.useState<AdmissionStepId>('personal')
  const [lastSavedAt, setLastSavedAt] = React.useState<string | null>(null)
  const [isDraftSaving, setIsDraftSaving] = React.useState(false)
  const [documentErrors, setDocumentErrors] = React.useState<Record<string, string>>({})
  const [submittedId, setSubmittedId] = React.useState<string | null>(null)
  const [hydrated, setHydrated] = React.useState(false)

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: admissionDefaultValues,
    mode: 'onBlur',
  })

  const { watch, trigger, handleSubmit, reset, getValues } = form

  React.useEffect(() => {
    const draft = loadAdmissionDraft()
    if (draft?.data) {
      reset({ ...admissionDefaultValues, ...draft.data } as AdmissionFormValues)
      if (draft.currentStep && ADMISSION_STEPS.some((s) => s.id === draft.currentStep)) {
        setCurrentStep(draft.currentStep as AdmissionStepId)
      }
      setLastSavedAt(draft.lastSavedAt)
      toast({
        title: 'Draft restored',
        description: 'Your previous application draft has been loaded.',
      })
    }
    setHydrated(true)
  }, [reset, toast])

  const persistDraft = React.useCallback(
    async (silent = false) => {
      setIsDraftSaving(true)
      const payload = saveAdmissionDraft(
        { ...getValues(), declarationDate: new Date().toISOString().split('T')[0] },
        currentStep,
      )
      setLastSavedAt(payload.lastSavedAt)
      setIsDraftSaving(false)
      if (!silent) {
        toast({ title: 'Draft saved', description: 'You can continue later from this device.' })
      }
    },
    [currentStep, getValues, toast],
  )

  React.useEffect(() => {
    if (!hydrated) return
    let timer: ReturnType<typeof setTimeout>
    const subscription = watch(() => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        void persistDraft(true)
      }, AUTO_SAVE_MS)
    })
    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [watch, persistDraft, hydrated])

  const currentIndex = ADMISSION_STEPS.findIndex((s) => s.id === currentStep)

  const validateCurrentStep = async (): Promise<boolean> => {
    if (currentStep === 'review') return true

    if (currentStep === 'documents') {
      const values = getValues()
      const docResult = validateDocumentsStep(values)
      setDocumentErrors(docResult.errors)
      if (!docResult.success) return false
    }

    const fields = STEP_FIELDS[currentStep] as readonly (keyof AdmissionFormValues)[]
    const valid = await trigger([...fields])
    return valid
  }

  const goNext = async () => {
    const valid = await validateCurrentStep()
    if (!valid) {
      toast({
        title: 'Please fix errors',
        description: 'Some required fields need your attention before continuing.',
        variant: 'destructive',
      })
      return
    }
    if (currentIndex < ADMISSION_STEPS.length - 1) {
      setCurrentStep(ADMISSION_STEPS[currentIndex + 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentStep(ADMISSION_STEPS[currentIndex - 1].id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submitApplication = handleSubmit(
    async (data) => {
      const sanitized = sanitizeMobileFields(data)
      const applicationId = `ADM-${Date.now().toString(36).toUpperCase()}`
      clearAdmissionDraft()
      setSubmittedId(applicationId)
      toast({
        title: 'Application submitted successfully',
        description: `Your application ID is ${applicationId}. You will receive a confirmation email shortly.`,
      })
      console.info('[Admission] Submitted', { applicationId, sanitized })
    },
    () => {
      const docResult = validateDocumentsStep(getValues())
      setDocumentErrors(docResult.errors)
      toast({
        title: 'Submission failed',
        description: 'Please review all sections and fix validation errors.',
        variant: 'destructive',
      })
    },
  )

  const startNewApplication = () => {
    clearAdmissionDraft()
    reset(admissionDefaultValues)
    setCurrentStep('personal')
    setSubmittedId(null)
    setDocumentErrors({})
    setLastSavedAt(null)
  }

  if (!hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (submittedId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-lg text-center space-y-6 py-12"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Application Submitted</h2>
          <p className="text-muted-foreground">
            Thank you for applying. Your application has been received and is under review.
          </p>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">Application ID</p>
          <p className="text-xl font-mono font-bold text-primary">{submittedId}</p>
        </div>
        <Button onClick={startNewApplication} variant="outline" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Start New Application
        </Button>
      </motion.div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 'personal':
        return <PersonalDetailsStep form={form} />
      case 'address':
        return <AddressStep form={form} />
      case 'parents':
        return <ParentsStep form={form} />
      case 'academic':
        return <AcademicStep form={form} />
      case 'documents':
        return <DocumentsStep form={form} documentErrors={documentErrors} />
      case 'declaration':
        return <DeclarationStep form={form} />
      case 'review':
        return <ReviewStep form={form} onEditStep={setCurrentStep} />
      default:
        return null
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (currentStep === 'review') void submitApplication(e)
        }}
        className="space-y-6"
        noValidate
      >
        <AdmissionHeader academicSession={watch('academicSession')} />

        <AdmissionProgress currentStep={currentStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between pt-2 pb-20">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex flex-col sm:flex-row gap-2">
            {currentStep === 'review' ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void persistDraft(false)}
                  disabled={isDraftSaving}
                >
                  Save Draft
                </Button>
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" />
                  Submit Application
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => void goNext()} className="gap-2">
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <StickyDraftBar
          onSaveDraft={() => void persistDraft(false)}
          isSaving={isDraftSaving}
          lastSavedAt={lastSavedAt}
        />
      </form>
    </Form>
  )
}
