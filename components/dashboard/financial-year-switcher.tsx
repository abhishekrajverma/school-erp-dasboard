'use client'

import * as React from 'react'
import { CalendarRange, Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useFinancialYear } from '@/components/providers/financial-year-provider'
import { displayFinancialYear } from '@/lib/financial-year'
import { cn } from '@/lib/utils'

export function FinancialYearSwitcher() {
  const {
    activeFinancialYear,
    availableFinancialYears,
    hideFinancialYearUi,
    setActiveFinancialYear,
  } = useFinancialYear()
  const [open, setOpen] = React.useState(false)
  const [isSwitching, setIsSwitching] = React.useState(false)

  if (hideFinancialYearUi) return null

  const handleSelect = async (value: string) => {
    if (value === activeFinancialYear) {
      setOpen(false)
      return
    }
    setIsSwitching(true)
    try {
      await setActiveFinancialYear(value)
    } finally {
      setIsSwitching(false)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 sm:inline-flex"
          disabled={isSwitching}
        >
          <CalendarRange className="h-4 w-4 text-primary" />
          <span>FY {displayFinancialYear(activeFinancialYear)}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search year…" />
          <CommandList>
            <CommandEmpty>No year found.</CommandEmpty>
            <CommandGroup heading="Financial year">
              {availableFinancialYears.map((year) => (
                <CommandItem key={year} value={year} onSelect={() => void handleSelect(year)}>
                  <span>FY {displayFinancialYear(year)}</span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      year === activeFinancialYear ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
