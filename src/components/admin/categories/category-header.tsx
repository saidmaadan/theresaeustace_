"use client";

import { Plus } from "lucide-react";
import { CategoryDialog } from "./category-dialog";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";

interface CategoryHeaderProps {
  onSuccess: (category: Category & { _count?: { books: number } }) => void;
}

export function CategoryHeader({ onSuccess }: CategoryHeaderProps) {
  const router = useRouter();

  const handleSuccess = (category: Category & { _count?: { books: number } }) => {
    onSuccess(category);
    router.refresh();
  };

  return (
    <CategoryDialog onSuccess={handleSuccess}>
      <Plus className="mr-2 h-4 w-4" />
      Add Category
    </CategoryDialog>
  );
}
