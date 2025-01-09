import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import DOMPurify from "isomorphic-dompurify"
import { Variants } from "framer-motion"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function truncateText(text: string, maxWords: number = 120): string {
  if (!text) return ""
  const words = text.split(" ")
  if (words.length <= maxWords) return text
  return words.slice(0, maxWords).join(" ") + "..."
}

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [
      "p", "br", "b", "i", "em", "strong", "u", "h1", "h2", "h3",
      "h4", "h5", "h6", "ul", "ol", "li", "blockquote", "a"
    ],
    ALLOWED_ATTR: ["href", "target", "rel"]
  })
}

export function formatPrice(price: number | string): string {
  const numericPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(numericPrice);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(d);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '')          // Trim - from end of text
}

export function getPublicUrl(path: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}${path}`
}

export const fadeIn = (direction: 'up' | 'down' | 'left' | 'right'): Variants => {
  return {
    initial: {
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
      opacity: 0,
    },
    animate: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }
}

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

export const textVariant: Variants = {
  initial: {
    y: 50,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export const slideIn = (direction: 'up' | 'down' | 'left' | 'right'): Variants => {
  return {
    initial: {
      y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
      x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
      opacity: 0,
    },
    animate: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  }
}

export const scaleVariant: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}
