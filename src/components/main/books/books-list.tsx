"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookCard } from "@/components/main/books/book-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Grid2X2, List } from "lucide-react"
import { cn } from "@/lib/utils"

interface BooksListProps {
  books: any[]
  categories: any[]
  totalPages: number
  searchParams: {
    page?: string
    per_page?: string
    sort?: string
    category?: string
    view?: "grid" | "list"
    filter?: string
  }
}

export function BooksList({
  books,
  categories,
  totalPages,
  searchParams,
}: BooksListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [view, setView] = useState<"grid" | "list">(
    searchParams.view || "grid"
  )

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams as any)

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams]
  )

  // #Update the URL when filters change
  // function onFilterChange(value: string, type: string) {
  //   startTransition(() => {
  //     router.push(
  //       `/books?${createQueryString({
  //         [type]: value,
  //         page: 1, // Reset to first page
  //       })}`,
  //       { scroll: false }
  //     )
  //   })
  // }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex gap-4 items-center flex-wrap ">
        <div className="flex items-center gap-2">
          <Select
            value={searchParams?.category?.toString() || "all"}
            onValueChange={(value) => {
              startTransition(() => {
                router.push(
                  `/books?${createQueryString({ 
                    category: value === "all" ? "" : value,
                    page: "1"
                  })}`,
                  { scroll: false }
                )
              })
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={searchParams?.filter?.toString() || "all"}
            onValueChange={(value) => {
              startTransition(() => {
                router.push(
                  `/books?${createQueryString({ filter: value })}`,
                  { scroll: false }
                )
              })
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="free">Free Books</SelectItem>
              <SelectItem value="premium">Premium Books</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={searchParams?.sort?.toString() || "latest"}
            onValueChange={(value) => {
              startTransition(() => {
                router.push(
                  `/books?${createQueryString({ sort: value })}`,
                  { scroll: false }
                )
              })
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          <Tabs
            value={view}
            onValueChange={(value: "grid" | "list") => {
              setView(value)
              startTransition(() => {
                router.push(
                  `/books?${createQueryString({ view: value })}`,
                  { scroll: false }
                )
              })
            }}
          >
            <TabsList className="grid w-20 grid-cols-2">
              <TabsTrigger value="grid">
                <Grid2X2 className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-6",
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        )}
      >
        {books.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <BookCard book={book} layout={view} />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => {
            const page = i + 1
            const isCurrentPage = page === Number(searchParams.page || 1)

            return (
              <Button
                key={page}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      `/books?${createQueryString({ page })}`,
                      { scroll: false }
                    )
                  })
                }}
                disabled={isPending}
              >
                {page}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}
