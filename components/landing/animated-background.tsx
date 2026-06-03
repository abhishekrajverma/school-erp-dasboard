'use client'

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* ——— Light theme: aurora mesh + dots ——— */}
      <div className="absolute inset-0 dark:hidden">
        <div className="light-mesh-base absolute inset-0" />
        <div className="light-dot-pattern absolute inset-0" />
        <div className="light-aurora-sheet light-aurora-sheet-a absolute -left-[20%] top-[-15%] h-[70%] w-[70%]" />
        <div className="light-aurora-sheet light-aurora-sheet-b absolute -right-[15%] top-[5%] h-[55%] w-[60%]" />
        <div className="landing-gradient-orb absolute -left-24 top-0 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[90px]" />
        <div className="landing-gradient-orb absolute -right-20 top-24 h-[360px] w-[360px] rounded-full bg-violet-400/25 blur-[80px] [animation-delay:2s]" />
        <div className="landing-gradient-orb absolute bottom-[-5%] left-1/4 h-[320px] w-[320px] rounded-full bg-sky-400/20 blur-[70px] [animation-delay:4s]" />
        <div className="light-ring light-ring-a absolute left-[12%] top-[22%] h-48 w-48 rounded-full border border-primary/15" />
        <div className="light-ring light-ring-b absolute right-[18%] top-[38%] h-32 w-32 rounded-full border border-violet-400/20" />
        <div className="absolute inset-0 bg-linear-to-b from-white/50 via-background/20 to-background/95" />
      </div>

      {/* ——— Dark theme: original style ——— */}
      <div className="absolute inset-0 hidden dark:block">
        <div className="landing-grid-pattern absolute inset-0" />
        <div className="landing-gradient-orb absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-primary/25 blur-[100px]" />
        <div className="landing-gradient-orb absolute -right-24 top-32 h-[400px] w-[400px] rounded-full bg-chart-2/20 blur-[90px] [animation-delay:2s]" />
        <div className="landing-gradient-orb absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-chart-4/15 blur-[80px] [animation-delay:4s]" />
        <div className="absolute inset-0 bg-linear-to-b from-background/40 via-background/80 to-background" />
      </div>
    </div>
  )
}
