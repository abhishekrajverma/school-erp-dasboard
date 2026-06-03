export const CORRELATION_HEADER = 'X-Correlation-Id'

export function createCorrelationId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export function getOrCreateCorrelationId(existing?: string | null): string {
  return existing?.trim() || createCorrelationId()
}
