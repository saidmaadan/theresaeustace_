import { redirect } from "next/navigation";
import { auth } from "@/auth";
// import { AdminDashboardSidebar } from "@/components/admin/admin-sidebar";
// import { AdminHeader } from "@/components/admin/header";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Admin Dashboard | Theresa Eustace",
  description: "Admin dashboard for managing the bookstore website",
};


export default async function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const session = await auth();
  
    if (!session || session?.user.role !== "ADMIN") {
      redirect("/");
    }
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="container mx-auto px-4">
              {children}
            </div>
          </main>
          </div>
    )
}

