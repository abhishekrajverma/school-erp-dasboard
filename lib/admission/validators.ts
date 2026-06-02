/** Shared field validators for admission form */

export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/
export const AADHAAR_REGEX = /^\d{12}$/
export const PIN_CODE_REGEX = /^[1-9][0-9]{5}$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeDigits(value: string): string {
  return value.replace(/\s+/g, '')
}

export function isValidIndianMobile(value: string): boolean {
  return INDIAN_MOBILE_REGEX.test(normalizeDigits(value))
}

export function isValidAadhaar(value: string): boolean {
  const digits = normalizeDigits(value)
  if (!AADHAAR_REGEX.test(digits)) return false
  // Verhoeff-like basic check: reject all same digits
  if (/^(\d)\1{11}$/.test(digits)) return false
  return true
}

export function isValidPinCode(value: string): boolean {
  return PIN_CODE_REGEX.test(normalizeDigits(value))
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim())
}

export function formatIndianMobile(value: string): string {
  const digits = normalizeDigits(value).slice(0, 10)
  if (digits.length <= 5) return digits
  return `${digits.slice(0, 5)} ${digits.slice(5)}`
}

export function formatAadhaar(value: string): string {
  const digits = normalizeDigits(value).slice(0, 12)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}
