"use client"

import { motion } from "framer-motion"
import { BookCard } from "@/components/books/book-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BookListingProps {
  title?: string
  books: any[]
  showViewAll?: boolean
}

export function BookListing({
  title = "Featured Books",
  books,
  showViewAll = true,
}: BookListingProps) {
  return (
    <section className="py-12">
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
                <Link href="/books">View All Books →</Link>
              </Button>
            </motion.div>
          )}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BookCard book={book} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
