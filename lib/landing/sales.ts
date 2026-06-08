import { companyBrand } from '@/lib/company-branding'

export const salesContact = {
  cta: 'Connect for pricing',
  email: companyBrand.supportEmail,
  pricingHeadline: 'Connect for pricing',
  pricingNote:
    'Every school is different. Share your requirements and our team will send a custom quote — no online checkout.',
  heroNote: 'Speak with our team for a custom quote — no online checkout.',
  enquirySuccess:
    'Our sales team will review your details and reach out within 1–2 business days with a tailored plan.',
} as const

export function pricingEnquiryMailto(
  planName?: string,
  details?: Record<string, string | undefined>,
): string {
  const subject = planName
    ? `EduSync pricing enquiry — ${planName}`
    : 'EduSync pricing enquiry'

  let body = 'Hi EduSync team,\n\nI would like to know about pricing for our school.\n'
  if (planName) body += `\nInterested plan: ${planName}\n`
  if (details) {
    for (const [key, value] of Object.entries(details)) {
      if (value?.trim()) body += `${key}: ${value.trim()}\n`
    }
  }
  body += '\nThank you.'

  return `mailto:${salesContact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
