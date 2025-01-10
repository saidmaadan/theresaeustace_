'use server';

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    totalBooks,
    totalBlogs,
    totalUsers,
    totalSubscribers,
    recentBooks,
    recentBlogs,
  ] = await Promise.all([
    prisma.book.count(),
    prisma.blog.count(),
    prisma.user.count(),
    prisma.newsletter.count({ where: { isActive: true } }),
    prisma.book.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.blog.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
  ]);

  return {
    totalBooks,
    totalBlogs,
    totalUsers,
    totalSubscribers,
    recentBooks,
    recentBlogs,
  };
}
