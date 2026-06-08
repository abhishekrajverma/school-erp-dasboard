'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { pricing } from '@/lib/landing/content'
import { salesContact } from '@/lib/landing/sales'
import { submitSchoolEnquiry } from '@/lib/api/company'

type PlanKey = 'starter' | 'professional' | 'enterprise'

function GetStartedContent() {
  const searchParams = useSearchParams()
  const paramPlan = (searchParams.get('plan') || 'professional') as PlanKey
  const planKeys = pricing.map((p) => p.key) as PlanKey[]
  const initialPlanKey: PlanKey = planKeys.includes(paramPlan) ? paramPlan : 'professional'

  const [step, setStep] = React.useState(1)
  const [planKey, setPlanKey] = React.useState<PlanKey>(initialPlanKey)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const plan = pricing.find((p) => p.key === planKey) ?? pricing[1]
  const [registration, setRegistration] = React.useState({
    schoolName: '',
    schoolCode: '',
    schoolEmail: '',
    contactNumber: '',
    principalName: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: 'India',
    studentStrength: '',
  })

  const setField =
    (key: keyof typeof registration) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setRegistration((prev) => ({ ...prev, [key]: event.target.value }))

  const isSchoolStepValid =
    registration.schoolName &&
    registration.schoolCode &&
    registration.schoolEmail &&
    registration.contactNumber &&
    registration.principalName &&
    registration.address &&
    registration.city &&
    registration.state &&
    registration.country &&
    registration.studentStrength

  const submitPricingRequest = async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await submitSchoolEnquiry({
        planKey,
        planName: plan.name,
        schoolName: registration.schoolName,
        schoolCode: registration.schoolCode,
        schoolEmail: registration.schoolEmail,
        contactNumber: registration.contactNumber,
        principalName: registration.principalName,
        website: registration.website,
        address: registration.address,
        city: registration.city,
        state: registration.state,
        country: registration.country,
        studentStrength: registration.studentStrength,
      })
      setStep(3)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit enquiry')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepper = () => (
    <div className="grid gap-2 sm:grid-cols-3">
      {['School Info', 'Plan Interest', 'Request Sent'].map((label, idx) => {
        const itemStep = idx + 1
        const isActive = step === itemStep
        const isDone = step > itemStep
        return (
          <div
            key={label}
            className={`rounded-xl border px-3 py-2.5 text-sm transition ${
              isActive
                ? 'border-primary bg-primary/10 text-foreground shadow-sm'
                : 'border-border/70 bg-card/60 text-muted-foreground'
            }`}
          >
            <span
              className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${
                isDone ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              {isDone ? '✓' : itemStep}
            </span>
            {label}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4 shadow-lg shadow-primary/30">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold tracking-tight">EduSync Pricing Enquiry</span>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Share your school details — our team will send a custom quote
              </p>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/">Back to Website</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6 md:py-10 lg:grid-cols-[1fr_330px]">
        <section className="space-y-5">
          {renderStepper()}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-border/70 bg-card/85 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle>Step 1: School Information</CardTitle>
                    <CardDescription>
                      Tell us about your institution so we can prepare the right plan for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        className="h-10"
                        placeholder="School Name"
                        value={registration.schoolName}
                        onChange={setField('schoolName')}
                      />
                      <Input
                        className="h-10"
                        placeholder="School Code"
                        value={registration.schoolCode}
                        onChange={setField('schoolCode')}
                      />
                      <Input
                        className="h-10"
                        placeholder="School Email"
                        type="email"
                        value={registration.schoolEmail}
                        onChange={setField('schoolEmail')}
                      />
                      <Input
                        className="h-10"
                        placeholder="Contact Number"
                        value={registration.contactNumber}
                        onChange={setField('contactNumber')}
                      />
                      <Input
                        placeholder="Principal Name"
                        value={registration.principalName}
                        onChange={setField('principalName')}
                      />
                      <Input
                        placeholder="Website"
                        value={registration.website}
                        onChange={setField('website')}
                      />
                      <Input
                        placeholder="Address"
                        value={registration.address}
                        onChange={setField('address')}
                      />
                      <Input placeholder="City" value={registration.city} onChange={setField('city')} />
                      <Input placeholder="State" value={registration.state} onChange={setField('state')} />
                      <Input
                        placeholder="Country"
                        value={registration.country}
                        onChange={setField('country')}
                      />
                      <Input
                        placeholder="Student Strength"
                        value={registration.studentStrength}
                        onChange={setField('studentStrength')}
                        type="number"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => setStep(2)} disabled={!isSchoolStepValid}>
                        Continue
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-border/70 bg-card/85 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle>Step 2: Plan Interest</CardTitle>
                    <CardDescription>
                      Review the plan you are interested in. Pricing is shared by our sales team — no
                      online checkout.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                      <p className="text-sm text-muted-foreground">Selected Plan</p>
                      <p className="text-lg font-semibold">{plan.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                      <p className="mt-3 text-xl font-bold text-primary">{salesContact.pricingHeadline}</p>
                    </div>

                    <div className="rounded-lg border border-border p-4">
                      <p className="mb-2 text-sm font-medium">Features Included</p>
                      <div className="grid gap-2 md:grid-cols-2">
                        {plan.features.map((item) => (
                          <div key={item} className="inline-flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
                      {salesContact.pricingNote}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {pricing.map((item) => (
                        <Button
                          key={item.key}
                          variant={item.key === planKey ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPlanKey(item.key as PlanKey)}
                        >
                          {item.name}
                        </Button>
                      ))}
                    </div>

                    {submitError ? (
                      <p className="text-sm text-destructive">{submitError}</p>
                    ) : null}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setStep(1)}>
                        Back
                      </Button>
                      <Button onClick={() => void submitPricingRequest()} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting…' : salesContact.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-primary/30 bg-card/90 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                      Enquiry sent
                    </CardTitle>
                    <CardDescription>
                      Your details were sent to the EduSync team. We will contact you with pricing
                      and next steps.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-border p-4">
                        <p className="text-sm text-muted-foreground">School</p>
                        <p className="font-semibold">{registration.schoolName}</p>
                      </div>
                      <div className="rounded-lg border border-border p-4">
                        <p className="text-sm text-muted-foreground">Plan Interest</p>
                        <p className="font-semibold">{plan.name}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button asChild>
                        <Link href="/">Back to Home</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Card className="border-border/70 bg-card/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Pricing Enquiry</CardTitle>
              <CardDescription>Custom quote — no online payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Interested Plan</p>
                <p className="mt-1 font-semibold">{plan.name}</p>
              </div>
              {registration.schoolName && (
                <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                  <p className="text-xs text-muted-foreground">School</p>
                  <p className="mt-1 font-semibold">{registration.schoolName}</p>
                </div>
              )}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                <p className="font-medium text-foreground">{salesContact.pricingHeadline}</p>
                <p className="mt-1">{salesContact.pricingNote}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Contact</p>
                <a
                  href={`mailto:${salesContact.email}`}
                  className="mt-1 block font-medium text-primary hover:underline"
                >
                  {salesContact.email}
                </a>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                <div className="mb-1 inline-flex items-center gap-1 font-medium text-foreground">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  Sales-assisted onboarding
                </div>
                Our team will walk you through setup after sharing a quote that fits your school.
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  )
}

export default function GetStartedPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen" />}>
      <GetStartedContent />
    </React.Suspense>
  )
}
