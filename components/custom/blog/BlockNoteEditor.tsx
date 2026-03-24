'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { uploadBlogImageAction } from '@/app/blog/admin/actions'
import { PartialBlock } from '@blocknote/core'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface BlockNoteEditorProps {
  initialContent?: PartialBlock[] | undefined
  onChange: (content: PartialBlock[]) => void
}

function InnerEditor({
  initialContent,
  onChange,
  resolvedTheme,
}: {
  initialContent: PartialBlock[] | undefined
  onChange: (content: PartialBlock[]) => void
  resolvedTheme: string | undefined
}) {
  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        return await uploadBlogImageAction(formData)
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Upload failed'
        alert(msg)
        throw error
      }
    },
    initialContent:
      Array.isArray(initialContent) && initialContent.length > 0
        ? initialContent
        : undefined,
  })

  return (
    <BlockNoteView
      editor={editor}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
      onChange={() => {
        onChange(editor.document)
      }}
    />
  )
}

export function BlockNoteEditor({
  initialContent,
  onChange,
}: BlockNoteEditorProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch for theme
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="border-border bg-muted/50 min-h-[300px] w-full animate-pulse rounded-md border" />
    )
  }

  return (
    <div className="border-border bg-card min-h-[300px] w-full rounded-md border py-4">
      <InnerEditor
        initialContent={initialContent}
        onChange={onChange}
        resolvedTheme={resolvedTheme}
      />
    </div>
  )
}
