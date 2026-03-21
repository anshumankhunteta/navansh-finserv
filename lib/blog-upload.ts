import { createClient } from '@/lib/supabase/server'

export async function uploadBlogImage(file: File): Promise<string> {
  const supabase = await createClient()
  const filename = `${Date.now()}-${file.name}`

  const { error } = await supabase.storage
    .from('blog-images')
    .upload(filename, file)

  if (error) throw error

  const { data } = supabase.storage.from('blog-images').getPublicUrl(filename)

  return data.publicUrl
}
