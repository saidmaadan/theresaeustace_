"use client";

import { Category } from "@prisma/client";
import { DataTable } from "@/components/shared/data-table";
import { CategoryDialog } from "./category-dialog";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

interface CategoryListProps {
  categories: (Category & {
    _count: {
      books: number;
    };
  })[];
  onSuccess: (category: Category & { _count?: { books: number } }) => void;
  onDelete: (id: string) => void;
}

export function CategoryList({ categories, onSuccess, onDelete }: CategoryListProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      onDelete(id);
      toast.success("Category deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "_count.books",
      header: "Books",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <CategoryDialog category={category} onSuccess={onSuccess}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </CategoryDialog>
              <ConfirmModal
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
                onConfirm={() => handleDelete(category.id)}
              >
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive"
                  disabled={category._count?.books > 0}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </ConfirmModal>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return <DataTable columns={columns} data={categories} />;
}
