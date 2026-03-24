import { createClient } from '@/lib/supabase/server'
import { PostForm } from '@/components/custom/blog/PostForm'
import { notFound } from 'next/navigation'

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  // Verify authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    notFound()
  }

  // Fetch the post
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error || !post) {
    notFound()
  }

  return <PostForm post={post} />
}
