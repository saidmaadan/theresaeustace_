import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Heading } from "@/components/shared/heading";
import { EmptyState } from "@/components/shared/empty-state";
import { UserList } from "@/components/admin/users/user-list";
import { Users2Icon } from "lucide-react";

export const metadata: Metadata = {
  title: "Users | Admin Dashboard",
  description: "Manage your users",
};

async function getUsers() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          books: true,
          comments: true,
          
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <Heading
        title="Users"
        description="Manage your users and their roles"
        icon={Users2Icon}
      />

      <Suspense fallback={<div>Loading...</div>}>
        {users.length === 0 ? (
          <EmptyState
            icon={Users2Icon}
            title="No users"
            description="There are no users registered yet."
          />
        ) : (
          <UserList users={users} />
        )}
      </Suspense>
    </div>
  );
}
