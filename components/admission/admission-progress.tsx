'use client'

import { Check } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  ADMISSION_STEPS,
  type AdmissionStepId,
} from '@/lib/admission/constants'

interface AdmissionProgressProps {
  currentStep: AdmissionStepId
}

export function AdmissionProgress({ currentStep }: AdmissionProgressProps) {
  const currentIndex = ADMISSION_STEPS.findIndex((s) => s.id === currentStep)
  const progressPercent =
    currentStep === 'review'
      ? 100
      : Math.round((currentIndex / (ADMISSION_STEPS.length - 1)) * 100)

  return (
    <nav aria-label="Form progress" className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">Application progress</span>
        <span className="text-muted-foreground">{progressPercent}% complete</span>
      </div>
      <Progress value={progressPercent} className="h-2" />

      <ol className="hidden lg:flex items-center justify-between gap-1">
        {ADMISSION_STEPS.map((step, index) => {
          const isComplete = index < currentIndex
          const isCurrent = step.id === currentStep
          return (
            <li
              key={step.id}
              className={cn(
                'flex flex-1 flex-col items-center gap-2 text-center',
                index < ADMISSION_STEPS.length - 1 && 'relative',
              )}
            >
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                  isComplete && 'border-primary bg-primary text-primary-foreground',
                  isCurrent && 'border-primary bg-primary/10 text-primary',
                  !isComplete && !isCurrent && 'border-muted-foreground/30 text-muted-foreground',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" aria-hidden />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'text-xs font-medium leading-tight max-w-[5.5rem]',
                  isCurrent && 'text-foreground',
                  !isCurrent && 'text-muted-foreground',
                )}
              >
                {step.shortLabel}
              </span>
            </li>
          )
        })}
      </ol>

      <p className="lg:hidden text-sm text-muted-foreground">
        Step {currentIndex + 1} of {ADMISSION_STEPS.length}:{' '}
        <span className="font-medium text-foreground">
          {ADMISSION_STEPS[currentIndex]?.label}
        </span>
      </p>
    </nav>
  )
}
