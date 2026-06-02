'use client'

import { motion } from 'framer-motion'
import { Activity, Bell, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { dashboardPreview } from '@/lib/landing/content'

export function DashboardMockup() {
  const { schoolName, session, kpis, chartBars, activities } = dashboardPreview

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="landing-float relative mx-auto w-full max-w-lg perspective-[1200px]"
    >
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-primary/30 via-chart-2/20 to-chart-4/30 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <span className="ml-2 text-xs font-medium text-muted-foreground">{schoolName}</span>
          </div>
          <Badge variant="secondary" className="text-[10px]">
            {session}
          </Badge>
        </div>

        <div className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-2">
            {kpis.map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="rounded-xl border border-border/60 bg-background/60 p-3"
              >
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                <p className="text-sm font-bold tracking-tight">{kpi.value}</p>
                <p className={`text-[10px] ${kpi.up ? 'text-chart-2' : 'text-chart-3'}`}>{kpi.change}</p>
              </motion.div>
            ))}
          </div>

          <div className="rounded-xl border border-border/60 bg-background/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium">Fee Collection Trend</span>
              <TrendingUp className="h-3.5 w-3.5 text-chart-2" />
            </div>
            <div className="flex h-20 items-end justify-between gap-1">
              {chartBars.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.5 + i * 0.04, duration: 0.4 }}
                  className="w-full origin-bottom rounded-t bg-gradient-to-t from-primary to-primary/40"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Activity className="h-3.5 w-3.5 text-primary" />
              Live Activity
            </div>
            {activities.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.15 }}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-xs"
              >
                <span className="truncate pr-2">{item.text}</span>
                <span className="shrink-0 text-muted-foreground">{item.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="landing-float-delayed absolute -right-3 top-24 rounded-xl border border-border/80 bg-card p-3 shadow-xl"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-semibold">Parent Portal</p>
              <p className="text-[10px] text-chart-2">1,204 online now</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
