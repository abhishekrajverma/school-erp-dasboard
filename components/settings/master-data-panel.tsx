'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Database, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormSection, FormField } from '@/components/shared/page-components'
import { masterDataSchema, type MasterDataFormData } from '@/lib/schemas'
import { useMasterData } from '@/hooks/use-master-data'
import { displayFinancialYear } from '@/lib/financial-year'
import { admissionNumberPlaceholder, formatEmployeeId, formatRollNumber, formatClassRangeSummary, buildClassRange, parseClassList, classListBounds } from '@/lib/master-data/format'
import { useToast } from '@/hooks/use-toast'
import { WorkingDaysSelect } from '@/components/settings/working-days-select'
import { ClassListSelect } from '@/components/settings/class-list-select'

export function MasterDataPanel() {
  const { toast } = useToast()
  const { data, save, financialYear } = useMasterData()

  const form = useForm<MasterDataFormData>({
    resolver: zodResolver(masterDataSchema),
    defaultValues: data,
  })

  React.useEffect(() => {
    form.reset({ ...data, academicYear: financialYear })
    const bounds = classListBounds(parseClassList(data.classList))
    if (bounds) {
      form.setValue('classStartFrom', bounds.start)
      form.setValue('classEndAt', bounds.end)
    }
  }, [data, form, financialYear])

  const watchPrefix = form.watch('admissionNumberPrefix')
  const watchStart = form.watch('admissionNumberStartFrom')
  const watchPad = form.watch('admissionNumberPadding')
  const watchClassStart = form.watch('classStartFrom')
  const watchClassEnd = form.watch('classEndAt')
  const watchClassLabelPrefix = form.watch('classLabelPrefix')
  const watchClassList = form.watch('classList')

  const previewAdmission = React.useMemo(() => {
    const preview = {
      ...data,
      admissionNumberPrefix: watchPrefix || data.admissionNumberPrefix,
      admissionNumberStartFrom: Number(watchStart) || data.admissionNumberStartFrom,
      admissionNumberPadding: Number(watchPad) || data.admissionNumberPadding,
    }
    return admissionNumberPlaceholder(preview)
  }, [data, watchPrefix, watchStart, watchPad])

  const previewClassRange = React.useMemo(() => {
    return formatClassRangeSummary({
      ...data,
      classStartFrom: watchClassStart || data.classStartFrom,
      classEndAt: watchClassEnd || data.classEndAt,
      classLabelPrefix: watchClassLabelPrefix || data.classLabelPrefix,
      classList: watchClassList ?? data.classList,
    })
  }, [data, watchClassStart, watchClassEnd, watchClassLabelPrefix, watchClassList])

  const rangeClassOptions = React.useMemo(() => {
    return buildClassRange({
      ...data,
      classStartFrom: watchClassStart || data.classStartFrom,
      classEndAt: watchClassEnd || data.classEndAt,
      classLabelPrefix: watchClassLabelPrefix || data.classLabelPrefix,
      classList: '',
    })
  }, [data, watchClassStart, watchClassEnd, watchClassLabelPrefix])

  const syncClassBoundsFromList = (classList: string) => {
    const bounds = classListBounds(parseClassList(classList))
    if (!bounds) {
      form.setValue('classStartFrom', '', { shouldDirty: true, shouldValidate: true })
      form.setValue('classEndAt', '', { shouldDirty: true, shouldValidate: true })
      return
    }
    form.setValue('classStartFrom', bounds.start, { shouldDirty: true, shouldValidate: true })
    form.setValue('classEndAt', bounds.end, { shouldDirty: true, shouldValidate: true })
  }

  const schoolClassOptions = React.useMemo(
    () => parseClassList(watchClassList ?? ''),
    [watchClassList],
  )

  const classEndOptions = React.useMemo(() => {
    const startIndex = schoolClassOptions.indexOf((watchClassStart ?? '').trim())
    if (startIndex < 0) return schoolClassOptions
    return schoolClassOptions.slice(startIndex)
  }, [schoolClassOptions, watchClassStart])

  const handleClassStartChange = (value: string) => {
    form.setValue('classStartFrom', value, { shouldDirty: true, shouldValidate: true })
    const startIndex = schoolClassOptions.indexOf(value)
    const currentEnd = (form.getValues('classEndAt') ?? '').trim()
    const endIndex = schoolClassOptions.indexOf(currentEnd)
    if (startIndex >= 0 && (endIndex < 0 || endIndex < startIndex)) {
      form.setValue('classEndAt', value, { shouldDirty: true, shouldValidate: true })
    }
  }

  const onSubmit = (values: MasterDataFormData) => {
    save({ ...values, academicYear: financialYear })
    toast({
      title: 'Master data saved',
      description: `School defaults updated for FY ${displayFinancialYear(financialYear)}.`,
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" />
              Master Data
            </CardTitle>
            <CardDescription>
              Configure admission numbers, calendar, sections, fees, and other defaults for{' '}
              <span className="font-medium text-foreground">
                FY {displayFinancialYear(financialYear)}
              </span>
              . Each financial year keeps its own master data.
            </CardDescription>
          </div>
          <Button size="sm" className="gap-2 shrink-0" onClick={form.handleSubmit(onSubmit)}>
            <Save className="h-4 w-4" />
            Save master data
          </Button>
        </CardHeader>
        <CardContent>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormSection
              title="Academic calendar"
              description="Session dates for the active financial year."
            >
              <FormField label="Financial year (active session)">
                <Input
                  value={`FY ${displayFinancialYear(financialYear)}`}
                  readOnly
                  disabled
                  className="bg-muted/40"
                />
              </FormField>
              <FormField label="Affiliation board">
                <Input {...form.register('affiliationBoard')} placeholder="CBSE, ICSE, State Board…" />
              </FormField>
              <FormField label="Session start">
                <Input type="date" {...form.register('sessionStartDate')} />
              </FormField>
              <FormField label="Session end">
                <Input type="date" {...form.register('sessionEndDate')} />
              </FormField>
              <FormField
                label="Working days"
                className="sm:col-span-2"
                error={form.formState.errors.workingDays?.message}
              >
                <Controller
                  name="workingDays"
                  control={form.control}
                  render={({ field }) => (
                    <WorkingDaysSelect value={field.value} onChange={field.onChange} />
                  )}
                />
              </FormField>
            </FormSection>

            <FormSection
              title="Admission & roll numbers"
              description="How new student IDs are generated in the Students module."
            >
              <FormField
                label="Admission no. prefix"
                required
                error={form.formState.errors.admissionNumberPrefix?.message}
              >
                <Input {...form.register('admissionNumberPrefix')} placeholder="ADM" />
              </FormField>
              <FormField
                label="Admission starts from"
                required
                error={form.formState.errors.admissionNumberStartFrom?.message}
              >
                <Input type="number" {...form.register('admissionNumberStartFrom', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Number padding (digits)" error={form.formState.errors.admissionNumberPadding?.message}>
                <Input type="number" min={3} max={8} {...form.register('admissionNumberPadding', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Preview">
                <Input readOnly value={previewAdmission} className="font-mono bg-muted/50" />
              </FormField>
              <FormField label="Roll number prefix">
                <Input {...form.register('rollNumberPrefix')} placeholder="Optional, e.g. R" />
              </FormField>
              <FormField label="Roll number starts from">
                <Input type="number" {...form.register('rollNumberStartFrom', { valueAsNumber: true })} />
              </FormField>
              <p className="sm:col-span-2 text-xs text-muted-foreground">
                Example roll no.:{' '}
                <span className="font-mono">{formatRollNumber({ ...data, ...form.getValues() }, 0)}</span>
              </p>
            </FormSection>

            <FormSection
              title="Classes & sections"
              description="Add every class your school offers, then set default sections."
            >
              <FormField
                label="School classes"
                required
                className="sm:col-span-2"
                error={form.formState.errors.classList?.message}
              >
                <Controller
                  name="classList"
                  control={form.control}
                  render={({ field }) => (
                    <ClassListSelect
                      value={field.value ?? ''}
                      onChange={(value) => {
                        field.onChange(value)
                        syncClassBoundsFromList(value)
                      }}
                      classLabelPrefix={watchClassLabelPrefix || data.classLabelPrefix}
                      rangeClasses={rangeClassOptions}
                    />
                  )}
                />
              </FormField>
              <FormField
                label="Start class name"
                error={form.formState.errors.classStartFrom?.message}
              >
                <Controller
                  name="classStartFrom"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ''}
                      onValueChange={handleClassStartChange}
                      disabled={schoolClassOptions.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            schoolClassOptions.length === 0 ? 'Add school classes first' : 'Select start class'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {schoolClassOptions.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="End class name" error={form.formState.errors.classEndAt?.message}>
                <Controller
                  name="classEndAt"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ''}
                      onValueChange={field.onChange}
                      disabled={schoolClassOptions.length === 0}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            schoolClassOptions.length === 0 ? 'Add school classes first' : 'Select end class'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {classEndOptions.map((name) => (
                          <SelectItem key={name} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
              <FormField label="Class label prefix" required error={form.formState.errors.classLabelPrefix?.message}>
                <Input {...form.register('classLabelPrefix')} placeholder="Class" />
              </FormField>
              <FormField label="School code">
                <Input {...form.register('schoolCode')} placeholder="Short code, e.g. DPS" />
              </FormField>
              <FormField
                label="Default sections"
                required
                className="sm:col-span-2"
                error={form.formState.errors.defaultSections?.message}
              >
                <Input {...form.register('defaultSections')} placeholder="A, B, C, D" />
              </FormField>
              <p className="sm:col-span-2 text-xs text-muted-foreground">
                Add classes above, then choose start and end from that list. They auto-update when you change school
                classes. Preview: <span className="font-medium text-foreground">{previewClassRange}</span>
              </p>
            </FormSection>

            <FormSection title="Staff IDs" description="Prefix for new teacher / employee records.">
              <FormField label="Employee ID prefix" required error={form.formState.errors.employeeIdPrefix?.message}>
                <Input {...form.register('employeeIdPrefix')} placeholder="EMP" />
              </FormField>
              <FormField label="Employee ID starts from" error={form.formState.errors.employeeIdStartFrom?.message}>
                <Input type="number" {...form.register('employeeIdStartFrom', { valueAsNumber: true })} />
              </FormField>
              <p className="sm:col-span-2 text-xs text-muted-foreground">
                Example employee ID:{' '}
                <span className="font-mono">{formatEmployeeId({ ...data, ...form.getValues() }, 0)}</span>
              </p>
            </FormSection>

            <FormSection title="Fees & attendance rules">
              <FormField label="Currency">
                <Input {...form.register('currency')} placeholder="INR" />
              </FormField>
              <FormField label="Currency symbol">
                <Input {...form.register('currencySymbol')} placeholder="₹" />
              </FormField>
              <FormField label="Timezone">
                <Input {...form.register('timezone')} placeholder="Asia/Kolkata" />
              </FormField>
              <FormField label="Fee due day (of month)" error={form.formState.errors.feeDueDayOfMonth?.message}>
                <Input type="number" min={1} max={28} {...form.register('feeDueDayOfMonth', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Late fee (%)" error={form.formState.errors.lateFeePercent?.message}>
                <Input type="number" step="0.5" {...form.register('lateFeePercent', { valueAsNumber: true })} />
              </FormField>
              <FormField label="Minimum attendance (%)" error={form.formState.errors.minAttendancePercent?.message}>
                <Input type="number" {...form.register('minAttendancePercent', { valueAsNumber: true })} />
              </FormField>
            </FormSection>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
