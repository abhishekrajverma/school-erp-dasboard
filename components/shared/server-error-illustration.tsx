'use client'

import { motion, useReducedMotion } from 'framer-motion'

/** Original flat illustration — friendly “connection lost” scene for EduSync */
export function ServerErrorIllustration({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()

  const content = (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-auto w-full max-w-[280px] sm:max-w-[320px]"
    >
      <ellipse cx="160" cy="248" rx="72" ry="10" fill="currentColor" className="text-muted-foreground/15" />

      <path
        d="M248 118h28c8 0 14 6 14 14v8M248 140h-20"
        stroke="#94A3B8"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="272" cy="132" r="6" fill="#F87171" />
      <path d="M269 129l6 6M275 129l-6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />

      <path
        d="M200 72c0-18 14-32 32-32 11 0 21 6 26 15 8-2 17 1 22 9 9 0 16 8 16 18 0 10-8 18-18 18H200c-14 0-25-11-25-25s11-25 28-28z"
        fill="#E2E8F0"
        className="dark:fill-slate-600"
      />
      <path d="M218 88h24M218 96h16" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />

      <circle cx="118" cy="88" r="28" fill="#5EEAD4" />
      <path
        d="M96 78c4-8 12-12 22-10 8 2 14 8 16 16"
        stroke="#0D9488"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="108" cy="86" r="3" fill="#1E293B" />
      <circle cx="128" cy="86" r="3" fill="#1E293B" />
      <path d="M110 98c6 4 14 4 20 0" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

      <path d="M88 116h60v72c0 8-6 14-14 14h-32c-8 0-14-6-14-14v-72z" fill="#6366F1" />
      <path d="M88 132h60M88 148h60M88 164h60" stroke="#818CF8" strokeWidth="4" />
      <path d="M88 116h60v16H88z" fill="#4F46E5" />

      <path
        d="M82 128c-12 8-18 24-14 38M154 128c12 10 16 26 10 40"
        stroke="#FBBF24"
        strokeWidth="10"
        strokeLinecap="round"
      />

      <rect x="134" y="148" width="36" height="48" rx="4" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2" />
      <path d="M142 168h20M142 176h14" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
      <circle cx="152" cy="160" r="4" fill="#FCA5A5" />

      <circle cx="168" cy="228" r="8" fill="#F472B6" opacity="0.85" />
      <circle cx="184" cy="236" r="6" fill="#FB7185" opacity="0.7" />
      <circle cx="152" cy="234" r="5" fill="#FDA4AF" opacity="0.75" />
      <path
        d="M160 220c8 12 16 18 24 16"
        stroke="#F472B6"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />

      <path d="M104 202v36M132 202v36" stroke="#334155" strokeWidth="12" strokeLinecap="round" />
      <path d="M94 238h20M122 238h20" stroke="#475569" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )

  if (reduceMotion) {
    return (
      <div aria-hidden className={className}>
        {content}
      </div>
    )
  }

  return (
    <motion.div
      aria-hidden
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.6, delay: 0.15 },
        y: { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 },
      }}
    >
      {content}
    </motion.div>
  )
}
