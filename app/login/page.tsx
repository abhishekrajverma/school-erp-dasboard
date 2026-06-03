'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Landmark,
  UserCheck,
  UserCircle,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FadeUpLine, StaggeredWords, TypewriterText } from '@/components/auth/login-text-animations'
import { RotatingText } from '@/components/shared/rotating-text'
import { brand, hero } from '@/lib/landing/content'
import { getRoleHomePath } from '@/lib/auth'
import { demoLoginHints, type UserRole } from '@/lib/portal-users'
import { useAuth } from '@/components/providers/auth-provider'
import { cn } from '@/lib/utils'

const LOGIN_DESCRIPTION =
  'Sign in as admin, principal, teacher, student, or parent—each account sees only their own school data.'

const roleOptions: {
  id: UserRole
  label: string
  icon: React.ComponentType<{ className?: string }>
}[] = [
  { id: 'admin', label: 'Admin', icon: Users },
  { id: 'principal', label: 'Principal', icon: Landmark },
  { id: 'teacher', label: 'Teacher', icon: UserCheck },
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'parent', label: 'Parent', icon: UserCircle },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const highlights = [
  { icon: GraduationCap, label: '10,000+ schools onboarded' },
  { icon: ShieldCheck, label: 'Bank-grade security & compliance' },
  { icon: Sparkles, label: 'AI-powered insights & alerts' },
]

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, user, isLoading } = useAuth()
  const [role, setRole] = React.useState<UserRole>('teacher')
  const [email, setEmail] = React.useState(demoLoginHints.teacher.email)
  const [password, setPassword] = React.useState(demoLoginHints.teacher.password)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const [focusedField, setFocusedField] = React.useState<'email' | 'password' | null>(null)

  React.useEffect(() => {
    if (isLoading) return
    if (isAuthenticated && user) {
      router.replace(getRoleHomePath(user.role))
    }
  }, [router, isAuthenticated, user, isLoading])

  const handleRoleChange = (nextRole: UserRole) => {
    setRole(nextRole)
    setLoginError(null)
    const hint = demoLoginHints[nextRole]
    setEmail(hint.email)
    setPassword(hint.password)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim() || !password.trim()) return

    setIsSubmitting(true)
    setLoginError(null)

    try {
      const account = await login({ email: email.trim(), password })
      router.push(getRoleHomePath(account.role))
    } catch {
      setLoginError('Invalid email or password. Use the demo credentials below.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Brand panel */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="hidden flex-1 flex-col justify-between p-10 lg:flex lg:p-14 xl:p-16"
        >
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/25">
                <Sparkles className="h-4 w-4 text-primary" />
              </span>
              <span className="font-semibold text-foreground">{brand.name}</span>
            </Link>

            <h1 className="mt-14 max-w-lg text-4xl font-bold tracking-tight xl:text-5xl">
              <span className="block text-foreground">Welcome back to</span>
              <RotatingText
                words={hero.loginHeadlineRotations}
                className="mt-1 block"
                wordClassName="text-4xl xl:text-5xl"
              />
            </h1>
            <TypewriterText
              text={LOGIN_DESCRIPTION}
              delay={0.5}
              speed={18}
              className="mt-4 max-w-md text-lg leading-relaxed text-muted-foreground"
            />
          </div>

          <ul className="space-y-4">
            {highlights.map((item, i) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.1, duration: 0.45 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm">
                  <item.icon className="h-4 w-4 text-primary" />
                </span>
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 + i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {item.label}
                </motion.span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="landing-float flex items-center gap-4 rounded-2xl border border-primary/20 bg-card/40 p-4 backdrop-blur-md"
          >
            <div className="flex -space-x-2">
              {['A', 'R', 'S'].map((initial) => (
                <span
                  key={initial}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-primary/80 text-xs font-bold text-primary-foreground"
                >
                  {initial}
                </span>
              ))}
            </div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.15, duration: 0.5 }}
              className="text-sm text-muted-foreground"
            >
              <span className="font-semibold text-foreground">2,400+ admins</span> signed in today
            </motion.p>
          </motion.div>
        </motion.aside>

        {/* Form panel */}
        <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <div className="mb-6 text-center lg:hidden">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 mx-auto mb-3">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </span>
              <p className="text-sm font-medium text-muted-foreground">Welcome back to</p>
              <RotatingText
                words={hero.loginHeadlineRotations}
                className="mt-1"
                wordClassName="text-2xl"
              />
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-white/75 p-6 shadow-2xl shadow-primary/10 ring-1 ring-white/80 backdrop-blur-xl sm:p-8 dark:border-border/50 dark:bg-card/40 dark:shadow-primary/5 dark:ring-0">
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-chart-2/15 blur-2xl"
                aria-hidden
              />

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative space-y-6"
              >
                <motion.div variants={itemVariants} className="space-y-2 text-center lg:text-left">
                  <StaggeredWords
                    text="Sign in"
                    as="h2"
                    delay={0.25}
                    className="justify-center text-2xl font-bold tracking-tight lg:justify-start"
                  />
                  <FadeUpLine delay={0.45}>
                    <p className="text-sm text-muted-foreground">
                      Choose your role and sign in. You will only see data for your account.
                    </p>
                  </FadeUpLine>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-1 rounded-lg border border-border/60 bg-muted/30 p-1 sm:grid-cols-5">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon
                    const active = role === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleRoleChange(opt.id)}
                        className={cn(
                          'flex flex-col items-center gap-1 rounded-md px-1 py-2 text-[10px] font-medium transition-colors sm:text-xs',
                          active
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:bg-background/80 hover:text-foreground',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {opt.label}
                      </button>
                    )
                  })}
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div
                      className={cn(
                        'relative rounded-lg transition-shadow duration-300',
                        focusedField === 'email' && 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
                      )}
                    >
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="email"
                        required
                        className="h-11 border-border/60 bg-background/50 pl-10 transition-colors focus-visible:bg-background"
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        tabIndex={-1}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div
                      className={cn(
                        'relative rounded-lg transition-shadow duration-300',
                        focusedField === 'password' &&
                          'ring-2 ring-primary/30 ring-offset-2 ring-offset-background',
                      )}
                    >
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        autoComplete="current-password"
                        required
                        className="h-11 border-border/60 bg-background/50 pl-10 pr-10 transition-colors focus-visible:bg-background"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {loginError && (
                    <motion.p
                      variants={itemVariants}
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                      role="alert"
                    >
                      {loginError}
                    </motion.p>
                  )}

                  <motion.div
                    variants={itemVariants}
                    className="rounded-lg border border-primary/15 bg-primary/5 px-3 py-2.5 text-xs text-muted-foreground"
                  >
                    <span className="font-medium text-foreground">Demo — {demoLoginHints[role].label}:</span>{' '}
                    {demoLoginHints[role].email} / {demoLoginHints[role].password}
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        className="size-4 rounded border-border accent-primary"
                        defaultChecked
                      />
                      Keep me signed in on this device
                    </label>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting || !email.trim() || !password.trim()}
                      className="group relative h-11 w-full overflow-hidden text-base shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30"
                    >
                      <motion.span
                        className="flex items-center justify-center gap-2"
                        animate={isSubmitting ? { opacity: 0.9 } : { opacity: 1 }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Signing in…
                          </>
                        ) : (
                          <>
                            Sign in
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                          </>
                        )}
                      </motion.span>
                      {!isSubmitting && (
                        <motion.span
                          className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6, ease: 'easeInOut' }}
                        />
                      )}
                    </Button>
                  </motion.div>
                </form>

                <motion.p
                  variants={itemVariants}
                  className="text-center text-sm text-muted-foreground"
                >
                  New to {brand.name}?{' '}
                  <Link href="/get-started" className="font-medium text-primary hover:underline">
                    Start free trial
                  </Link>
                </motion.p>
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-xs text-muted-foreground"
            >
              Protected by 256-bit encryption · SOC 2 ready
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
