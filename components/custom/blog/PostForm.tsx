'use client'

import { useState, useEffect } from 'react'
import { redirect, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SlugInput } from './SlugInput'
import { BlockNoteEditor } from './BlockNoteEditor'
import { createPost, updatePost, type PostRow } from '@/app/blog/admin/actions'
import { ArrowLeft, Eye, Upload, ClipboardPaste, ImageIcon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
  const [isCoverDialogOpen, setIsCoverDialogOpen] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [content, setContent] = useState<PartialBlock[] | undefined>(
    (post?.content as PartialBlock[]) || undefined
  )

  const [loading, setLoading] = useState<false | 'draft' | 'publish'>(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSetCoverImage = (file: File) => {
    setCoverImageFile(file)
    setCoverImageUrl(URL.createObjectURL(file))
    setIsCoverDialogOpen(false)
  }

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

  const handleBackClick = (e: React.MouseEvent) => {
    const isChanged =
      title !== (post?.title || '') ||
      slug !== (post?.slug || '') ||
      excerpt !== (post?.excerpt || '') ||
      coverImageFile !== null ||
      coverImageUrl !== (post?.cover_image_url || '') ||
      JSON.stringify(content || []) !== JSON.stringify(post?.content || [])

    if (isChanged) {
      e.preventDefault()
      setShowExitDialog(true)
    }
  }

  return (
    <div className="mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <Link
            href="/blog/admin"
            onClick={handleBackClick}
            className="text-muted-foreground hover:text-foreground flex items-center text-sm font-medium transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
              <AlertDialogDescription>
                You have unsaved changes. Are you sure you want to leave this
                page? Your changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  handleSave(false, 'draft')
                  redirect('/blog/admin')
                }}
              >
                Save Changes and Leave
              </AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={() => redirect('/blog/admin')}
              >
                Leave Page
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
            <Button asChild variant="ghost" className="text-muted-foreground">
              <Link href={`/blog/${post.slug}`}>
                <Eye />
              </Link>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => handleSave(false, 'draft')}
            disabled={loading !== false}
          >
            {loading === 'draft' ? 'Saving...' : 'Save Draft'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={loading !== false}>
                {loading === 'publish' ? 'Publishing...' : 'Publish'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ready to publish?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will make the post visible on the public blog. Are you
                  sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleSave(true, 'publish')}>
                  Publish
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
            <Label className="text-foreground">Cover Image (Under 1MB)</Label>

            <AlertDialog
              open={isCoverDialogOpen}
              onOpenChange={setIsCoverDialogOpen}
            >
              {!coverImageUrl ? (
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex h-24 w-full flex-col items-center justify-center gap-2 border-dashed"
                  >
                    <ImageIcon className="text-muted-foreground h-6 w-6" />
                    <span className="text-muted-foreground">
                      Add Cover Image
                    </span>
                  </Button>
                </AlertDialogTrigger>
              ) : (
                <div className="border-border bg-muted/50 relative mt-2 aspect-[16/9] w-full overflow-hidden rounded-md border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImageUrl}
                    alt="Cover Preview"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="h-8"
                      >
                        Change
                      </Button>
                    </AlertDialogTrigger>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="h-8"
                      onClick={() => {
                        setCoverImageFile(null)
                        setCoverImageUrl('')
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              <AlertDialogContent
                onPaste={(e) => {
                  const file = e.clipboardData.files?.[0]
                  if (file && file.type.startsWith('image/')) {
                    e.preventDefault()
                    handleSetCoverImage(file)
                  }
                }}
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Cover Image (Under 1MB)</AlertDialogTitle>
                  <AlertDialogDescription>
                    Upload a file from your computer or paste an image from your
                    clipboard.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="outline"
                      className="flex h-24 w-full flex-col"
                      onClick={() =>
                        document.getElementById('coverImageInput')?.click()
                      }
                    >
                      <Upload className="mb-2 h-6 w-6" />
                      Upload File
                    </Button>
                    <input
                      id="coverImageInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleSetCoverImage(file)
                        }
                      }}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <Button
                      variant="outline"
                      className="group relative flex h-24 w-full flex-col overflow-hidden"
                      onClick={async () => {
                        try {
                          const items = await navigator.clipboard.read()
                          let foundImage = false
                          for (const item of items) {
                            const imageType = item.types.find((type) =>
                              type.startsWith('image/')
                            )
                            if (imageType) {
                              const blob = await item.getType(imageType)
                              const file = new File(
                                [blob],
                                'clipboard-image.png',
                                { type: imageType }
                              )
                              handleSetCoverImage(file)
                              foundImage = true
                              break
                            }
                          }
                          if (!foundImage) {
                            alert('No image found in clipboard')
                          }
                        } catch (err) {
                          alert(
                            'Please press Ctrl+V (or Cmd+V) to paste from clipboard.'
                          )
                        }
                      }}
                    >
                      <ClipboardPaste className="mb-2 h-6 w-6" />
                      <span>Paste from Clipboard</span>
                    </Button>
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
