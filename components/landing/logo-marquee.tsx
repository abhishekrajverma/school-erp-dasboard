'use client'

import { marqueeSchools } from '@/lib/landing/content'

export function LogoMarquee() {
  const items = [...marqueeSchools, ...marqueeSchools]

  return (
    <section className="border-y border-border/60 bg-muted/30 py-8 overflow-hidden">
      <p className="mb-5 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Trusted by leading institutions across India
      </p>
      <div className="relative flex overflow-hidden">
        <div className="landing-marquee-track flex shrink-0 gap-12 whitespace-nowrap">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-sm font-semibold text-muted-foreground/80 transition hover:text-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
