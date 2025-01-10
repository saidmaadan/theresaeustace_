"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { DataTable } from "@/components/shared/data-table";
import { UserDialog } from "./user-dialog";
import { UserActivityDialog } from "./user-activity-dialog";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Activity, Edit, MoreHorizontal, Shield, Trash } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UserListProps {
  users: (User & {
    _count: {
      books: number;
      comments: number;
      
    };
  })[];
}

export function UserList({ users: initialUsers }: UserListProps) {
  const [users, setUsers] = useState(initialUsers);

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    }
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Avatar",
      cell: ({ row }) => {
        const user = row.original;
        return user.image ? (
          <img
            src={user.image}
            alt={user.name || ""}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
            <Shield className="h-5 w-5 text-muted-foreground" />
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge
            variant={user.role === "ADMIN" ? "default" : "secondary"}
          >
            {user.role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "stats",
      header: "Activity",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{user._count.books} books</span>
            <span>{user._count.comments} comments</span>
            
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <UserDialog
                user={user}
                onSuccess={(updatedUser) => {
                  setUsers((prev) =>
                    prev.map((u) =>
                      u.id === updatedUser.id ? { ...u, ...updatedUser } : u
                    )
                  );
                }}
              >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              </UserDialog>
              <UserActivityDialog userId={user.id}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Activity className="mr-2 h-4 w-4" />
                  View Activity
                </DropdownMenuItem>
              </UserActivityDialog>
              <ConfirmModal
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone and will remove all associated data."
                onConfirm={() => onDelete(user.id)}
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
    <DataTable
      columns={columns}
      data={users}
      searchKey="name"
    />
  );
}
