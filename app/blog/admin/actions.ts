'use server'

import { uploadBlogImage, validateImage } from '@/lib/blog-upload'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Email and password are required')
  }

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
  // Verify user is authenticated and authorized
  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const supabase = createServiceClient()
  const title = formData.get('title')
  const slug = formData.get('slug')
  const excerpt = formData.get('excerpt')

  let coverImageUrl = formData.get('cover_image_url') as string | null
  const coverImageFile = formData.get('cover_image_file') as File | null
  if (coverImageFile && coverImageFile.size > 0) {
    coverImageUrl = await uploadBlogImage(coverImageFile)
  } else if (coverImageUrl === '') {
    coverImageUrl = null
  }

  const contentStr = formData.get('content')

  if (typeof title !== 'string' || !title.trim()) {
    throw new Error('Title is required')
  }
  if (typeof slug !== 'string' || !slug.trim()) {
    throw new Error('Slug is required')
  }

  let content = {}
  try {
    content = JSON.parse(typeof contentStr === 'string' ? contentStr : '{}')
  } catch (e) {
    throw new Error('Failed to Create Post. Invalid content format', {
      cause: e,
    })
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

  let coverImageUrl = formData.get('cover_image_url') as string | null
  const coverImageFile = formData.get('cover_image_file') as File | null
  if (coverImageFile && coverImageFile.size > 0) {
    coverImageUrl = await uploadBlogImage(coverImageFile)
  } else if (coverImageUrl === '') {
    coverImageUrl = null
  }

  const contentStr = formData.get('content') as string

  let content = {}
  try {
    content = JSON.parse(contentStr || '{}')
  } catch {
    throw new Error('Failed to Update Post. Invalid content format')
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
    // Only set published_at when first publishing, not on every toggle
    if (published) {
      // Fetch current post to check if it was previously published
      const { data: existingPost } = await supabase
        .from('posts')
        .select('published_at')
        .eq('id', id)
        .single()
      if (!existingPost?.published_at) {
        updates.published_at = new Date().toISOString()
      }
    }
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
  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  // Grab the post cover image specifically so we can delete from the bucket
  const { data: post } = await supabase
    .from('posts')
    .select('cover_image_url')
    .eq('id', id)
    .single()
  if (post?.cover_image_url) {
    const urlParts = post.cover_image_url.split('/')
    const filename = urlParts[urlParts.length - 1]
    if (filename) {
      await supabase.storage.from('blog-images').remove([filename])
    }
  }
  const { error } = await supabase.from('posts').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/blog')
  revalidatePath('/blog/admin')
}

export async function duplicatePost(id: string): Promise<string> {
  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  // Fetch original post
  const { data: originalPost, error: fetchError } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !originalPost) throw new Error('Post not found')

  const newTitle = `Copy of ${originalPost.title}`
  const newSlug = `${originalPost.slug}-copy-${Date.now()}`

  const { data: newPost, error: insertError } = await supabase
    .from('posts')
    .insert([
      {
        title: newTitle,
        slug: newSlug,
        excerpt: originalPost.excerpt,
        content: originalPost.content,
        cover_image_url: null, // Intentional: avoid shared image deletion bugs
        published: false,
        published_at: null,
      },
    ])
    .select('id')
    .single()

  if (insertError) throw new Error(insertError.message)

  revalidatePath('/blog')
  revalidatePath('/blog/admin')

  return newPost.id
}

export async function togglePublished(
  id: string,
  isPublished: boolean
): Promise<void> {
  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

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

export async function uploadBlogImageAction(
  formData: FormData
): Promise<string> {
  const authClient = await createClient()
  const {
    data: { user },
    error: authError,
  } = await authClient.auth.getUser()
  if (authError || !user) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  if (!file) throw new Error('No file provided')

  // Explicit entry point validation
  await validateImage(file)

  return uploadBlogImage(file)
}
