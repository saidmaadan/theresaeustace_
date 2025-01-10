import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { BookList } from "@/components/admin/books/book-list";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import Link from "next/link";

const ITEMS_PER_PAGE = 9;

// This ensures the page is always dynamic
export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBooks(page: number = 1, limit: number = ITEMS_PER_PAGE) {
  'use server';
  
  try {
    const skip = (page - 1) * limit;
    
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        include: {
          category: true,
          _count: {
            select: {
              comments: true,
              users: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.book.count(),
    ]);

    return {
      books,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("[BOOKS_GET]", error);
    throw new Error("Failed to fetch books");
  }
}

async function getCategories() {
  'use server';
  return prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function BooksPage(props: PageProps) {
  const searchParams = await props.searchParams;
  // Await searchParams before using it
  const searchParamsObj = await Promise.resolve(searchParams);
  const currentPage = Number(searchParamsObj.page) || 1;
  const limit = Number(searchParamsObj.limit) || ITEMS_PER_PAGE;

  const [{ books, total, totalPages }, categories] = await Promise.all([
    getBooks(currentPage, limit),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Books</h2>
          <p className="text-muted-foreground">
            Manage your bookstore inventory and details
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/books/new" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Book
          </Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        {books.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No books found"
            description="Get started by creating your first book."
            action={
              <Button asChild>
                <Link href="/admin/books/new" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Book
                </Link>
              </Button>
            }
          />
        ) : (
          <BookList 
            books={books} 
            categories={categories}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
          />
        )}
      </Suspense>
    </div>
  );
}
