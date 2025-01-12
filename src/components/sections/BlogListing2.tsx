'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { SafeHTML } from "@/components/ui/safe-html"


// const blogPosts = [
//   { id: 1, title: 'Top 10 Summer Reads', excerpt: 'Discover the best books to enjoy this summer...', image: '/placeholder.svg?height=200&width=400' },
//   { id: 2, title: 'Interview with Bestselling Author', excerpt: 'We sat down with the acclaimed writer to discuss...', image: '/placeholder.svg?height=200&width=400' },
//   { id: 3, title: 'The Rise of Indie Publishing', excerpt: 'How self-publishing is changing the literary landscape...', image: '/placeholder.svg?height=200&width=400' },
// ]
interface BlogPost {
    id: string
    title: string
    slug: string
    content?: string | null
    featuredImage?: string | null
    isPremium: boolean
    createdAt: Date
    category: {
      name: string
    }
}

interface BlogListingProps {
  title?: string;
  blogs: BlogPost[];
  showViewAll?: boolean;
}

export default function BlogSection({
  title = "Latest from Our Blog",
  blogs,
  showViewAll = true,
}: BlogListingProps) {
  return (
    <section className="py-16 bg-accent">
      <div className="container-center">
      <div className="flex items-center justify-between">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {title}
          </motion.h2>
          {showViewAll && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button variant="ghost" asChild>
                <Link href="/blog">View All Posts →</Link>
              </Button>
            </motion.div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          {blogs?.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    width={200}
                    height={300}
                    className="w-full h-48 object-cover transition-transform hover:scale-105 rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <SafeHTML
                    html={post.content || ""}
                    truncate={120}
                    as="p"
                    className="line-clamp-2 text-sm text-muted-foreground"
                  />
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Read More</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
