"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { SafeHTML } from "@/components/ui/safe-html"
import { DownloadButton } from "@/components/dashboard/download-button"
import { Download, Crown } from "lucide-react"

interface BookCardProps {
  book: {
    id: string
    title: string
    slug: string
    bookFile: string
    description?: string | null
    price?: number | null
    amazonLink?: string | null
    coverImage?: string | null
    isFree: boolean
    isPremium: boolean
    isFeatured: boolean
    category: {
      name: string
    }
  }
  layout?: "grid" | "list"
}

export function BookCard({ book, layout = "grid" }: BookCardProps) {
  const isGridLayout = layout === "grid"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={isGridLayout ? "h-full" : "w-full"}
    >
      <Card className={`h-full overflow-hidden ${!isGridLayout && "flex"}`}>
        <div className={!isGridLayout ? "w-[300px] flex-shrink-0" : ""}>
          <div className="relative aspect-video w-full">
            <Image
              src={book.coverImage || "/images/book-placeholder.jpg"}
              alt={book.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
            {/* {book.isFeatured && (
              <Badge className="absolute right-2 top-2" variant="secondary">
                Featured
              </Badge>
            )} */}
          </div>
        </div>
        <div className={!isGridLayout ? "flex flex-1 flex-col" : ""}>
          <CardHeader>
            <div className="space-y-1">
              <Badge variant="outline">{book.category.name}</Badge>
              <Link href={`/books/${book.slug}`} className="hover:underline">
                <h3 className="line-clamp-2 text-lg font-semibold">{book.title}</h3>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <SafeHTML
              html={book.description || ""}
              truncate={200}
              as="p"
              className="line-clamp-3 text-sm text-muted-foreground"
            />
          </CardContent>
          <CardFooter className="mt-auto flex items-center justify-between flex-wrap">
            <div className="flex items-center space-x-2">
              
              {book.bookFile && book.isFree ? (
                <DownloadButton 
                fileUrl={book.bookFile}
                fileName={book.title}
                title="Free Download"
              />
              ) : book.isPremium ? (
                  <Link href={"/dashboard"}>
                    <Button >
                      <Download className="mr-2 h-4 w-4" /> 
                      Premium
                      <Crown className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                
              ) : book.amazonLink ? (
                <Button asChild >
                  <a href={book.amazonLink} target="_blank" rel="noopener noreferrer">
                    Buy on Amazon
                  </a>
                </Button>
              ) : null}
          
            </div>
            <Button variant="outline">
                <Link href={`/books/${book.slug}`}>Read Now</Link>
              </Button>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  )
}
