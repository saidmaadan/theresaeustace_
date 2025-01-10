"use client";

import { useState } from "react";
import { Category } from "@prisma/client";
import { CategoryList } from "./category-list";
import { CategoryHeader } from "./category-header";
import { Heading } from "@/components/shared/heading";
import { EmptyState } from "@/components/shared/empty-state";
import { FolderIcon } from "lucide-react";

interface CategoriesContainerProps {
  initialCategories: (Category & {
    _count: {
      books: number;
    };
  })[];
}

export function CategoriesContainer({ initialCategories }: CategoriesContainerProps) {
  const [categories, setCategories] = useState(initialCategories);

  const onCategoryChange = (category: Category & { _count?: { books: number } }) => {
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
        return [...prev, { ...category, _count: { books: 0 } }];
      }
    });
  };

  const onCategoryDelete = (id: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== id));
  };

  return (
    <div className="space-y-6">
      <Heading
        title="Categories"
        description="Manage your book categories"
        icon={FolderIcon}
        actions={<CategoryHeader onSuccess={onCategoryChange} />}
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderIcon}
          title="No categories"
          description="Get started by creating your first category."
        />
      ) : (
        <CategoryList 
          categories={categories} 
          onSuccess={onCategoryChange}
          onDelete={onCategoryDelete}
        />
      )}
    </div>
  );
}
