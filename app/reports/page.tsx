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

import { enrichPieData } from '@/lib/chart-colors'
import { PieChartTooltip, PieChartLegend, pieActiveShape } from '@/components/charts/pie-chart-tooltip'

// Financial data
const monthlyRevenue = [
  { month: 'Jan', revenue: 7200000, fees: 6500000, other: 700000 },
  { month: 'Feb', revenue: 7800000, fees: 7000000, other: 800000 },
  { month: 'Mar', revenue: 8100000, fees: 7300000, other: 800000 },
  { month: 'Apr', revenue: 7500000, fees: 6800000, other: 700000 },
  { month: 'May', revenue: 8400000, fees: 7600000, other: 800000 },
  { month: 'Jun', revenue: 8750000, fees: 7900000, other: 850000 },
]

const expenseBreakdown = enrichPieData([
  { category: 'Salaries', amount: 4250000 },
  { category: 'Infrastructure', amount: 850000 },
  { category: 'Utilities', amount: 320000 },
  { category: 'Transport', amount: 280000 },
  { category: 'Others', amount: 150000 },
])

// Academic data
const classPerformance = [
  { class: '6th', avgScore: 78, students: 120 },
  { class: '7th', avgScore: 82, students: 115 },
  { class: '8th', avgScore: 75, students: 125 },
  { class: '9th', avgScore: 80, students: 118 },
  { class: '10th', avgScore: 85, students: 110 },
  { class: '11th', avgScore: 79, students: 105 },
  { class: '12th', avgScore: 88, students: 98 },
]

const subjectPerformance = [
  { subject: 'Mathematics', avgScore: 78 },
  { subject: 'Science', avgScore: 82 },
  { subject: 'English', avgScore: 85 },
  { subject: 'Social Studies', avgScore: 80 },
  { subject: 'Languages', avgScore: 83 },
]

// Attendance trends
const attendanceTrend = [
  { week: 'W1', students: 94.2, teachers: 98.5 },
  { week: 'W2', students: 93.8, teachers: 97.2 },
  { week: 'W3', students: 95.1, teachers: 99.1 },
  { week: 'W4', students: 92.5, teachers: 96.8 },
]

function formatCurrency(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = React.useState('6months')

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
              <CardTitle className="text-2xl">{formatCurrency(47750000)}</CardTitle>
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
              <CardTitle className="text-2xl">93.9%</CardTitle>
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
              <CardTitle className="text-2xl">87.5%</CardTitle>
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
              <CardTitle className="text-2xl">81.2%</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-green-500">+3.5% vs last period</Badge>
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
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Academic Reports */}
            <TabsContent value="academic" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Class-wise Performance</CardTitle>
                        <CardDescription>Average scores by class</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={classPerformance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" vertical={false} />
                          <XAxis dataKey="class" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'var(--card))',
                              border: '1px solid var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="avgScore" fill="var(--chart-1))" radius={[4, 4, 0, 0]} name="Avg Score %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">Subject Performance</CardTitle>
                        <CardDescription>Average scores by subject</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={subjectPerformance} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" horizontal={false} />
                          <XAxis type="number" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis type="category" dataKey="subject" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={100} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'var(--card))',
                              border: '1px solid var(--border))',
                              borderRadius: '8px',
                              fontSize: '12px',
                            }}
                          />
                          <Bar dataKey="avgScore" fill="var(--chart-2))" radius={[0, 4, 4, 0]} name="Avg Score %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
