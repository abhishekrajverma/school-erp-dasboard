'use client'

import * as React from 'react'
import { CalendarRange, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/shared/page-components'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFinancialYear } from '@/components/providers/financial-year-provider'
import {
  displayFinancialYear,
  formatFinancialYearsList,
  normalizeFinancialYear,
  parseFinancialYearsList,
  type FinancialYearConfig,
} from '@/lib/financial-year'
import { useToast } from '@/hooks/use-toast'

export function FinancialYearSettingsPanel() {
  const { toast } = useToast()
  const { config, saveConfig, availableFinancialYears } = useFinancialYear()
  const [draft, setDraft] = React.useState<FinancialYearConfig>(config)

  React.useEffect(() => {
    setDraft(config)
  }, [config])

  const parsedYears = React.useMemo(
    () => parseFinancialYearsList(draft.financialYearsList),
    [draft.financialYearsList],
  )

  const handleSave = () => {
    const years = parseFinancialYearsList(draft.financialYearsList)
    const defaultFinancialYear = years.includes(normalizeFinancialYear(draft.defaultFinancialYear))
      ? normalizeFinancialYear(draft.defaultFinancialYear)
      : years[years.length - 1]

    saveConfig({
      ...draft,
      financialYearsList: formatFinancialYearsList(years),
      defaultFinancialYear,
    })

    toast({
      title: 'Financial year settings saved',
      description: draft.hideFinancialYearUi
        ? 'FY selector is hidden in the dashboard. Admins still choose FY at login.'
        : 'Admins can switch FY from the dashboard header.',
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarRange className="h-4 w-4" />
            Financial Year
          </CardTitle>
          <CardDescription>
            Configure which years your school can use. Each FY keeps separate students, fees, and
            master data. Data is scoped when admins log in with a selected year.
          </CardDescription>
        </div>
        <Button size="sm" className="gap-2 shrink-0" onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField label="Available financial years">
          <Input
            value={draft.financialYearsList}
            onChange={(event) =>
              setDraft((prev) => ({ ...prev, financialYearsList: event.target.value }))
            }
            placeholder="2023-24, 2024-25, 2025-26"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated, e.g. 2023-24, 2024-25, 2025-26
          </p>
        </FormField>

        <FormField label="Default financial year">
          <Select
            value={normalizeFinancialYear(draft.defaultFinancialYear)}
            onValueChange={(value) =>
              setDraft((prev) => ({ ...prev, defaultFinancialYear: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select default year" />
            </SelectTrigger>
            <SelectContent>
              {parsedYears.map((year) => (
                <SelectItem key={year} value={year}>
                  FY {displayFinancialYear(year)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div className="space-y-1 pr-4">
            <p className="text-sm font-medium">Hide financial year in dashboard</p>
            <p className="text-xs text-muted-foreground">
              Hides the FY switcher from the admin header. Admins still pick a year when logging in.
            </p>
          </div>
          <Switch
            checked={draft.hideFinancialYearUi}
            onCheckedChange={(checked) =>
              setDraft((prev) => ({ ...prev, hideFinancialYearUi: checked }))
            }
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Active years:{' '}
          {availableFinancialYears.map((y) => displayFinancialYear(y)).join(', ') || 'None configured'}
        </p>
      </CardContent>
    </Card>
  )
}
