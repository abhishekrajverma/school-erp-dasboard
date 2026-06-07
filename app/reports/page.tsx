'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  CreditCard,
  Calendar,
  Filter,
  RefreshCcw,
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { ApiPageLoading, ApiPageError } from '@/components/shared/api-page-state'
import { enrichPieData } from '@/lib/chart-colors'
import { PieChartTooltip, PieChartLegend, pieActiveShape } from '@/components/charts/pie-chart-tooltip'
import { useDashboard } from '@/hooks/api'
import { isApiError } from '@/lib/api/interceptors/errors'

function formatCurrency(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = React.useState('6months')
  const { data, isLoading, isError, error, refetch } = useDashboard()

  const monthlyRevenue = (data?.monthlyFeeCollection ?? []).map((m) => ({
    month: m.month,
    revenue: m.collected + m.pending,
    fees: m.collected,
    other: m.pending,
  }))

  const expenseBreakdown = enrichPieData(
    data?.stats?.salaryPaid
      ? [{ category: 'Salaries', amount: data.stats.salaryPaid }]
      : [],
  )

  const attendanceTrend = (data?.studentAttendance ?? []).map((d, i) => ({
    week: d.day.slice(0, 3) || `W${i + 1}`,
    students: d.present + d.absent > 0 ? Math.round((d.present / (d.present + d.absent)) * 1000) / 10 : 0,
    teachers: data?.attendanceSummary?.thisWeek?.avgAttendance ?? 0,
  }))

  const totalRevenue = monthlyRevenue.reduce((a, m) => a + m.revenue, 0)
  const avgAttendance = data?.attendanceSummary?.thisMonth?.avgAttendance ?? data?.stats?.attendancePercentage ?? 0
  const feeCollection = data?.feeSummary?.collectionRate ?? 0

  if (isLoading) return <ApiPageLoading rows={4} />
  if (isError) {
    return (
      <ApiPageError
        message={isApiError(error) ? error.message : 'Failed to load reports data from EduSync.'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Comprehensive insights into school performance and operations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Total Revenue
              </CardDescription>
              <CardTitle className="text-2xl">{formatCurrency(totalRevenue)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-green-500">+15.3% vs last period</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                Avg. Attendance
              </CardDescription>
              <CardTitle className="text-2xl">{avgAttendance}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-green-500">+2.1% vs last period</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Fee Collection
              </CardDescription>
              <CardTitle className="text-2xl">{feeCollection}%</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-yellow-500">-1.2% vs last period</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Avg. Academic Score
              </CardDescription>
              <CardTitle className="text-2xl">—</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary">Academic reports API not available yet</Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Report Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="financial" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            {/* Financial Reports */}
            <TabsContent value="financial" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Revenue Breakdown</CardTitle>
                        <CardDescription>Monthly revenue by source</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {monthlyRevenue.length === 0 ? (
                      <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No financial data available yet.</p>
                    ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={monthlyRevenue}>
                          <defs>
                            <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--chart-1))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--chart-1))" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--chart-2))" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="var(--chart-2))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" vertical={false} />
                          <XAxis dataKey="month" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--muted-foreground))" fontSize={12} tickFormatter={formatCurrency} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'var(--card))',
                              border: '1px solid var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                            formatter={(value: number) => [formatCurrency(value), '']}
                          />
                          <Area type="monotone" dataKey="fees" stackId="1" stroke="var(--chart-1))" fill="url(#colorFees)" name="Fee Collection" />
                          <Area type="monotone" dataKey="other" stackId="1" stroke="var(--chart-2))" fill="url(#colorOther)" name="Other Income" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Expense Distribution</CardTitle>
                        <CardDescription>Monthly expense breakdown</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {expenseBreakdown.length === 0 ? (
                      <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No expense data available yet.</p>
                    ) : (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={expenseBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={3}
                            dataKey="amount"
                            nameKey="category"
                            activeShape={pieActiveShape}
                          />
                          <Tooltip content={<PieChartTooltip />} cursor={false} />
                          <Legend content={<PieChartLegend />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Academic Reports */}
            <TabsContent value="academic" className="space-y-4">
              <Card>
                <CardContent className="py-16 text-center text-sm text-muted-foreground">
                  Academic performance reports are not available from the backend yet.
                </CardContent>
              </Card>
            </TabsContent>

            {/* Attendance Reports */}
            <TabsContent value="attendance" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Attendance Trends</CardTitle>
                      <CardDescription>Weekly attendance comparison</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {attendanceTrend.length === 0 ? (
                    <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No attendance trend data available yet.</p>
                  ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={attendanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" vertical={false} />
                        <XAxis dataKey="week" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="var(--muted-foreground))" fontSize={12} domain={[90, 100]} tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--card))',
                            border: '1px solid var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px',
                          }}
                          formatter={(value: number) => [`${value}%`, '']}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="students" stroke="var(--chart-1))" strokeWidth={2} dot={{ fill: 'var(--chart-1))' }} name="Student Attendance" />
                        <Line type="monotone" dataKey="teachers" stroke="var(--chart-2))" strokeWidth={2} dot={{ fill: 'var(--chart-2))' }} name="Teacher Attendance" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
