'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: React.ReactNode
}

const sizeClasses = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-2xl',
  xl: 'sm:max-w-4xl',
}

/** Centered form modal (used app-wide for add/edit flows). */
export function SlideOver({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
}: SlideOverProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          'flex max-h-[min(90vh,900px)] w-full max-w-[calc(100%-2rem)] flex-col gap-0 overflow-hidden rounded-2xl border-border/60 p-0 shadow-2xl',
          sizeClasses[size]
        )}
      >
        <div className="relative shrink-0 border-b border-border/60 bg-gradient-to-br from-primary/8 via-background to-background px-6 py-5">
          <DialogHeader className="space-y-1.5 pr-10 text-left">
            <DialogTitle className="text-xl font-semibold tracking-tight">{title}</DialogTitle>
            {description && (
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-9 w-9 rounded-full hover:bg-muted"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <DialogFooter className="shrink-0 gap-3 border-t border-border/60 bg-muted/25 px-6 py-4 sm:justify-end">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

/** Alias for clearer naming in new code. */
export const FormModal = SlideOver
