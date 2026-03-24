import { createClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/custom/blog/PostCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Navansh Finserv',
  description: 'Read the latest insights and news from Navansh Finserv.',
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
  }

  return (
    <div className="container mx-auto mt-5 px-4 pb-24 md:pb-32">
      <div className="mb-12 max-w-2xl">
        <h1 className="text-foreground mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="text-muted-foreground text-lg">
          Interesting Blogs and Articles.
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="border-border bg-muted/50 flex min-h-[50vh] w-full flex-col items-center justify-center rounded-2xl border border-dashed">
          <p className="text-muted-foreground">No posts yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              coverImage={post.cover_image_url}
              publishedAt={post.published_at}
              slug={post.slug}
            />
          ))}
        </div>
      )}
      <p className="text-muted-foreground mt-5 text-sm">
        Our Website is made with the help of AI, but these Blogs are completely
        written and formatted by Humans. So please take your time to read!
      </p>
    </div>
  )
}
