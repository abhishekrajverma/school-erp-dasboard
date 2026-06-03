'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { markLoggedIn } from '@/lib/auth'

type PlanKey = 'starter' | 'professional' | 'enterprise'
type Billing = 'monthly' | 'quarterly' | 'yearly'

interface Plan {
  name: string
  monthly: number
  quarterly: number
  yearly: number
  isCustom?: boolean
  features: string[]
}

const plans: Record<PlanKey, Plan> = {
  starter: {
    name: 'Starter',
    monthly: 2999,
    quarterly: 2999 * 3 * 0.95,
    yearly: 2999 * 12 * 0.85,
    features: [
      'Up to 500 Students',
      'Student Management',
      'Admission Management',
      'Attendance',
      'Parent Portal',
      'Basic Reports',
    ],
  },
  professional: {
    name: 'Professional',
    monthly: 5999,
    quarterly: 5999 * 3 * 0.94,
    yearly: 5999 * 12 * 0.82,
    features: [
      'Up to 2,000 Students',
      'Everything in Starter',
      'Fee Management',
      'Exams',
      'Transport',
      'Staff Management',
      'Advanced Reports',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    monthly: 0,
    quarterly: 0,
    yearly: 0,
    isCustom: true,
    features: [
      'Unlimited Students',
      'All Modules',
      'White Label',
      'API Access',
      'Dedicated Infrastructure',
      'Priority Support',
      'Dedicated Account Manager',
    ],
  },
}

const setupSteps = [
  'School Profile',
  'Academic Session Setup',
  'Class & Section Setup',
  'Fee Structure Setup',
  'Staff Setup',
  'Student Import',
  'Complete Configuration',
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function slugify(name: string) {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function GetStartedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paramPlan = (searchParams.get('plan') || 'professional') as PlanKey
  const selectedPlan: PlanKey = paramPlan in plans ? paramPlan : 'professional'

  const [step, setStep] = React.useState(1)
  const [billing, setBilling] = React.useState<Billing>('monthly')
  const [paymentMethod, setPaymentMethod] = React.useState('Razorpay')
  const [wizardStep, setWizardStep] = React.useState(1)
  const [isPaying, setIsPaying] = React.useState(false)
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

  const plan = plans[selectedPlan]
  const baseAmount = plan.isCustom
    ? 0
    : billing === 'monthly'
      ? Math.round(plan.monthly)
      : billing === 'quarterly'
        ? Math.round(plan.quarterly)
        : Math.round(plan.yearly)
  const gst = Math.round(baseAmount * 0.18)
  const total = baseAmount + gst
  const schoolSlug = slugify(registration.schoolName || 'demo-school')
  const tenantId = `TEN-${schoolSlug.toUpperCase().slice(0, 8)}-${new Date().getFullYear()}`
  const portalUrl = `https://app.schoolerp.com/tenant/${schoolSlug}`

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

  const completePayment = async () => {
    setIsPaying(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setIsPaying(false)
    setStep(4)
  }

  const renderStepper = () => (
    <div className="grid gap-2 sm:grid-cols-4">
      {['School Info', 'Summary', 'Payment', 'Success'].map((label, idx) => {
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
            <span className={`mr-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium ${
              isDone ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
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
              <span className="font-semibold tracking-tight">EduSync ERP Onboarding</span>
              <p className="hidden text-xs text-muted-foreground sm:block">Provision your school portal in minutes</p>
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
              <CardDescription>Enter your institution details to provision a dedicated ERP tenant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input className="h-10" placeholder="School Name" value={registration.schoolName} onChange={setField('schoolName')} />
                <Input className="h-10" placeholder="School Code" value={registration.schoolCode} onChange={setField('schoolCode')} />
                <Input className="h-10" placeholder="School Email" type="email" value={registration.schoolEmail} onChange={setField('schoolEmail')} />
                <Input className="h-10" placeholder="Contact Number" value={registration.contactNumber} onChange={setField('contactNumber')} />
                <Input placeholder="Principal Name" value={registration.principalName} onChange={setField('principalName')} />
                <Input placeholder="Website" value={registration.website} onChange={setField('website')} />
                <Input placeholder="Address" value={registration.address} onChange={setField('address')} />
                <Input placeholder="City" value={registration.city} onChange={setField('city')} />
                <Input placeholder="State" value={registration.state} onChange={setField('state')} />
                <Input placeholder="Country" value={registration.country} onChange={setField('country')} />
                <Input
                  placeholder="Student Strength"
                  value={registration.studentStrength}
                  onChange={setField('studentStrength')}
                  type="number"
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!isSchoolStepValid}>
                  Continue to Subscription Summary
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
              <CardTitle>Step 2: Subscription Summary</CardTitle>
              <CardDescription>Review your selected plan, billing, taxes, and features included.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">Selected Plan</p>
                  <p className="text-lg font-semibold">{plan.name}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">Billing Cycle</p>
                  <div className="mt-2 flex gap-2">
                    <Button variant={billing === 'monthly' ? 'default' : 'outline'} size="sm" onClick={() => setBilling('monthly')}>
                      Monthly
                    </Button>
                    <Button variant={billing === 'quarterly' ? 'default' : 'outline'} size="sm" onClick={() => setBilling('quarterly')}>
                      Quarterly
                    </Button>
                    <Button variant={billing === 'yearly' ? 'default' : 'outline'} size="sm" onClick={() => setBilling('yearly')}>
                      Yearly
                    </Button>
                  </div>
                </div>
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

              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Base Amount</span>
                  <span>{plan.isCustom ? 'Custom' : formatCurrency(baseAmount)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>GST (18%)</span>
                  <span>{plan.isCustom ? '-' : formatCurrency(gst)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 font-semibold">
                  <span>Total Amount</span>
                  <span>{plan.isCustom ? 'Discuss with Sales' : formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)}>Proceed to Payment</Button>
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
                <Card className="border-border/70 bg-card/85 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle>Secure Checkout</CardTitle>
              <CardDescription>Pay securely to activate your school tenant and subscription instantly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">Plan Name</p>
                  <p className="font-semibold">{plan.name}</p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <p className="text-sm text-muted-foreground">Billing</p>
                  <p className="font-semibold capitalize">{billing}</p>
                </div>
                <div className="rounded-lg border border-border p-4 md:col-span-2">
                  <p className="mb-2 text-sm text-muted-foreground">Payment Method</p>
                  <div className="flex flex-wrap gap-2">
                    {['Razorpay', 'Stripe', 'UPI', 'Credit Card', 'Debit Card', 'Net Banking'].map((method) => (
                      <Button
                        key={method}
                        variant={paymentMethod === method ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPaymentMethod(method)}
                      >
                        {method}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Amount</span>
                  <span>{plan.isCustom ? 'Custom' : formatCurrency(baseAmount)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>GST</span>
                  <span>{plan.isCustom ? '-' : formatCurrency(gst)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 font-semibold">
                  <span>Final Amount</span>
                  <span>{plan.isCustom ? 'Sales Assisted' : formatCurrency(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/20 p-3 text-sm">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-primary" /> TLS Encrypted</span>
                <span className="inline-flex items-center gap-1"><Lock className="h-4 w-4 text-primary" /> PCI-DSS Aligned</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Fraud Checks Enabled</span>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button onClick={completePayment} disabled={isPaying}>
                  {isPaying ? 'Processing Payment...' : 'Complete Payment'}
                </Button>
              </div>
            </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <Card className="border-primary/30 bg-card/90 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  Welcome, {registration.schoolName || 'Your School'}!
                </CardTitle>
                <CardDescription>Your subscription is active and your ERP tenant is ready.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Tenant ID</p>
                    <p className="font-semibold">{tenantId}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4">
                    <p className="text-sm text-muted-foreground">Subscription</p>
                    <p className="font-semibold">{plan.name} ({billing})</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Portal URL</p>
                    <p className="font-semibold">{portalUrl}</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 md:col-span-2">
                    <p className="text-sm text-muted-foreground">Admin Credentials</p>
                    <p className="font-semibold">Username: admin@{schoolSlug || 'school'}.edu</p>
                    <p className="font-semibold">Password: Temp@1234 (reset on first login)</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      markLoggedIn()
                      router.push('/dashboard')
                    }}
                  >
                    Go To Dashboard
                  </Button>
                  <Button variant="outline">Download Invoice</Button>
                  <Button variant="secondary" onClick={() => setStep(5)}>
                    Complete Setup Wizard
                  </Button>
                </div>
              </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="border-border/70 bg-card/85 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle>First Time Setup Wizard</CardTitle>
              <CardDescription>Complete configuration in seven guided steps.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(wizardStep / setupSteps.length) * 100}%` }}
                />
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {setupSteps.map((item, idx) => {
                  const index = idx + 1
                  const state = index < wizardStep ? 'done' : index === wizardStep ? 'active' : 'pending'
                  return (
                    <div
                      key={item}
                      className={`rounded-lg border p-3 text-sm ${
                        state === 'active'
                          ? 'border-primary bg-primary/10'
                          : state === 'done'
                            ? 'border-border bg-muted/20'
                            : 'border-border'
                      }`}
                    >
                      <span className="font-medium">{index}. {item}</span>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <p className="text-sm text-muted-foreground">Current Step</p>
                <p className="font-semibold">{setupSteps[wizardStep - 1]}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Configure this section with your institution data to complete deployment.
                </p>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(4)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setWizardStep((prev) => Math.max(prev - 1, 1))}
                    disabled={wizardStep === 1}
                  >
                    Previous
                  </Button>
                  {wizardStep < setupSteps.length ? (
                    <Button onClick={() => setWizardStep((prev) => Math.min(prev + 1, setupSteps.length))}>
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        markLoggedIn()
                        router.push('/dashboard')
                      }}
                    >
                      Finish & Open Dashboard
                    </Button>
                  )}
                </div>
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
              <CardTitle className="text-base">Live Order Summary</CardTitle>
              <CardDescription>Auto-updates as you complete steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Selected Plan</p>
                <p className="mt-1 font-semibold">{plan.name}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Billing Cycle</p>
                <p className="mt-1 font-semibold capitalize">{billing}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                <p className="text-xs text-muted-foreground">Tenant Preview</p>
                <p className="mt-1 break-all font-medium">{portalUrl}</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-background/60 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{plan.isCustom ? 'Custom' : formatCurrency(baseAmount)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-muted-foreground">GST</span>
                  <span>{plan.isCustom ? '-' : formatCurrency(gst)}</span>
                </div>
                <div className="mt-2 border-t border-border/70 pt-2 font-semibold">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>{plan.isCustom ? 'Sales Assisted' : formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-lg border border-border/70 p-2">
                  <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-primary" />
                  TLS
                </div>
                <div className="rounded-lg border border-border/70 p-2">
                  <Lock className="mx-auto mb-1 h-4 w-4 text-primary" />
                  PCI
                </div>
                <div className="rounded-lg border border-border/70 p-2">
                  <CreditCard className="mx-auto mb-1 h-4 w-4 text-primary" />
                  GST
                </div>
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                <div className="mb-1 inline-flex items-center gap-1 font-medium text-foreground">
                  <Building2 className="h-3.5 w-3.5 text-primary" />
                  Fast provisioning
                </div>
                Your tenant, admin account, and subscription are automatically created after successful payment.
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                <div className="mb-1 inline-flex items-center gap-1 font-medium text-foreground">
                  <Users className="h-3.5 w-3.5 text-primary" />
                  Trial activation
                </div>
                Free trial is activated instantly. You can finish setup now or continue later from dashboard.
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
