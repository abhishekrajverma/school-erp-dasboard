'use client'

import * as React from 'react'
import { Clock, Download } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader, Tabs } from '@/components/shared/page-components'
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import { useTimetable, useClasses } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function TimetablePage() {
  const { data: classesData, isLoading: classesLoading, isError: classesError, error: classesErr, refetch: refetchClasses } = useClasses({ page: 1, pageSize: 100 })
  const classOptions = React.useMemo(() => {
    return (classesData?.items ?? []).map((c) => `${c.grade}-${c.section}`)
  }, [classesData])

  const [selectedClass, setSelectedClass] = React.useState('')
  const [selectedDay, setSelectedDay] = React.useState('Monday')
  const [activeTab, setActiveTab] = React.useState('weekly')

  React.useEffect(() => {
    if (classOptions.length > 0 && !selectedClass) {
      setSelectedClass(classOptions[0])
    }
  }, [classOptions, selectedClass])

  const { data: timetableData, isLoading, isError, error, refetch } = useTimetable({ page: 1, pageSize: 500 })

  const [classPart, sectionPart] = selectedClass.split('-')
  const dayEntries = (timetableData?.items ?? [])
    .filter((e) => e.day === selectedDay && (selectedClass ? e.class === classPart && e.section === sectionPart : true))
    .sort((a, b) => a.period - b.period)

  if (classesLoading || isLoading) return <ApiPageLoading rows={2} />
  if (classesError || isError) {
    return (
      <ApiPageError
        error={classesErr ?? error}
        resourceName="timetable"
        onRetry={() => {
          void refetchClasses()
          void refetch()
        }}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Timetable" description="Class schedules, period allocation, and room assignments." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Timetable' }]}>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Export PDF</Button>
        </PageHeader>

        <div className="flex flex-wrap gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Class" /></SelectTrigger>
            <SelectContent>
              {classOptions.map((cls) => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Tabs tabs={[{ id: 'weekly', label: 'Weekly View' }, { id: 'grid', label: 'Period Grid' }]} activeTab={activeTab} onChange={setActiveTab} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />{selectedClass || 'Class'} — {selectedDay}</CardTitle>
          </CardHeader>
          <CardContent>
            {dayEntries.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No timetable entries for this class and day.</p>
            ) : activeTab === 'weekly' ? (
              <div className="space-y-2">
                {dayEntries.map((p) => (
                  <div key={p.id} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
                    <span className="font-mono text-sm text-muted-foreground w-28">{p.startTime}–{p.endTime}</span>
                    <div className="flex-1"><p className="font-medium">{p.subject}</p><p className="text-sm text-muted-foreground">{p.teacher}</p></div>
                    <Badge variant="outline">{p.room}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-border">{days.map((d) => <th key={d} className="p-3 text-left font-medium">{d}</th>)}</tr></thead>
                  <tbody>
                    {Array.from({ length: Math.max(...dayEntries.map((e) => e.period), 0) || 1 }).map((_, pi) => (
                      <tr key={pi} className="border-b border-border">
                        {days.map((d) => {
                          const entry = (timetableData?.items ?? []).find(
                            (e) => e.day === d && e.period === pi + 1 && e.class === classPart && e.section === sectionPart,
                          )
                          return (
                            <td key={d} className="p-3">
                              {entry ? (
                                <div className="rounded-md bg-muted/50 p-2 text-xs">
                                  <p className="font-medium">{entry.subject}</p>
                                  <p className="text-muted-foreground">{entry.startTime}</p>
                                </div>
                              ) : null}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
