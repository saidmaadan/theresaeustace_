import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CategoriesContainer } from "@/components/admin/categories/categories-container";

export const metadata: Metadata = {
  title: "Categories | Admin Dashboard",
  description: "Manage your book categories",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { books: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesContainer initialCategories={categories} />
    </Suspense>
  );
}
