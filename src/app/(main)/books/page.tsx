import { Suspense } from "react"
import { prisma } from "@/lib/prisma"
import { BooksList } from "@/components/main/books/books-list"

interface BooksPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

async function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  })
}

async function getBooks(searchParams: BooksPageProps["searchParams"]) {
  try {
    // Await the entire searchParams object first
    const params = await searchParams;
    
    const page = Number(params.page) || 1;
    const perPage = 8;
    const skip = (page - 1) * perPage;

    const where = {
      isPublished: true,
      ...(params.category
        ? { categoryId: params.category.toString() }
        : {}),
      ...((() => {
        const filter = params.filter?.toString()
        switch (filter) {
          case "free":
            return { isFree: true }
          case "premium":
            return { isPremium: true }
          default:
            return {}
        }
      })()),
    }

    const [books, categories, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: perPage,
        orderBy: (() => {
          const sort = params.sort?.toString() || "latest"
          switch (sort) {
            case "title-asc":
              return { title: "asc" }
            case "title-desc":
              return { title: "desc" }
            case "oldest":
              return { createdAt: "asc" }
            default:
              return { createdAt: "desc" }
          }
        })(),
      }),
      prisma.category.findMany({
        where: {
          books: {
            some: {
              isPublished: true,
            },
          },
        },
      }),
      prisma.book.count({ where }),
    ])

    const totalPages = Math.ceil(total / perPage)

    return {
      books,
      categories,
      totalPages,
    }
  } catch (error) {
    console.error("Error fetching books:", error)
    throw new Error("Failed to fetch books")
  }
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  // Await searchParams before passing it to getBlogs
  const params = await searchParams;
  
  const [{ books, totalPages }, categories] = await Promise.all([
    getBooks(params),
    getCategories(),
  ])

  return (
    <section className="w-full inset-0 dark:bg-gradient-to-r from-transparent via-purple-950/60 to-purple-950/70 z-10">
      
      <div className="container-center space-y-8 py-8 mt-20">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Books</h1>
        <p className="text-muted-foreground">
          Browse through our collection of books. Use the filters to find exactly what you&apos;re looking for.
        </p>
      </div>
      <Suspense fallback={<div>Loading books...</div>}>
        <BooksList
          books={books}
          categories={categories}
          totalPages={totalPages}
          searchParams={params}
        />
      </Suspense>
      </div>
    </section>
  )
}
