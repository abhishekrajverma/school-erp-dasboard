'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  formatWorkingDaysLabel,
  parseWorkingDays,
  serializeWorkingDays,
  WEEKDAY_OPTIONS,
} from '@/lib/master-data/format'
import { cn } from '@/lib/utils'

type WorkingDaysSelectProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function WorkingDaysSelect({ value, onChange, disabled, className }: WorkingDaysSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selected = React.useMemo(() => parseWorkingDays(value), [value])

  const toggleDay = (dayId: string) => {
    const next = selected.includes(dayId)
      ? selected.filter((id) => id !== dayId)
      : [...selected, dayId]
    onChange(serializeWorkingDays(next))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-9 w-full justify-between px-3 font-normal',
            selected.length === 0 && 'text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{formatWorkingDaysLabel(value)}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
        <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Select working days</p>
        <ul className="space-y-1">
          {WEEKDAY_OPTIONS.map((day) => {
            const checked = selected.includes(day.id)
            return (
              <li key={day.id}>
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/60"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleDay(day.id)}
                  />
                  <span>{day.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{day.id}</span>
                </label>
              </li>
            )
          })}
        </ul>
        {selected.length === 0 && (
          <p className="mt-2 px-2 text-xs text-destructive">Select at least one working day</p>
        )}
      </PopoverContent>
    </Popover>
  )
}
