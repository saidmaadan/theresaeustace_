"use client";

import { useState, useEffect } from "react";
import { Book, Category } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";
import { DataTable } from "@/components/shared/data-table";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { Heading } from "@/components/shared/heading";

import { Edit, Trash, BookOpen, Users, MessageSquare, Plus, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookListLoading } from "./book-list-loading";
const ITEMS_PER_PAGE = 9;

interface BookListProps {
  books: (Book & {
    category: Category;
    _count: {
      comments: number;
      users: number;
    };
  })[];
  categories: Category[];
  currentPage: number;
  totalPages: number;
  total: number;
}

export function BookList({ 
  books: initialBooks, 
  categories,
  currentPage,
  totalPages,
  total,
}: BookListProps) {
  const [books, setBooks] = useState(initialBooks);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setBooks(initialBooks);
  }, [initialBooks]);

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setBooks((prev) => prev.filter((book) => book.id !== id));
      toast.success("Book post deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete book post"
      );
    }
  };
  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      const url = pathname + "?" + createQueryString("page", page.toString());
      await router.push(url, { scroll: false });
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageSizeChange = async (size: string) => {
    try {
      setIsLoading(true);
      const url = pathname + "?" + createQueryString("limit", size);
      await router.push(url, { scroll: false });
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading
          title="Books"
          description="Manage books for your store"
          icon={BookOpen}
        />
        
        <Link href="/admin/books/new">
          <Button variant="primary" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add New Book
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <BookListLoading />
        ) : (
          <AnimatePresence mode="popLayout">
            {Array.isArray(books) && books.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted">
                    {book.coverImage ? (
                      <Image
                        src={book.coverImage}
                        alt={book.title}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">{book.title}</h3>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-white/10 hover:bg-white/20">
                          {book.category.name}
                        </Badge>
                        {book.isPublished && (
                          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                            Published
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {book._count.users}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            {book._count.comments}
                          </div>
                        </div>
                        <p className="font-semibold">{formatPrice(book.price)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          asChild
                        >
                          <Link href={`/admin/books/edit?id=${book.id}`}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <ConfirmModal
                          onConfirm={() => onDelete(book.id)}
                          title="Delete Book"
                          description="Are you sure you want to delete this book? This action cannot be undone."
                        >
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-2"
                            disabled={isDeleting === book.id}
                          >
                            {isDeleting === book.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash className="h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </ConfirmModal>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, total)} of {total} books
            </span>
            <Select
              value={ITEMS_PER_PAGE.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9">9 per page</SelectItem>
                <SelectItem value="18">18 per page</SelectItem>
                <SelectItem value="27">27 per page</SelectItem>
                <SelectItem value="36">36 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else {
                  if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                }
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    disabled={isLoading}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
