import { api } from './client'

export type UploadProgressHandler = (progress: number) => void

export async function uploadFile(
  path: string,
  file: File,
  fieldName = 'file',
  extraFields?: Record<string, string>,
): Promise<{ url: string; id?: string }> {
  const formData = new FormData()
  formData.append(fieldName, file)
  if (extraFields) {
    Object.entries(extraFields).forEach(([key, value]) => formData.append(key, value))
  }

  return api<{ url: string; id?: string }>(path, {
    method: 'POST',
    body: formData,
    rawBody: true,
  })
}
