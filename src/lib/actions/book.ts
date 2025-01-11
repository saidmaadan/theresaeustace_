import { prisma } from "@/lib/prisma"
import { cache } from "react"

// Cache the books query for 1 minute
export const getBooks = cache(async () => {
  try {
    const books = await prisma.book.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        bookFile: true,
        amazonLink: true,
        isPremium: true,
        isFree: true,
        createdAt: true,
      },
    })

    return books
  } catch (error) {
    console.error("Error fetching books:", error instanceof Error ? error.message : "Unknown error")
    return []
  }
})

export async function getUserBooks(userId: string) {
  if (!userId) {
    console.error("No user ID provided")
    return []
  }

  try {
    const books = await prisma.book.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        bookFile: true,
        amazonLink: true,
        isPremium: true,
        isFree: true,
        createdAt: true,
      },
    })

    return books
  } catch (error) {
    console.error("Error fetching user books:", error instanceof Error ? error.message : "Unknown error")
    return []
  }
}
