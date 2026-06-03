'use client'

import { usePathname } from 'next/navigation'
import { AnimatedBackground } from '@/components/landing/animated-background'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSchoolSite = pathname?.startsWith('/school/')

  return (
    <div className="relative min-h-screen">
      {!isSchoolSite && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <AnimatedBackground />
        </div>
      )}
      <div className="relative z-1 min-h-screen">{children}</div>
    </div>
  )
}
