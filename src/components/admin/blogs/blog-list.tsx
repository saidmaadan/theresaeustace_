"use client";

import { useState } from "react";
import { Blog, BlogCategory } from "@prisma/client";
import { DataTable } from "@/components/shared/data-table";
import { BlogDialog } from "./blog-dialog";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";
import { Heading } from "@/components/shared/heading"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash, Plus, FileTextIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface BlogListProps {
  blogs: (Blog & {
    category: BlogCategory;
    
    
  })[];
  categories: BlogCategory[];
}

export function BlogList({
  blogs: initialBlogs,
  categories,
}: BlogListProps) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("latest");

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      toast.success("Blog post deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete blog post"
      );
    }
  };

  const onSuccess = (updatedBlog: Blog & { category: BlogCategory }) => {
    setBlogs((prev) => {
      const existing = prev.find((blog) => blog.id === updatedBlog.id);
      if (existing) {
        // Edit operation
        return prev.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        );
      }
      // Add operation
      return [updatedBlog, ...prev];
    });
  };

  const columns = [
    {
      accessorKey: "featuredImage",
      header: "Image",
      cell: ({ row }) => {
        const blog = row.original;
        return blog.featuredImage ? (
          <Image
            src={blog.featuredImage}
            alt={blog.title}
            width={40}
            height={40}
            className="h-10 w-10 rounded-sm object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-sm bg-muted" />
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category.name",
      header: "Category",
    },
    
    {
      accessorKey: "createdAt",
      header: "Published",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => {
        const blog = row.original;
        return (
          <div className="flex gap-2">
            {blog.isFeatured && (
              <Badge variant="secondary">Featured</Badge>
            )}
            {blog.isPublished ? (
              <Badge variant="outline">Published</Badge>
            ) : (
              <Badge variant="destructive">Draft</Badge>
            )}
          </div>
        );
      },
    },
    
    {
      id: "actions",
      cell: ({ row }) => {
        const blog = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <a href={blog.slug} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </a>
              </DropdownMenuItem>
              <BlogDialog blog={blog} categories={categories} onSuccess={onSuccess}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </BlogDialog>
              <ConfirmModal
                title="Delete Blog Post"
                description="Are you sure you want to delete this blog post? This action cannot be undone."
                onConfirm={() => onDelete(blog.id)}
                variant="destructive"
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive"
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Heading
          title="Blogs"
          description="Manage blog posts for your website"
          icon={FileTextIcon}
        />
        <div className="flex gap-4">
          <Select
            value={status || "all"}
            onValueChange={(value) => setStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sort || "latest"}
            onValueChange={(value) => setSort(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <BlogDialog categories={categories} onSuccess={onSuccess}>
          <Button variant="secondary"><Plus className="mr-2 h-4 w-4" />Add New Blog</Button>
        </BlogDialog>
      </div>

      <DataTable
        columns={columns}
        data={blogs}
        searchKey="title"
      />
    </div>
  );
}
