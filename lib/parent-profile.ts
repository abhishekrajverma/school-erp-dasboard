const PROFILE_PHOTOS_STORAGE_KEY = 'edusync-parent-profile-photos-v1'
const PROFILE_DETAILS_STORAGE_KEY = 'edusync-parent-profile-details-v1'

export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const PROFILE_PHOTO_ACCEPT = 'image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png'

export type ParentProfileDetails = {
  phone: string
  alternatePhone: string
  occupation: string
  address: string
  emergencyContact: string
}

export function loadParentProfilePhotos(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PROFILE_PHOTOS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : {}
  } catch {
    return {}
  }
}

export function saveParentProfilePhoto(parentId: string, dataUrl: string) {
  const photos = loadParentProfilePhotos()
  photos[parentId] = dataUrl
  localStorage.setItem(PROFILE_PHOTOS_STORAGE_KEY, JSON.stringify(photos))
}

export function removeParentProfilePhoto(parentId: string) {
  const photos = loadParentProfilePhotos()
  delete photos[parentId]
  localStorage.setItem(PROFILE_PHOTOS_STORAGE_KEY, JSON.stringify(photos))
}

export function getParentProfilePhotoUrl(
  parentId: string,
  photos: Record<string, string>,
  fallbackAvatar?: string,
) {
  return photos[parentId] ?? fallbackAvatar
}

function loadProfileDetailsStore(): Record<string, Partial<ParentProfileDetails>> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PROFILE_DETAILS_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    return parsed && typeof parsed === 'object'
      ? (parsed as Record<string, Partial<ParentProfileDetails>>)
      : {}
  } catch {
    return {}
  }
}

export function saveParentProfileDetails(parentId: string, details: ParentProfileDetails) {
  const store = loadProfileDetailsStore()
  store[parentId] = details
  localStorage.setItem(PROFILE_DETAILS_STORAGE_KEY, JSON.stringify(store))
}

export function getParentProfileDetails(
  parentId: string,
  parent?: {
    phone?: string
    occupation?: string | null
    address?: string | null
  },
): ParentProfileDetails | null {
  const saved = loadProfileDetailsStore()[parentId]
  if (!parent && !saved) return null

  return {
    phone: saved?.phone ?? parent?.phone ?? '',
    alternatePhone: saved?.alternatePhone ?? '',
    occupation: saved?.occupation ?? parent?.occupation ?? '',
    address: saved?.address ?? parent?.address ?? '',
    emergencyContact: saved?.emergencyContact ?? parent?.phone ?? '',
  }
}
