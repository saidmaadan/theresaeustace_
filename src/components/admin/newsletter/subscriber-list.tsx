"use client";

import { useState } from "react";
import { Newsletter } from "@prisma/client";
import { DataTable } from "@/components/shared/data-table";
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
import { Check, MoreHorizontal, Trash, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface SubscriberListProps {
  subscribers: Newsletter[];
}

export function SubscriberList({
  subscribers: initialSubscribers,
}: SubscriberListProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setSubscribers((prev) =>
        prev.filter((subscriber) => subscriber.id !== id)
      );
      toast.success("Subscriber removed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove subscriber"
      );
    }
  };

  const onToggleStatus = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      setSubscribers((prev) =>
        prev.map((subscriber) =>
          subscriber.id === id
            ? { ...subscriber, isActive }
            : subscriber
        )
      );
      toast.success(
        `Subscriber ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update subscriber"
      );
    }
  };

  const columns = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const subscriber = row.original;
        return (
          <Badge
            variant={subscriber.isActive ? "default" : "secondary"}
          >
            {subscriber.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Subscribed On",
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const subscriber = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  onToggleStatus(subscriber.id, !subscriber.isActive)
                }
              >
                {subscriber.isActive ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <ConfirmModal
                title="Remove Subscriber"
                description="Are you sure you want to remove this subscriber? This action cannot be undone."
                onConfirm={() => onDelete(subscriber.id)}
                variant="destructive"
              >
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Remove
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
      data={subscribers}
      searchKey="email"
    />
  );
}
