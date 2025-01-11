"use client"

import { sanitizeHTML, truncateText } from "@/lib/utils"

interface SafeHTMLProps {
  html: string
  truncate?: number
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export function SafeHTML({ 
  html, 
  truncate, 
  className = "", 
  as: Component = "div" 
}: SafeHTMLProps) {
  const processedHTML = truncate ? truncateText(html, truncate) : html
  const sanitizedHTML = sanitizeHTML(processedHTML)

  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  )
}
