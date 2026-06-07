'use client'

import * as React from 'react'
import { ChevronDown, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  formatClassListLabel,
  getSuggestedClassNames,
  parseClassList,
  serializeClassList,
} from '@/lib/master-data/format'
import { cn } from '@/lib/utils'

type ClassListSelectProps = {
  value: string
  onChange: (value: string) => void
  classLabelPrefix?: string
  rangeClasses?: string[]
  disabled?: boolean
  className?: string
}

function sameClass(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

export function ClassListSelect({
  value,
  onChange,
  classLabelPrefix = 'Class',
  rangeClasses = [],
  disabled,
  className,
}: ClassListSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [customName, setCustomName] = React.useState('')
  const selected = React.useMemo(() => parseClassList(value), [value])
  const suggestions = React.useMemo(() => getSuggestedClassNames(classLabelPrefix), [classLabelPrefix])

  const setSelected = (classes: string[]) => {
    onChange(serializeClassList(classes))
  }

  const toggleClass = (name: string) => {
    const exists = selected.some((item) => sameClass(item, name))
    if (exists) {
      setSelected(selected.filter((item) => !sameClass(item, name)))
      return
    }
    setSelected([...selected, name.trim()])
  }

  const addCustomClass = () => {
    const name = customName.trim()
    if (!name) return
    if (selected.some((item) => sameClass(item, name))) {
      setCustomName('')
      return
    }
    setSelected([...selected, name])
    setCustomName('')
  }

  const removeClass = (name: string) => {
    setSelected(selected.filter((item) => !sameClass(item, name)))
  }

  const applyRange = () => {
    if (rangeClasses.length === 0) return
    setSelected(rangeClasses)
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
          <span className="truncate">{formatClassListLabel(value)}</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <div className="max-h-[min(24rem,70vh)] overflow-y-auto p-2">
          <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Suggested classes</p>
          <ul className="space-y-1">
            {suggestions.map((name) => {
              const checked = selected.some((item) => sameClass(item, name))
              return (
                <li key={name}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-muted/60">
                    <Checkbox checked={checked} onCheckedChange={() => toggleClass(name)} />
                    <span>{name}</span>
                  </label>
                </li>
              )
            })}
          </ul>

          <div className="my-3 border-t border-border" />

          <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">Add custom class</p>
          <div className="flex gap-2 px-2">
            <Input
              value={customName}
              onChange={(event) => setCustomName(event.target.value)}
              placeholder="e.g. Playgroup, Grade 5"
              className="h-8"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addCustomClass()
                }
              }}
            />
            <Button type="button" size="sm" variant="secondary" className="shrink-0 px-2" onClick={addCustomClass}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {selected.length > 0 && (
            <>
              <div className="my-3 border-t border-border" />
              <p className="mb-2 px-2 text-xs font-medium text-muted-foreground">
                Selected ({selected.length})
              </p>
              <ul className="space-y-1 px-2">
                {selected.map((name) => (
                  <li
                    key={name}
                    className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2 py-1.5 text-sm"
                  >
                    <span className="truncate">{name}</span>
                    <button
                      type="button"
                      className="rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                      onClick={() => removeClass(name)}
                      aria-label={`Remove ${name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {rangeClasses.length > 0 && (
          <div className="border-t border-border p-2">
            <Button type="button" variant="ghost" size="sm" className="h-8 w-full text-xs" onClick={applyRange}>
              Fill from start/end range ({rangeClasses.length} classes)
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
