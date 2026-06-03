'use client'

import { motion } from 'framer-motion'

type SchoolHeroBackgroundProps = {
  primaryColor: string
}

export function SchoolHeroBackground({ primaryColor }: SchoolHeroBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${primaryColor}40, transparent 70%)`,
        }}
      />
      <div className="school-site-grid absolute inset-0 opacity-[0.4] dark:opacity-[0.25]" />
      <motion.div
        className="school-site-orb absolute -left-[10%] top-[5%] h-[min(480px,55vw)] w-[min(480px,55vw)] rounded-full blur-[100px]"
        style={{ backgroundColor: `${primaryColor}35` }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="school-site-orb absolute -right-[5%] top-[20%] h-[min(380px,45vw)] w-[min(380px,45vw)] rounded-full blur-[90px]"
        style={{ backgroundColor: `${primaryColor}25` }}
        animate={{ x: [0, -25, 0], y: [0, 30, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="school-site-orb absolute bottom-[10%] left-[25%] h-[280px] w-[280px] rounded-full blur-[80px]"
        style={{ backgroundColor: `${primaryColor}18` }}
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <div className="absolute inset-0 bg-linear-to-b from-background/30 via-background/70 to-background" />
    </div>
  )
}
