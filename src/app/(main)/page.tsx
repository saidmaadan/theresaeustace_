import { Suspense } from "react"
import Hero from '@/components/sections/HeroSection'
import BookListing from '@/components/sections/BookListing2'
import BlogSection from '@/components/sections/BlogListing2'

import CTA from '@/components/sections/CTA'
import {Newsletter as NewsLetterForm } from "@/components/home/newsletter"
import { prisma } from "@/lib/prisma"


async function getFeaturedBooks() {
  const books = await prisma.book.findMany({
    where: {
      // isFeatured: true,
      isPublished: true,
    },
    include: {
      category: true,
    },
    take: 4,
  })
  return books
}

async function getLatestBlogs() {
  const blogs = await prisma.blog.findMany({
    where: {
      isPublished: true,
    },
    include: {
      category: true,
      
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 3,
  })
  return blogs
}
export default async function MainPage() {
  
  const [featuredBooks, latestBlogs] = await Promise.all([
    getFeaturedBooks(),
    getLatestBlogs(),
  ])
  return (
    <main className="min-h-screen bg-background">
      
      <Hero />
      <Suspense fallback={<div>Loading books...</div>}>
        <BookListing books={featuredBooks}/>
      </Suspense>
      <CTA />
      <Suspense fallback={<div>Loading blogs...</div>}>
        <BlogSection blogs={latestBlogs} />
      </Suspense>
      <NewsLetterForm />
    </main>
  )
}
