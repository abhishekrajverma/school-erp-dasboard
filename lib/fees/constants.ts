export const SCHOOL_FEE_TYPES = [
  { id: 'tuition', label: 'Tuition', description: 'Annual / term tuition fee' },
  { id: 'transport', label: 'Transport', description: 'Bus / transport charges' },
  { id: 'library', label: 'Library', description: 'Library membership & books' },
  { id: 'computer', label: 'Computer', description: 'Computer lab & IT fee' },
  { id: 'smart-class', label: 'Smart Class', description: 'Digital classroom fee' },
] as const

export type SchoolFeeTypeId = (typeof SCHOOL_FEE_TYPES)[number]['id']

export const FEE_TYPE_IDS = SCHOOL_FEE_TYPES.map((f) => f.id) as [
  SchoolFeeTypeId,
  ...SchoolFeeTypeId[],
]
