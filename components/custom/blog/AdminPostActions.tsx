'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit, Trash2, Eye } from 'lucide-react'
import { deletePost, togglePublished } from '@/app/blog/admin/actions'

export function AdminPostActions({
  id,
  slug,
  published,
}: {
  id: string
  slug: string
  published: boolean
}) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await togglePublished(id, !published)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (
      !confirm(
        'Are you sure you want to delete this post? This cannot be undone.'
      )
    )
      return

    setLoading(true)
    try {
      await deletePost(id)
    } finally {
      // Re-enable if navigation doesn't instantly tear down the component
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <Link href={`/blog/${slug}`} target="_blank">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground h-8 w-8"
          title="Preview Post"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground h-8 px-2"
        onClick={handleToggle}
        disabled={loading}
      >
        {published ? 'Unpublish' : 'Publish'}
      </Button>

      <Link
        href={`/blog/admin/${id}/edit`}
        className={loading ? 'pointer-events-none' : ''}
        aria-disabled={loading}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground h-8 w-8 hover:text-blue-600 dark:hover:text-blue-400"
          disabled={loading}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </Link>

      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground hover:text-destructive h-8 w-8 dark:hover:text-red-400"
        onClick={handleDelete}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
