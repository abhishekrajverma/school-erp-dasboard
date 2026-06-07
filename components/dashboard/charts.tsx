'use client'

import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboard } from '@/hooks/api/use-dashboard'
import { enrichPieData } from '@/lib/chart-colors'
import { PieChartTooltip, PieChartLegend, pieActiveShape } from '@/components/charts/pie-chart-tooltip'

function formatCurrency(value: number) {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`
  return `₹${value}`
}

function ChartPlaceholder({ loading, empty }: { loading?: boolean; empty?: boolean }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {loading ? 'Loading…' : empty ? 'No data available yet' : null}
    </div>
  )
}

export function FeeCollectionChart() {
  const { data, isLoading } = useDashboard()
  const chartData = data?.monthlyFeeCollection ?? []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Fee Collection</CardTitle>
          <CardDescription>Monthly fee collection vs pending dues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            {isLoading || chartData.length === 0 ? (
              <ChartPlaceholder loading={isLoading} empty={!isLoading && chartData.length === 0} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-5))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-5))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground))" fontSize={12} tickFormatter={formatCurrency} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card))', border: '1px solid var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(value: number) => [formatCurrency(value), '']} />
                  <Area type="monotone" dataKey="collected" stroke="var(--chart-1))" strokeWidth={2} fillOpacity={1} fill="url(#colorCollected)" name="Collected" />
                  <Area type="monotone" dataKey="pending" stroke="var(--chart-5))" strokeWidth={2} fillOpacity={1} fill="url(#colorPending)" name="Pending" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function AttendanceChart() {
  const { data, isLoading } = useDashboard()
  const chartData = data?.studentAttendance ?? []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Weekly Attendance</CardTitle>
          <CardDescription>Student attendance this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            {isLoading || chartData.length === 0 ? (
              <ChartPlaceholder loading={isLoading} empty={!isLoading && chartData.length === 0} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card))', border: '1px solid var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="present" fill="var(--chart-2))" radius={[4, 4, 0, 0]} name="Present" />
                  <Bar dataKey="absent" fill="var(--chart-5))" radius={[4, 4, 0, 0]} name="Absent" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function RevenueChart() {
  const { data, isLoading } = useDashboard()
  const chartData = (data?.monthlyFeeCollection ?? []).map((m) => ({
    month: m.month,
    revenue: m.collected,
    expenses: m.pending,
  }))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Revenue vs Expenses</CardTitle>
          <CardDescription>Monthly financial overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            {isLoading || chartData.length === 0 ? (
              <ChartPlaceholder loading={isLoading} empty={!isLoading && chartData.length === 0} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground))" fontSize={12} tickFormatter={formatCurrency} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card))', border: '1px solid var(--border))', borderRadius: '8px', fontSize: '12px' }} formatter={(value: number) => [formatCurrency(value), '']} />
                  <Line type="monotone" dataKey="revenue" stroke="var(--chart-2))" strokeWidth={2} dot={{ fill: 'var(--chart-2))', strokeWidth: 2 }} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="var(--chart-5))" strokeWidth={2} dot={{ fill: 'var(--chart-5))', strokeWidth: 2 }} name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SalaryDistributionChart() {
  const { data, isLoading } = useDashboard()
  const salaryData = data?.stats?.salaryPaid
    ? [{ department: 'Payroll', amount: data.stats.salaryPaid }]
    : []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Salary Distribution</CardTitle>
          <CardDescription>By department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            {isLoading || salaryData.length === 0 ? (
              <ChartPlaceholder loading={isLoading} empty={!isLoading && salaryData.length === 0} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={enrichPieData(salaryData)} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="amount" nameKey="department" activeShape={pieActiveShape} />
                  <Tooltip content={<PieChartTooltip />} cursor={false} />
                  <Legend content={<PieChartLegend />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function AdmissionTrendChart() {
  const { data, isLoading } = useDashboard()
  const admissions = data?.stats?.newAdmissions ?? 0
  const chartData = admissions > 0 ? [{ month: 'Current', admissions }] : []

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Admission Trend</CardTitle>
          <CardDescription>Monthly new admissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[280px]">
            {isLoading || chartData.length === 0 ? (
              <ChartPlaceholder loading={isLoading} empty={!isLoading && chartData.length === 0} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border))" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--card))', border: '1px solid var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="admissions" fill="var(--chart-1))" radius={[4, 4, 0, 0]} name="Admissions" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ChartsSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <FeeCollectionChart />
      <AttendanceChart />
      <RevenueChart />
      <SalaryDistributionChart />
      <div className="lg:col-span-2 xl:col-span-2">
        <AdmissionTrendChart />
      </div>
    </div>
  )
}
