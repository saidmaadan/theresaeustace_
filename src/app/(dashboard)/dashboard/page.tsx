import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Metadata } from "next";
// import { DashboardSidebar } from "@/components/dashboard/sidebar";
// import { AdminHeader } from "@/components/admin/header";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export const metadata: Metadata = {
  title: "User Dashboard | Theresa Eustace",
  description: "User dashboard for managing their account",
};

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session ) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-background to-muted/20">
      
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="container mx-auto px-4">
            {children}
          </div>
        </main>
        </div>
      
    </div>
  );
}
