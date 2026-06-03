'use client'

import {
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

type ToastVisualVariant = 'default' | 'success' | 'warning' | 'destructive'

const ICONS: Record<ToastVisualVariant, LucideIcon> = {
  default: Sparkles,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
}

const ICON_STYLES: Record<ToastVisualVariant, string> = {
  default: 'bg-primary/12 text-primary ring-primary/20',
  success: 'bg-emerald-500/12 text-emerald-600 ring-emerald-500/20 dark:text-emerald-400',
  warning: 'bg-amber-500/12 text-amber-600 ring-amber-500/20 dark:text-amber-400',
  destructive: 'bg-destructive-foreground/15 text-destructive-foreground ring-destructive-foreground/20',
}

const PROGRESS_STYLES: Record<ToastVisualVariant, string> = {
  default: 'bg-primary/70',
  success: 'bg-emerald-500/80',
  warning: 'bg-amber-500/80',
  destructive: 'bg-destructive-foreground/70',
}

function inferVisualVariant(
  variant: ToastVisualVariant | undefined,
  title: React.ReactNode,
): ToastVisualVariant {
  if (variant && variant !== 'default') return variant

  const text = String(title ?? '').toLowerCase()
  if (/deleted|error|failed|invalid|denied|rejected/.test(text)) return 'destructive'
  if (/warning|caution|pending review/.test(text)) return 'warning'
  if (
    /saved|updated|submitted|created|marked|downloaded|processed|uploaded|removed|success|checked in|sent|paid|added/.test(
      text,
    )
  ) {
    return 'success'
  }
  return variant ?? 'default'
}

function ToastProgress({
  duration,
  variant,
}: {
  duration: number
  variant: ToastVisualVariant
}) {
  return (
    <div
      className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-b-xl bg-muted/30"
      aria-hidden
    >
      <div
        className={cn('h-full w-full origin-left toast-progress-bar', PROGRESS_STYLES[variant])}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  )
}

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, action, duration, variant, ...props }) => {
        const visualVariant = inferVisualVariant(variant as ToastVisualVariant | undefined, title)
        const Icon = ICONS[visualVariant]
        const toastDuration = duration ?? 5000

        return (
          <Toast key={id} variant={visualVariant} duration={toastDuration} {...props}>
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1',
                ICON_STYLES[visualVariant],
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <div className="grid min-w-0 flex-1 gap-0.5 pb-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
            <ToastProgress duration={toastDuration} variant={visualVariant} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
