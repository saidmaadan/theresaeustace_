"use client"

import { motion } from "framer-motion"
import { BlogCard } from "@/components/blog/blog-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BlogListingProps {
  title?: string
  blogs: any[]
  showViewAll?: boolean
}

export function BlogListing({
  title = "Latest Blog Posts",
  blogs,
  showViewAll = true,
}: BlogListingProps) {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container px-4 md:px-6">
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
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
