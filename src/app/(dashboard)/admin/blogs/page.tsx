import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Heading } from "@/components/shared/heading";
import { EmptyState } from "@/components/shared/empty-state";
import { BlogList } from "@/components/admin/blogs/blog-list";
import { BlogDialog } from "@/components/admin/blogs/blog-dialog";
import { FileTextIcon, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Blogs | Admin Dashboard",
  description: "Manage your blog posts",
};

async function getBlogs() {
  const blogs = await prisma.blog.findMany({
    include: {
      category: true,
      
      
    },
    orderBy: { createdAt: "desc" },
  });

  return blogs;
}

async function getBlogCategories() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  });

  return categories;
}

export default async function BlogsPage() {
  const [blogs, categories] = await Promise.all([
    getBlogs(),
    getBlogCategories(),
  ]);

  return (
    <div className="space-y-6">

      <Suspense fallback={<div>Loading...</div>}>
        {blogs.length === 0 ? (
          <div>
            <BlogList blogs={blogs} categories={categories} />
            <EmptyState
              icon={FileTextIcon}
              title="No blog posts"
              description="Get started by creating your first blog post."
            />
          </div>
        ) : (
          <BlogList blogs={blogs} categories={categories} />
        )}
      </Suspense>
    </div>
  );
}
