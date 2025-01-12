'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { SafeHTML } from "@/components/ui/safe-html"


 
// const books = [
//   { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: '/placeholder.svg?height=400&width=300' },
//   { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: '/placeholder.svg?height=400&width=300' },
//   { id: 3, title: '1984', author: 'George Orwell', cover: '/placeholder.svg?height=400&width=300' },
//   { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', cover: '/placeholder.svg?height=400&width=300' },
// ]

interface BookCard {
  
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

interface BookListingProps {
  title?: string
  books: BookCard[]
  showViewAll?: boolean
}


export default function BookListing({
  title = "Featured Books",
  books,
  showViewAll = true,
}: BookListingProps) {
  return (
    <section className="py-16 bg-muted">
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
                <Link href="/books">View All Books →</Link>
              </Button>
            </motion.div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{book.title}</h3>
                  
                </CardContent>
                <CardFooter className="mt-auto flex items-center justify-between flex-wrap">
                    <Button className="mt-2">
                      <Link href={book.amazonLink} target="_blank" rel="noopener noreferrer">
                        Buy on Amazon
                      </Link>
                    </Button>
                    <Button variant="outline" className="mt-2">
                      <Link href={`/books/${book.slug}`}>View Details</Link>
                    </Button>
                  
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

