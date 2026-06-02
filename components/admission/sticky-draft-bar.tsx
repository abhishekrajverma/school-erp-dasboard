'use client'

import { Save, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface StickyDraftBarProps {
  onSaveDraft: () => void
  isSaving?: boolean
  lastSavedAt?: string | null
  className?: string
}

export function StickyDraftBar({
  onSaveDraft,
  isSaving,
  lastSavedAt,
  className,
}: StickyDraftBarProps) {
  const formattedTime = lastSavedAt
    ? new Date(lastSavedAt).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  return (
    <div
      className={cn(
        'sticky bottom-0 z-30 -mx-4 sm:-mx-6 lg:-mx-8 mt-6 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 sm:px-6 lg:px-8 py-3',
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          {formattedTime ? (
            <span>Draft saved {formattedTime}</span>
          ) : (
            <span>Changes are auto-saved as you fill the form</span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="gap-2 shrink-0"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Draft
        </Button>
      </div>
    </div>
  )
}
