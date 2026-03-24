import { createServiceClient } from '@/lib/supabase/server'

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export async function validateImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Invalid file type: ${file.type}. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    )
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Max size: 5MB`
    )
  }

  // Magic bytes check
  const buffer = await file.slice(0, 4).arrayBuffer()
  const bytes = new Uint8Array(buffer)
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()

  const isJpeg = hex.startsWith('FFD8FF')
  const isPng = hex === '89504E47'
  const isGif = hex.startsWith('47494638')
  const isWebp = hex === '52494646'

  if (!isJpeg && !isPng && !isGif && !isWebp) {
    throw new Error('Invalid file content: Signature mismatch')
  }
}

export async function uploadBlogImage(file: File): Promise<string> {
  await validateImage(file)
  const supabase = createServiceClient()

  // Sanitize filename to prevent path traversal and unsafe characters
  const extMatch = file.name.match(/\.[0-9a-z]+$/i)
  const ext = extMatch ? extMatch[0].toLowerCase() : ''
  const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext)
    ? ext
    : '.bin'
  const randomId = crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2, 15)
  const filename = `${Date.now()}-${randomId}${safeExt}`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filename, file)

  if (error) throw error

  const { data } = supabase.storage.from('blog-images').getPublicUrl(filename)

  return data.publicUrl
}
