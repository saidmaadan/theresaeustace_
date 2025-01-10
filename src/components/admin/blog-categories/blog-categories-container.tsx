"use client";

import { useState } from "react";
import { BlogCategory } from "@prisma/client";
import { BlogCategoryList } from "./blog-category-list";
import { BlogCategoryHeader } from "./blog-category-header";
import { Heading } from "@/components/shared/heading";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderIcon } from "lucide-react";

interface BlogCategoriesContainerProps {
  initialCategories: (BlogCategory & {
    _count: {
      blogs: number;
    };
  })[];
}

export function BlogCategoriesContainer({ initialCategories }: BlogCategoriesContainerProps) {
  const [categories, setCategories] = useState(initialCategories);

  const onCategoryChange = (category: BlogCategory & { _count?: { blogs: number } }) => {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === category.id);
      if (index !== -1) {
        // Update existing category
        const updated = [...prev];
        updated[index] = {
          ...category,
          _count: category._count || prev[index]._count,
        };
        return updated;
      } else {
        // Add new category
        return [...prev, { ...category, _count: { blogs: 0 } }];
      }
    });
  };

  const onCategoryDelete = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Blog Categories"
        description="Manage your blog categories"
        icon={FolderIcon}
        actions={<BlogCategoryHeader onSuccess={onCategoryChange} />}
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderIcon}
          title="No blog categories"
          description="Get started by creating your first blog category."
        />
      ) : (
        <BlogCategoryList 
          categories={categories} 
          onSuccess={onCategoryChange}
          onDelete={onCategoryDelete}
        />
      )}
    </div>
  );
}
