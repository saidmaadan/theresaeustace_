import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlogCategoriesContainer } from "@/components/admin/blog-categories/blog-categories-container";

export const metadata: Metadata = {
  title: "Blog Categories | Admin Dashboard",
  description: "Manage your blog categories",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getBlogCategories() {
  const categories = await prisma.blogCategory.findMany({
    include: {
      _count: {
        select: { blogs: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories;
}

export default async function BlogCategoriesPage() {
  const categories = await getBlogCategories();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogCategoriesContainer initialCategories={categories} />
    </Suspense>
  );
}
