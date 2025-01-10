'use server';

import { prisma } from "@/lib/prisma";
import { BookForm } from "@/components/admin/books/book-forms";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    action: string;
  }>;
  searchParams: Promise<{
    id?: string;
  }>;
}

async function getBook(id: string) {
  const book = await prisma.book.findUnique({
    where: { id },
  });
  return book;
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories;
}

export default async function BookActionPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { action } = params;
  const { id } = searchParams;

  if (action !== "new" && action !== "edit") {
    return notFound();
  }

  const [categories, book] = await Promise.all([
    getCategories(),
    id ? getBook(id) : null,
  ]);

  if (action === "edit" && !book) {
    return notFound();
  }

  return (
    <div className="container-center max-w-5xl ">
      <BookForm 
        book={book || undefined} 
        categories={categories} 
      />
    </div>
  );
}
