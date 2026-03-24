'use client'

import { useEffect, useState } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Wait for BlockNote to render
    const timeoutId = setTimeout(() => {
      const elements = Array.from(
        document.querySelectorAll('.prose h1, .prose h2, .prose h3')
      )

      const newHeadings = elements.map((elem, index) => {
        let id = elem.id
        if (!id) {
          id = `heading-${index}-${elem.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
          elem.id = id
        }

        return {
          id,
          text: elem.textContent || '',
          level: Number(elem.tagName.substring(1)),
        }
      })

      setHeadings(newHeadings)

      if (newHeadings.length > 0) {
        setActiveId(newHeadings[0].id)
      }
    }, 800)

    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting)
        if (visibleEntries.length > 0) {
          visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )
          setActiveId(visibleEntries[0].target.id)
        }
      },
      { rootMargin: '-15% 0% -80% 0%' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <div className="pr-4 pb-8">
      {headings.length > 0 && (
        <nav>
          <h4 className="text-muted-foreground mb-4 text-sm">
            Table of contents
          </h4>
          <ul className="border-border/50 relative border-l-2">
            {headings.map((heading) => {
              const isActive = activeId === heading.id
              return (
                <li key={heading.id} className="relative">
                  {/* Indicator Line */}
                  {isActive && (
                    <div className="bg-primary absolute top-0 bottom-0 -left-[2px] w-[2px] rounded-r-full transition-all duration-300" />
                  )}
                  <button
                    onClick={() => {
                      const el = document.getElementById(heading.id)
                      if (el) {
                        const y =
                          el.getBoundingClientRect().top + window.scrollY - 100
                        window.scrollTo({ top: y, behavior: 'smooth' })
                      }
                      setActiveId(heading.id)
                    }}
                    className={`hover:text-foreground block w-full py-2.5 pr-2 text-left text-sm transition-colors ${
                      isActive
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground'
                    } ${heading.level === 3 ? 'pl-8' : 'pl-4'}`}
                  >
                    <span className="line-clamp-2">{heading.text}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}
