'use client'

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="landing-grid-pattern absolute inset-0" />
      <div className="landing-gradient-orb absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/25 blur-[100px]" />
      <div className="landing-gradient-orb absolute -right-24 top-32 h-[400px] w-[400px] rounded-full bg-chart-2/20 blur-[90px] [animation-delay:2s]" />
      <div className="landing-gradient-orb absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-chart-4/15 blur-[80px] [animation-delay:4s]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
    </div>
  )
}
