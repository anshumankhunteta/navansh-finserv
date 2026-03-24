'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlugInput } from './SlugInput'
import { BlockNoteEditor } from './BlockNoteEditor'
import { createPost, updatePost, type PostRow } from '@/app/blog/admin/actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { PartialBlock } from '@blocknote/core'

export function PostForm({ post }: { post?: Partial<PostRow> | null }) {
  const router = useRouter()
  const [title, setTitle] = useState(post?.title || '')
  const [slug, setSlug] = useState(post?.slug || '')
  const [excerpt, setExcerpt] = useState(post?.excerpt || '')
  const [coverImageUrl, setCoverImageUrl] = useState(
    post?.cover_image_url || ''
  )
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [content, setContent] = useState<PartialBlock[] | undefined>(
    (post?.content as PartialBlock[]) || undefined
  )

  const [loading, setLoading] = useState<false | 'draft' | 'publish'>(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSave = async (
    publishStatus: boolean,
    actionType: 'draft' | 'publish'
  ) => {
    // Validate required paths
    if (!title.trim()) {
      alert('Title is required.')
      return
    }
    if (!slug.trim()) {
      alert('Slug is required.')
      return
    }

    setLoading(actionType)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('slug', slug)
    formData.append('excerpt', excerpt)

    if (coverImageFile) {
      formData.append('cover_image_file', coverImageFile)
    } else if (coverImageUrl === '') {
      formData.append('cover_image_url', '')
    } else {
      formData.append('cover_image_url', coverImageUrl)
    }
    formData.append('content', JSON.stringify(content ?? []))
    formData.append('published', publishStatus ? 'true' : 'false')

    try {
      if (post?.id) {
        await updatePost(post.id, formData)
        router.refresh()
      } else {
        const newId = await createPost(formData)
        router.push(`/blog/admin/${newId}/edit`)
      }
    } catch (err: unknown) {
      const e = err as Error
      alert(e.message || 'Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  // Figure out the most recent valid date
  const lastSavedDate = post?.published_at || post?.created_at
  const formattedDate =
    mounted && lastSavedDate ? new Date(lastSavedDate).toLocaleString() : null

  return (
    <div className="mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/blog/admin"
          className="text-muted-foreground hover:text-foreground flex items-center text-sm font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Link>
        <div className="text-muted-foreground text-sm">
          {post?.id && formattedDate && <>Last updated: {formattedDate}</>}
        </div>
      </div>

      <div className="border-border bg-card mb-8 flex items-center justify-between rounded-xl border p-6 shadow-sm">
        <h1 className="text-foreground text-sm font-bold lg:text-2xl">
          {post?.id ? 'Edit Post' : 'New Post'}
        </h1>
        <div className="flex items-center gap-3">
          {post?.slug && (
            <Button
              asChild
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
            >
              <Link href={`/blog/${post.slug}`}>Preview</Link>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleSave(false, 'draft')}
            disabled={loading !== false}
          >
            {loading === 'draft' ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            onClick={() => handleSave(true, 'publish')}
            disabled={loading !== false}
          >
            {loading === 'publish' ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="border-border bg-card space-y-2 rounded-xl border p-6 shadow-sm">
            <Label htmlFor="title" className="text-foreground">
              Title ({title.length}/120)
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your catchy title..."
              className="text-base"
              maxLength={120}
            />
          </div>

          <div className="border-border bg-card space-y-2 rounded-xl border p-6 shadow-sm">
            <Label className="text-foreground">Content</Label>
            <div className="-mx-2">
              <BlockNoteEditor
                initialContent={post?.content}
                onChange={setContent}
              />
            </div>
          </div>
        </div>

        <div className="border-border bg-card h-fit space-y-6 rounded-xl border p-6 shadow-sm">
          <div className="mb-6 space-y-2">
            <Label htmlFor="coverImage" className="text-foreground">
              Cover Image
            </Label>
            <Input
              id="coverImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setCoverImageFile(file)
                  setCoverImageUrl(URL.createObjectURL(file))
                }
              }}
            />
            {coverImageUrl && (
              <div className="border-border bg-muted/50 relative mt-2 aspect-[16/9] w-full overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImageUrl}
                  alt="Cover Preview"
                  className="h-full w-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-8"
                  onClick={() => {
                    setCoverImageFile(null)
                    setCoverImageUrl('')
                    const input = document.getElementById(
                      'coverImage'
                    ) as HTMLInputElement
                    if (input) input.value = ''
                  }}
                >
                  Remove
                </Button>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-foreground">
              Excerpt
            </Label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={4}
              placeholder="A short summary of the content..."
              className="border-border text-foreground placeholder:text-muted-foreground w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:outline-none dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
            />
            <SlugInput title={title} value={slug} onChange={setSlug} />
          </div>
        </div>
      </div>
    </div>
  )
}
