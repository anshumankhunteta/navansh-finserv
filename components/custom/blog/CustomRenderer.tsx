import { ChevronRight } from 'lucide-react'
import React from 'react'

export type BlockNoteInlineNode = {
  type?: string
  text?: string
  href?: string
  styles?: {
    backgroundColor?: string
    textColor?: string
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strike?: boolean
    code?: boolean
  }
}

export type BlockNoteNode = {
  id?: string
  type?: string
  props?: {
    level?: number
    textAlignment?: 'left' | 'center' | 'right'
    previewWidth?: number
    url?: string
    caption?: string
    alt?: string
    checked?: boolean
  }
  content?: BlockNoteInlineNode[]
  children?: BlockNoteNode[]
  items?: BlockNoteNode[]
}

interface RenderInlineProps {
  content?: BlockNoteInlineNode[]
}

const RenderInline = ({ content }: RenderInlineProps) => {
  if (!content || !Array.isArray(content)) return null

  return (
    <>
      {content.map((inline, index) => {
        if (inline.type === 'text' || inline.type === 'link') {
          let el = <>{inline.text ?? ''}</>

          if (inline.styles) {
            const bgColor = inline.styles.backgroundColor
            const textColor = inline.styles.textColor

            if (bgColor && bgColor !== 'default') {
              el = <span style={{ backgroundColor: bgColor }}>{el}</span>
            }
            if (textColor && textColor !== 'default') {
              el = <span style={{ color: textColor }}>{el}</span>
            }

            if (inline.styles.bold) el = <strong>{el}</strong>
            if (inline.styles.italic) el = <em>{el}</em>
            if (inline.styles.underline) el = <u>{el}</u>
            if (inline.styles.strike) el = <del>{el}</del>
            if (inline.styles.code)
              el = (
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
                  {el}
                </code>
              )
          }

          if (inline.type === 'link' && inline.href) {
            const isValidUrl =
              /^https?:\/\//i.test(inline.href) ||
              inline.href.startsWith('/') ||
              inline.href.startsWith('#')
            const safeHref = isValidUrl ? inline.href : '#'
            el = (
              <a
                href={safeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline"
              >
                {el}
              </a>
            )
          }

          return <React.Fragment key={index}>{el}</React.Fragment>
        }
        return null
      })}
    </>
  )
}

interface CustomRendererProps {
  blocks: BlockNoteNode[]
}

export function CustomRenderer({ blocks }: CustomRendererProps) {
  if (!blocks || !Array.isArray(blocks)) return null

  // Pre-process blocks to group consecutive list items together
  const groupedBlocks: BlockNoteNode[] = []
  let currentGroup: {
    type: 'ul' | 'ol' | 'checkList'
    items: BlockNoteNode[]
  } | null = null

  blocks.forEach((block) => {
    if (block.type === 'bulletListItem') {
      if (currentGroup?.type === 'ul') {
        currentGroup.items.push(block)
      } else {
        if (currentGroup) groupedBlocks.push(currentGroup)
        currentGroup = { type: 'ul', items: [block] }
      }
    } else if (block.type === 'numberedListItem') {
      if (currentGroup?.type === 'ol') {
        currentGroup.items.push(block)
      } else {
        if (currentGroup) groupedBlocks.push(currentGroup)
        currentGroup = { type: 'ol', items: [block] }
      }
    } else if (block.type === 'checkListItem') {
      if (currentGroup?.type === 'checkList') {
        currentGroup.items.push(block)
      } else {
        if (currentGroup) groupedBlocks.push(currentGroup)
        currentGroup = { type: 'checkList', items: [block] }
      }
    } else {
      if (currentGroup) {
        groupedBlocks.push(currentGroup)
        currentGroup = null
      }
      groupedBlocks.push(block)
    }
  })
  if (currentGroup) groupedBlocks.push(currentGroup)

  return (
    <>
      {groupedBlocks.map((groupOrBlock, index) => {
        if (groupOrBlock.type === 'ul') {
          return (
            <ul
              className="my-4 ml-6 w-full list-disc space-y-2 wrap-break-word"
              key={`ul-${index}`}
            >
              {groupOrBlock.items?.map(
                (item: BlockNoteNode, itemIndex: number) => (
                  <li key={item.id ?? `item-${itemIndex}`}>
                    <RenderInline content={item.content} />
                    {item.children && item.children.length > 0 && (
                      <CustomRenderer blocks={item.children} />
                    )}
                  </li>
                )
              )}
            </ul>
          )
        }
        if (groupOrBlock.type === 'ol') {
          return (
            <ol
              className="my-4 ml-6 list-decimal space-y-2 wrap-break-word"
              key={`ol-${index}`}
            >
              {groupOrBlock.items?.map(
                (item: BlockNoteNode, itemIndex: number) => (
                  <li key={item.id ?? `item-${itemIndex}`}>
                    <RenderInline content={item.content} />
                    {item.children && item.children.length > 0 && (
                      <CustomRenderer blocks={item.children} />
                    )}
                  </li>
                )
              )}
            </ol>
          )
        }
        if (groupOrBlock.type === 'checkList') {
          return (
            <div
              className="my-4 flex flex-col space-y-2"
              key={`checklist-${index}`}
            >
              {groupOrBlock.items?.map((item: BlockNoteNode) => (
                <div key={item.id} className="flex flex-row items-start gap-3">
                  <input
                    type="checkbox"
                    checked={item.props?.checked === true}
                    readOnly
                    className="text-primary focus:ring-primary mt-1 h-4 w-4 shrink-0 rounded border-gray-300"
                  />
                  <div
                    className={`flex-1 ${item.props?.checked === true ? 'line-through' : ''}`}
                  >
                    <RenderInline content={item.content} />
                    {item.children && item.children.length > 0 && (
                      <CustomRenderer blocks={item.children} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }

        const block = groupOrBlock
        const { id, type, props, content, children } = block
        const renderChildren =
          children && children.length > 0 ? (
            <CustomRenderer blocks={children} />
          ) : null

        switch (type) {
          case 'paragraph':
            return (
              <p key={id}>
                {content && content.length > 0 ? (
                  <RenderInline content={content} />
                ) : (
                  <br />
                )}
                {renderChildren}
              </p>
            )
          case 'quote':
          case 'blockQuote':
            return (
              <blockquote
                key={id}
                className="border-primary/50 bg-muted/30 text-foreground my-6 rounded-r-lg border-l-4 px-6 py-4 italic"
              >
                <RenderInline content={content} />
                {renderChildren}
              </blockquote>
            )
          case 'heading': {
            const level =
              typeof props?.level === 'number'
                ? Math.min(Math.max(props.level, 1), 6)
                : 1
            let className = ''
            if (level === 1) className = 'text-4xl mt-8 mb-5 font-bold'
            if (level === 2) className = 'text-3xl mt-6 mb-4 font-bold'
            if (level === 3) className = 'text-2xl mt-5 mb-3 font-bold'
            if (level === 4) className = 'text-xl mt-4 mb-2 font-bold'
            if (level === 5) className = 'text-lg mt-3 mb-2 font-semibold'
            if (level === 6) className = 'text-base mt-3 mb-2 font-semibold'
            const HeadingTag = `h${level}` as
              | 'h1'
              | 'h2'
              | 'h3'
              | 'h4'
              | 'h5'
              | 'h6'

            // Server-side generation of heading ID to avoid layout shifts in TableOfContents
            const textContent = content?.map((c) => c.text || '').join('') || ''
            const htmlId =
              id ||
              `heading-${index}-${textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

            return (
              <HeadingTag className={className} key={id} id={htmlId}>
                <RenderInline content={content} />
                {renderChildren}
              </HeadingTag>
            )
          }
          case 'toggle':
          case 'toggleListItem':
            return (
              <details key={id} className="group my-4">
                <summary className="flex cursor-pointer list-none items-start gap-2 font-medium [&::-webkit-details-marker]:hidden">
                  <span className="text-muted-foreground mt-1.5 text-xs transition-transform group-open:rotate-90">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                  <div className="flex-1">
                    <RenderInline content={content} />
                  </div>
                </summary>
                <div className="mt-2 space-y-2 pl-6">{renderChildren}</div>
              </details>
            )
          case 'image': {
            const align = props?.textAlignment || 'center'
            const alignClass =
              align === 'left'
                ? 'items-start'
                : align === 'right'
                  ? 'items-end'
                  : 'items-center'
            const widthObj = props?.previewWidth
              ? { width: `${props.previewWidth}px`, maxWidth: '100%' }
              : { width: '100%' }

            return (
              <figure key={id} className={`my-5 flex flex-col ${alignClass}`}>
                <div style={widthObj} className="relative flex flex-col">
                  {props?.url && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={props?.url}
                        alt={props?.caption || props?.alt || ''}
                        className="w-full overflow-hidden object-cover"
                      />
                    </>
                  )}
                  {(props?.caption || props?.alt) && (
                    <figcaption className="bg-secondary/50 text-muted-foreground mt-2 w-full rounded-lg p-2 text-center text-sm">
                      {props.caption || props.alt}
                    </figcaption>
                  )}
                </div>
                {renderChildren}
              </figure>
            )
          }
          default:
            return (
              <div key={id}>
                {content && <RenderInline content={content} />}
                {renderChildren}
              </div>
            )
        }
      })}
    </>
  )
}
