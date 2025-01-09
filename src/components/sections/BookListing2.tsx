'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const books = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', cover: '/placeholder.svg?height=400&width=300' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', cover: '/placeholder.svg?height=400&width=300' },
  { id: 3, title: '1984', author: 'George Orwell', cover: '/placeholder.svg?height=400&width=300' },
  { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', cover: '/placeholder.svg?height=400&width=300' },
]

export default function BookListing() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Books</h2>
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
                    src={book.cover}
                    alt={book.title}
                    width={300}
                    height={400}
                    className="w-full h-64 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
                  <p className="text-muted-foreground">{book.author}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">View Details</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

