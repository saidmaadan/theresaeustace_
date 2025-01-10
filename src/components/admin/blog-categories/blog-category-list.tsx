"use client";

import { BlogCategory } from "@prisma/client";
import { DataTable } from "@/components/shared/data-table";
import { BlogCategoryDialog } from "./blog-category-dialog";
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

interface BlogCategoryListProps {
  categories: (BlogCategory & {
    _count: {
      blogs: number;
    };
  })[];
  onSuccess: (category: BlogCategory & { _count?: { blogs: number } }) => void;
  onDelete: (id: string) => void;
}

export function BlogCategoryList({ categories, onSuccess, onDelete }: BlogCategoryListProps) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blog-categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete blog category");
      }

      onDelete(id);
      toast.success(data.message || "Blog category deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete blog category");
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
      accessorKey: "_count.blogs",
      header: "Blogs",
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
              <BlogCategoryDialog category={category} onSuccess={onSuccess}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </BlogCategoryDialog>
              <ConfirmModal
                title="Delete Blog Category"
                description="Are you sure you want to delete this blog category? This action cannot be undone."
                onConfirm={() => handleDelete(category.id)}
              >
                <DropdownMenuItem 
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive"
                  disabled={category._count?.blogs > 0}
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
