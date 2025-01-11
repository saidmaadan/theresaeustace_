'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const blogPosts = [
  { id: 1, title: 'Top 10 Summer Reads', excerpt: 'Discover the best books to enjoy this summer...', image: '/placeholder.svg?height=200&width=400' },
  { id: 2, title: 'Interview with Bestselling Author', excerpt: 'We sat down with the acclaimed writer to discuss...', image: '/placeholder.svg?height=200&width=400' },
  { id: 3, title: 'The Rise of Indie Publishing', excerpt: 'How self-publishing is changing the literary landscape...', image: '/placeholder.svg?height=200&width=400' },
]

export default function BlogSection() {
  return (
    <section className="py-16">
      <div className="container-center">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest from Our Blog</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
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

