'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { PartialBlock } from '@blocknote/core'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface BlockNoteRendererProps {
  content: PartialBlock[] | undefined
}

function InnerRenderer({
  content,
  resolvedTheme,
}: {
  content: PartialBlock[] | undefined
  resolvedTheme: string | undefined
}) {
  const editor = useCreateBlockNote({
    initialContent:
      Array.isArray(content) && content.length > 0 ? content : undefined,
  })

  return (
    <BlockNoteView
      editor={editor}
      editable={false}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  )
}

export function BlockNoteRenderer({ content }: BlockNoteRendererProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="blocknote-reader w-full bg-transparent">
      <InnerRenderer content={content} resolvedTheme={resolvedTheme} />
    </div>
  )
}
