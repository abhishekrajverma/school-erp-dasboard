'use client'

import { AnimatedBackground } from '@/components/landing/animated-background'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 z-0">
        <AnimatedBackground />
      </div>
      <div className="relative z-1 min-h-screen">{children}</div>
    </div>
  )
}
