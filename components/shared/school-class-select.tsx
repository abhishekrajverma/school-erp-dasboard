'use client'

import * as React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useSchoolClasses } from '@/hooks/use-school-classes'

type SchoolClassSelectProps = {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  /** Additional class names (e.g. from API records not in master data). */
  extraClasses?: string[]
  disabled?: boolean
  showEmptyHint?: boolean
}

export function SchoolClassSelect({
  value,
  onValueChange,
  placeholder = 'Select class',
  extraClasses = [],
  disabled,
  showEmptyHint = true,
}: SchoolClassSelectProps) {
  const { mergeWith } = useSchoolClasses()
  const options = React.useMemo(() => mergeWith(extraClasses), [mergeWith, extraClasses])

  return (
    <>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || options.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder={options.length === 0 ? 'No classes configured' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {showEmptyHint && options.length === 0 && (
        <p className="mt-1 text-xs text-muted-foreground">
          Add classes in Settings → Master Data → Classes & sections.
        </p>
      )}
    </>
  )
}
