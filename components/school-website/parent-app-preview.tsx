'use client'

import { motion } from 'framer-motion'
import {
  Bell,
  Bus,
  CalendarCheck,
  CreditCard,
  Home,
  Smartphone,
  User,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { parentAppHighlights } from '@/lib/school-website/platform-features'

type ParentAppPreviewProps = {
  schoolName: string
  primaryColor: string
}

const tabs = [
  { icon: Home, label: 'Home' },
  { icon: CalendarCheck, label: 'Attendance' },
  { icon: CreditCard, label: 'Fees' },
  { icon: Bus, label: 'Bus' },
  { icon: Bell, label: 'Alerts' },
  { icon: User, label: 'Profile' },
]

export function ParentAppPreview({ schoolName, primaryColor }: ParentAppPreviewProps) {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <motion.div
        className="absolute -right-6 top-8 hidden rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-md lg:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-xs text-muted-foreground">Bus arriving</p>
        <p className="text-sm font-semibold" style={{ color: primaryColor }}>3 min away</p>
      </motion.div>

      <motion.div
        className="absolute -left-4 bottom-24 hidden rounded-2xl border border-border/60 bg-card/95 px-4 py-3 shadow-xl backdrop-blur-md sm:block"
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <p className="text-xs text-muted-foreground">Today</p>
        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Present ✓</p>
      </motion.div>

      <div className="school-glass-card overflow-hidden rounded-[2rem] border-2 border-border/60 shadow-2xl">
        <div
          className="flex items-center justify-between px-5 pb-3 pt-4"
          style={{ background: `linear-gradient(180deg, ${primaryColor}22, transparent)` }}
        >
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Parent App</p>
            <p className="text-sm font-bold leading-tight">{schoolName.split(' ')[0]}…</p>
          </div>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <Smartphone className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-3 px-4 pb-4">
          <div
            className="rounded-2xl p-4 text-white"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)` }}
          >
            <p className="text-xs text-white/80">Your child today</p>
            <p className="mt-1 text-lg font-bold">Arjun Sharma · Class VIII-A</p>
            <div className="mt-3 flex gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs">Present</span>
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs">Bus #12</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Fees due', value: '₹8,000', sub: 'Due 15 Jun' },
              { label: 'Notices', value: '2 new', sub: 'PTM Saturday' },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-border/50 bg-background/80 p-3">
                <p className="text-[10px] text-muted-foreground">{card.label}</p>
                <p className="text-sm font-bold">{card.value}</p>
                <p className="text-[10px] text-muted-foreground">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {parentAppHighlights.slice(0, 3).map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-3 py-2"
              >
                <item.icon className="h-4 w-4 shrink-0" style={{ color: primaryColor }} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{item.title}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex border-t border-border/50 bg-background/90 px-2 py-2">
          {tabs.map((tab, i) => (
            <div
              key={tab.label}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 py-1 text-[9px]',
                i === 0 ? 'font-semibold' : 'text-muted-foreground',
              )}
              style={i === 0 ? { color: primaryColor } : undefined}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
