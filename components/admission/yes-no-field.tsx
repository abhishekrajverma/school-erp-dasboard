'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

interface YesNoFieldProps {
  value: 'yes' | 'no'
  onChange: (value: 'yes' | 'no') => void
  label?: string
  id?: string
  className?: string
  disabled?: boolean
}

export function YesNoField({
  value,
  onChange,
  label,
  id,
  className,
  disabled,
}: YesNoFieldProps) {
  const groupId = id ?? 'yes-no'
  return (
    <div className={cn('space-y-3', className)}>
      {label && (
        <Label id={`${groupId}-label`} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as 'yes' | 'no')}
        className="flex flex-row gap-6"
        aria-labelledby={label ? `${groupId}-label` : undefined}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yes" id={`${groupId}-yes`} aria-label="Yes" />
          <Label htmlFor={`${groupId}-yes`} className="font-normal cursor-pointer">
            Yes
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="no" id={`${groupId}-no`} aria-label="No" />
          <Label htmlFor={`${groupId}-no`} className="font-normal cursor-pointer">
            No
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
