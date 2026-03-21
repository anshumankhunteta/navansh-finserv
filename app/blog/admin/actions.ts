'use server'

import { createServiceClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { uploadBlogImage } from '@/lib/blog-upload'

export type PostRow = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any // jsonb
  cover_image_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function createPost(formData: FormData): Promise<string> {
  const supabase = createServiceClient()
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const coverImageUrl = formData.get('cover_image_url') as string
  const contentStr = formData.get('content') as string
  let content = {}
  try {
    content = JSON.parse(contentStr || '{}')
  } catch {
    console.error('Failed to parse content JSON')
  }
  const published = formData.get('published') === 'true'

  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        title,
        slug,
        excerpt,
        content,
        cover_image_url: coverImageUrl || null,
        published,
        published_at: published ? new Date().toISOString() : null,
      },
    ])
    .select('id')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/blog')
  revalidatePath('/blog/admin')
  return data.id
}

export async function updatePost(
  id: string,
  formData: FormData
): Promise<void> {
  const supabase = createServiceClient()
  const title = formData.get('title') as string
  const slug = formData.get('slug') as string
  const excerpt = formData.get('excerpt') as string
  const coverImageUrl = formData.get('cover_image_url') as string
  const contentStr = formData.get('content') as string

  let content = {}
  try {
    content = JSON.parse(contentStr || '{}')
  } catch {
    console.error('Failed to parse content JSON')
  }

  const updates: Partial<PostRow> = {
    title,
    slug,
    excerpt,
    content,
    cover_image_url: coverImageUrl || null,
  }

  if (formData.has('published')) {
    const published = formData.get('published') === 'true'
    updates.published = published
    updates.published_at = published ? new Date().toISOString() : null
  }

  const { error } = await supabase.from('posts').update(updates).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/blog')
  revalidatePath('/blog/admin')
  revalidatePath(`/blog/${slug}`)
}

export async function deletePost(id: string): Promise<void> {
  const supabase = createServiceClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/blog')
  revalidatePath('/blog/admin')
}

export async function togglePublished(
  id: string,
  isPublished: boolean
): Promise<void> {
  const supabase = createServiceClient()
  const updates = {
    published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  }

  const { error } = await supabase.from('posts').update(updates).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/blog')
  revalidatePath('/blog/admin')
}

export async function uploadBlogImageAction(formData: FormData) {
  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')
  return uploadBlogImage(file)
}
