'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'
import type { SchoolWebsite } from '@/lib/school-website/types'
import { getSchoolWebsitePath } from '@/lib/school-website/utils'
import { fadeUp, staggerContainer, staggerItem, viewportOnce } from './school-site-motion'

type SchoolSiteFooterProps = {
  site: SchoolWebsite
}

export function SchoolSiteFooter({ site }: SchoolSiteFooterProps) {
  const base = getSchoolWebsitePath(site.slug)

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3"
      >
        <motion.div variants={staggerItem}>
          <p className="text-lg font-semibold">{site.schoolName}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{site.tagline}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            {site.affiliationBoard} · Est. {site.establishedYear}
          </p>
        </motion.div>

        <motion.div variants={staggerItem}>
          <p className="mb-3 text-sm font-semibold">Quick Links</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {[
              { label: 'Home', href: base },
              { label: 'Parent App & Portal', href: `${base}/features` },
              { label: 'Fee Structure', href: `${base}/fees` },
              { label: 'Admissions', href: `${base}/admissions` },
              { label: 'Announcements', href: `${base}/announcements` },
              { label: 'Parent / Staff Login', href: '/login' },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={staggerItem}>
          <p className="mb-3 text-sm font-semibold">Contact</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: site.primaryColor }} />
              <span>{site.address}, {site.city}, {site.state} – {site.pincode}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0" style={{ color: site.primaryColor }} />
              <a href={`tel:${site.phone}`} className="hover:text-foreground">{site.phone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0" style={{ color: site.primaryColor }} />
              <a href={`mailto:${site.email}`} className="hover:text-foreground">{site.email}</a>
            </li>
          </ul>
          {(site.socialLinks.facebook || site.socialLinks.instagram || site.socialLinks.youtube) && (
            <div className="mt-4 flex gap-3">
              {site.socialLinks.facebook && (
                <a href={site.socialLinks.facebook} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {site.socialLinks.instagram && (
                <a href={site.socialLinks.instagram} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {site.socialLinks.youtube && (
                <a href={site.socialLinks.youtube} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={viewportOnce}
        variants={fadeUp}
        className="border-t border-border/50 py-5 text-center text-xs text-muted-foreground"
      >
        © {new Date().getFullYear()} {site.schoolName}. Powered by{' '}
        <Link href="/" className="font-medium hover:text-foreground">EduSync</Link>
      </motion.div>
    </footer>
  )
}
