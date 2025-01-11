import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

interface Book {
  id: string
  title: string
  descriptiont: string
  coverImage: string | null
  slug: string
  amazonLink: string
  bookFile: string 
  isPublished: boolean
  isFree: boolean
  isPremium: boolean
  createdAt: Date | null
  category: {
    name: string
  } | null
  
}

interface SimilarBooksProps {
  currentBookId: string
  categoryId: string | null
}

async function getSimilarBooks(currentBookId: string, categoryId: string | null) {
  if (categoryId) {
    // First try to get Books from the same category
    const similarBooks = await prisma.book.findMany({
      where: {
        isPublished: true,
        categoryId,
        NOT: {
          id: currentBookId,
        },
      },
      include: {
        category: true,
        
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 2,
    })

    if (similarBooks.length > 0) {
      return similarBooks
    }
  }

  // If no Books in the same category, get latest Books
  return await prisma.book.findMany({
    where: {
      isPublished: true,
      NOT: {
        id: currentBookId,
      },
    },
    include: {
      category: true,
      
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
  })
}

export async function SimilarBooks({ currentBookId, categoryId }: SimilarBooksProps) {
  const books = await getSimilarBooks(currentBookId, categoryId)

  if (books.length === 0) {
    return null
  }

  return (
    <aside className="space-y-8">
      <h2 className="text-2xl font-bold">
        {categoryId && 'Similar Books'}
        {!categoryId && 'Latest Books'}
      </h2>
      <div className="space-y-4">
        {books.map((book) => (
          <Link key={book.id} href={`/book/${book.slug}`}>
            <Card className="overflow-hidden hover:bg-muted/50 transition-colors">
              {book.coverImage && (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader className="space-y-2">
                {book.category && (
                  <Badge variant="outline" className="w-fit capitalize">
                    {book.category.name}
                  </Badge>
                )}
                <h3 className="font-semibold line-clamp-2">{book.title}</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  
                  {book.createdAt && (
                    <time dateTime={book.createdAt.toISOString()}>
                      {formatDate(book.createdAt)}
                    </time>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </aside>
  )
}
