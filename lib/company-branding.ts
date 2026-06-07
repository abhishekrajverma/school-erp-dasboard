/** Platform company branding — shown across admin dashboard & auth screens. */
export const companyBrand = {
  name: 'EduSync',
  legalName: 'EduSync Technologies Pvt. Ltd.',
  tagline: 'India’s multi-tenant school ERP',
  website: 'https://edusync.in',
  websiteLabel: 'edusync.in',
  supportEmail: 'hello@edusync.in',
  poweredByLabel: 'Powered by',
} as const

export function companyCopyright(year = new Date().getFullYear()): string {
  return `© ${year} ${companyBrand.legalName}`
}
