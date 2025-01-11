"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { SafeHTML } from "@/components/ui/safe-html"

interface BlogCardProps {
  blog: {
    id: string
    title: string
    slug: string
    content?: string | null
    featuredImage?: string | null
    createdAt: Date
    category: {
      name: string
    }
    
  }
  layout?: "grid" | "list"
}

export function BlogCard({ blog, layout = "grid" }: BlogCardProps) {
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
              src={blog.featuredImage || "/images/blog-placeholder.jpg"}
              alt={blog.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          </div>
        </div>
        <div className={!isGridLayout ? "flex flex-1 flex-col" : ""}>
          <CardHeader>
            <div className="space-y-2">
              <Badge variant="outline">{blog.category.name}</Badge>
              <Link href={`/blog/${blog.slug}`} className="hover:underline">
                <h3 className="line-clamp-2 text-xl font-semibold leading-tight">
                  {blog.title}
                </h3>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <SafeHTML
              html={blog.content || ""}
              truncate={120}
              as="p"
              className="line-clamp-2 text-sm text-muted-foreground"
            />
          </CardContent>
          <CardFooter className="mt-auto">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center space-x-2">
                
                <div>
                  
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Link
                href={`/blog/${blog.slug}`}
                className="text-sm font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  )
}
