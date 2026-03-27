import Image from 'next/image'
import Link from 'next/link'

interface PostCardProps {
  title: string
  excerpt?: string | null
  coverImage?: string | null
  publishedAt?: string | null
  slug: string
  priority?: boolean
}

export function PostCard({
  title,
  excerpt,
  coverImage,
  publishedAt,
  slug,
  priority = false,
}: PostCardProps) {
  // Format date as "12 March 2025"
  const formattedDate = publishedAt
    ? (() => {
        const date = new Date(publishedAt)
        return isNaN(date.getTime())
          ? ''
          : date.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
      })()
    : ''

  return (
    <Link href={`/blog/${slug}`} className="group block">
      <div className="border-border bg-card flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md">
        {coverImage ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex bg-transparent" />
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="text-muted-foreground mb-2 text-sm">
            {formattedDate}
          </div>
          <div className="tooltip" title={title}>
            <h3 className="text-foreground mb-3 line-clamp-2 text-xl leading-tight font-semibold group-hover:text-blue-600">
              {title}
            </h3>
          </div>
          {excerpt && (
            <p className="text-muted-foreground mb-6 line-clamp-3 text-sm">
              {excerpt}
            </p>
          )}
          <div className="mt-auto">
            <span className="text-primary text-sm font-medium">
              Read More &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
