"use client";

import { Plus } from "lucide-react";
import { BlogCategoryDialog } from "./blog-category-dialog";
import { useRouter } from "next/navigation";
import { BlogCategory } from "@prisma/client";

interface BlogCategoryHeaderProps {
  onSuccess: (category: BlogCategory & { _count?: { blogs: number } }) => void;
}

export function BlogCategoryHeader({ onSuccess }: BlogCategoryHeaderProps) {
  const router = useRouter();

  const handleSuccess = (category: BlogCategory & { _count?: { blogs: number } }) => {
    onSuccess(category);
    router.refresh();
  };

  return (
    <BlogCategoryDialog onSuccess={handleSuccess}>
      <Plus className="mr-2 h-4 w-4" />
      Add Blog Category
    </BlogCategoryDialog>
  );
}
