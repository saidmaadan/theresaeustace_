import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminDashboardSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/header";
import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "Admin Dashboard | TheresaEustace",
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
    <div className="flex h-screen bg-gradient-to-br from-background to-muted/20">

      <SidebarProvider>
        <AdminDashboardSidebar user={session?.user}/>
          <SidebarInset>
            <header className="sticky top-0 z-100 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    
                </div> 
                <AdminHeader user={session?.user} />
            </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="container mx-auto px-4">
              {children}
            </div>
          </main>
          </div>
          </SidebarInset>
    </SidebarProvider>
  </div>
  );
}