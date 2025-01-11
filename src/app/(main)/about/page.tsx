import { Suspense } from "react"
import { AboutHero } from "@/components/main/about/about-hero"
import BookCarousel from "@/components/main/about/book-carouseel"
import { AboutHeadline } from "@/components/main/about/about-headline"
import { prisma } from "@/lib/prisma"

async function getFeaturedBooks() {
  const books = await prisma.book.findMany({
    // where: {
    //   isFeatured: true,
    //   isPublished: true,
    // },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
  return books
}

export default async function AboutPage() {
  const featuredBooks = await getFeaturedBooks()

  return (
    <div className="container-center flex flex-col">
      <AboutHero />
      <AboutHeadline />
      <Suspense fallback={<div>Loading featured books...</div>}>
        {/* <FeaturedBooks books={featuredBooks} /> */}
        <div className="">
          <BookCarousel 
            books={featuredBooks}
            showFeatured={false} // Show only featured books
            showPublished={true} // Don't filter by published status
            title="Featured Books" // Custom title
            displayCount={14} // Will only show 5 books
          />
          </div>
      </Suspense>
    </div>
  )
}
