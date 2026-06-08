export type TeacherDutyRequest = {
  id: string
  teacherId: string
  type: 'substitution' | 'exam_invigilation' | 'certificate' | 'resource'
  title: string
  details: string
  status: 'pending' | 'approved' | 'rejected'
  submittedOn: string
}

export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const PROFILE_PHOTO_ACCEPT = 'image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png'

const PROFILE_PHOTOS_STORAGE_KEY = 'edusync-teacher-profile-photos-v1'

export function loadTeacherProfilePhotos(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(PROFILE_PHOTOS_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, string>) : {}
  } catch {
    return {}
  }
}

export function saveTeacherProfilePhoto(teacherId: string, dataUrl: string) {
  const photos = loadTeacherProfilePhotos()
  photos[teacherId] = dataUrl
  localStorage.setItem(PROFILE_PHOTOS_STORAGE_KEY, JSON.stringify(photos))
}

export function removeTeacherProfilePhoto(teacherId: string) {
  const photos = loadTeacherProfilePhotos()
  delete photos[teacherId]
  localStorage.setItem(PROFILE_PHOTOS_STORAGE_KEY, JSON.stringify(photos))
}

export function getTeacherProfilePhotoUrl(
  teacherId: string,
  photos: Record<string, string>,
  fallback?: string,
): string | undefined {
  return photos[teacherId] ?? fallback
}
