"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  BookmarkIcon,
  FileTextIcon,
  FolderIcon,
  HomeIcon,
  LayoutDashboardIcon,
  MailIcon,
  Users2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Books",
    href: "/admin/books",
    icon: BookOpen,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: FolderIcon,
  },
  {
    title: "Blog Categories",
    href: "/admin/blog-categories",
    icon: BookmarkIcon,
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: FileTextIcon,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users2Icon,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: MailIcon,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r flex flex-col ">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <HomeIcon className="h-6 w-6" />
          <span className="font-semibold text-xl">Theresa Eustace</span>
        </Link>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "bg-secondary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
