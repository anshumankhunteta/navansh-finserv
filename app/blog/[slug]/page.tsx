import { createClient } from '@/lib/supabase/server'
import { CustomRenderer } from '@/components/custom/blog/CustomRenderer'
import { TableOfContents } from '@/components/custom/blog/TableOfContents'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Edit } from 'lucide-react'
import Image from 'next/image'

// Basic reading time estimate
function getReadingTime(text: string) {
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const resolvedParams = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let query = supabase
    .from('posts')
    .select('title, excerpt, cover_image_url')
    .eq('slug', resolvedParams.slug)

  if (!user) {
    query = query.eq('published', true)
  }

  const { data: post } = await query.single()

  if (!post) {
    return { title: 'Post Not Found | Navansh Finserv' }
  }

  return {
    title: `${post.title} | Navansh Finserv`,
    description: post.excerpt || 'Read this post on Navansh Finserv',
    openGraph: {
      title: post.title,
      description: post.excerpt || 'Read this post on Navansh Finserv',
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  let query = supabase.from('posts').select('*').eq('slug', resolvedParams.slug)

  // Apply published filter only if no admin session exists
  if (!user) {
    query = query.eq('published', true)
  }

  const { data: post, error } = await query.single()

  if (error || !post) {
    notFound()
  }

  // Very naive text extraction from JSON document structure
  const rawText = JSON.stringify(post.content) || ''
  const readingTime = getReadingTime(rawText.replace(/["'{}[\]:]/g, ' '))

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <div className="bg-background container mx-auto px-4 py-24 md:my-12 md:p-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <aside className="sticky top-24 hidden max-h-[500px] space-y-10 overflow-y-hidden lg:col-span-3 lg:block">
          {user ? (
            <>
              <Link
                href={`/blog`}
                className="group text-muted-foreground hover:text-foreground mb-8 inline-flex items-center text-sm font-medium transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
              <Link
                href={`/blog/admin/${post.id}/edit`}
                className="group text-muted-foreground hover:text-foreground mb-8 inline-flex items-center text-sm font-medium transition-colors"
              >
                <Edit className="ml-5 h-4 w-4" />
              </Link>
            </>
          ) : (
            <Link
              href="/blog"
              className="group text-muted-foreground hover:text-foreground mb-8 inline-flex items-center text-sm font-medium transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Link>
          )}

          <TableOfContents />
        </aside>

        <article className="lg:col-span-9">
          {/* Mobile Back Button (since sidebar is hidden on small screens) */}
          <div className="mb-8 block lg:hidden">
            {user ? (
              <Link
                href={`/blog/admin/${post.id}/edit`}
                className="group text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Editor
              </Link>
            ) : (
              <Link
                href="/blog"
                className="group text-muted-foreground hover:text-foreground inline-flex items-center text-sm font-medium transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Blog
              </Link>
            )}
          </div>

          <header className="mb-12">
            {post.cover_image_url ? (
              <div
                className="tooltip mb-8 overflow-hidden rounded-2xl"
                title={post.title}
              >
                <Image
                  src={post.cover_image_url}
                  alt={post.title}
                  width={1280}
                  height={720}
                  priority={true}
                  className="object-cover object-center"
                />
              </div>
            ) : (
              <h1
                id={post.id}
                className="text-foreground mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl"
              >
                {post.title} {post.published ? '' : '(Draft)'}
              </h1>
            )}
            <div className="text-muted-foreground flex items-center space-x-4 text-sm">
              <time dateTime={post.published_at || undefined}>
                {formattedDate}
              </time>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>
          </header>

          {post.excerpt && (
            <div className="text-foreground mb-12 text-xl leading-relaxed font-medium">
              {post.excerpt}
            </div>
          )}

          <div className="prose dark:prose-invert md:prose-lg lg:prose-xl mb-12 max-w-none">
            <CustomRenderer blocks={post.content} />
          </div>
        </article>
      </div>
    </div>
  )
}
