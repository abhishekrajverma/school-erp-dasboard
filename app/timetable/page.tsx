'use client'

import * as React from 'react'
import { Clock, Download } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PageHeader, Tabs } from '@/components/shared/page-components'
import { timetableData, classesData } from '@/lib/erp-data'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = React.useState('10-A')
  const [selectedDay, setSelectedDay] = React.useState('Monday')
  const [activeTab, setActiveTab] = React.useState('weekly')

  const samplePeriods = timetableData[0]?.periods ?? []

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader title="Timetable" description="Class schedules, period allocation, and room assignments." breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Timetable' }]}>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Export PDF</Button>
        </PageHeader>

        <div className="flex flex-wrap gap-3">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Class" /></SelectTrigger>
            <SelectContent>{classesData.flatMap((c) => c.sections.map((s) => `${c.name.replace('Class ', '')}-${s}`)).map((cls) => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>{days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Tabs tabs={[{ id: 'weekly', label: 'Weekly View' }, { id: 'grid', label: 'Period Grid' }]} activeTab={activeTab} onChange={setActiveTab} />

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Clock className="h-4 w-4" />{selectedClass} — {selectedDay}</CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === 'weekly' ? (
              <div className="space-y-2">
                {samplePeriods.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4 hover:bg-muted/30 transition-colors">
                    <span className="font-mono text-sm text-muted-foreground w-28">{p.time}</span>
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
                    {samplePeriods.map((_, pi) => (
                      <tr key={pi} className="border-b border-border">
                        {days.map((d) => (
                          <td key={d} className="p-3">
                            <div className="rounded-md bg-muted/50 p-2 text-xs">
                              <p className="font-medium">{samplePeriods[pi % samplePeriods.length]?.subject}</p>
                              <p className="text-muted-foreground">{samplePeriods[pi % samplePeriods.length]?.time}</p>
                            </div>
                          </td>
                        ))}
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
