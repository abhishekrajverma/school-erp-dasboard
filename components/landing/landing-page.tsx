'use client'

import { CtaSection } from './cta-section'
import { FaqSection } from './faq-section'
import { FeaturesBento } from './features-bento'
import { HeroSection } from './hero-section'
import { LandingFooter } from './landing-footer'
import { LandingNavbar } from './landing-navbar'
import { LogoMarquee } from './logo-marquee'
import { PricingSection } from './pricing-section'
import { StatsSection } from './stats-section'
import { TestimonialsSection } from './testimonials-section'

export function LandingPage() {
  return (
    <div className="min-h-screen text-foreground">
      <LandingNavbar />
      <main>
        <HeroSection />
        <LogoMarquee />
        <StatsSection />
        <FeaturesBento />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
