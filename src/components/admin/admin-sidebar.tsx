"use client"

// import * as React from "react"
import { User } from "@prisma/client";

import {
    // AudioWaveform,
    // Bot,
    // Command,
    // Frame,
    
    // Map,
    // PieChart,
    // Settings2,
    // SquareTerminal,
    // HomeIcon,
    GalleryVerticalEnd,
    BookOpen,
    BookmarkIcon,
    FileTextIcon,
    FolderIcon,
    LayoutDashboardIcon,
    MailIcon,
    Users2Icon,
  
} from "lucide-react"


import { NavUser } from "@/components/dashboard/nav-user"
import { NavHeader } from "@/components/dashboard/nav-header"
import { NavMain } from "@/components/dashboard/nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface AdminSidebarProps {
    user: User;
}

const data = {
    
    menuItems: [
        {
            title: "Admin",
            url: "/admin",
            icon: LayoutDashboardIcon,
            isActive: true,
            items: [
                {
                title: "Dashboard",
                url: "/admin",
                },
                
            ],
        },
        
        {
            title: "Books",
            url: "/admin/books",
            icon: BookOpen,
            items: [
                {
                title: "All Books",
                url: "/admin/books",
                },
                {
                    title: "Add Books",
                    url: "/admin/books/new",
                },
                {
                    title: "Book Categories",
                    url: "/admin/categories",
                    icon: FolderIcon,
                },
                
            ],
        },
        {
            title: "Blogs",
            url: "/admin/blogs",
            icon: FileTextIcon,
            items: [
                {
                    title: "All Blogs",
                    url: "/admin/blogs",
                    icon: GalleryVerticalEnd,
                },
                
                {
                    title: "Blog Categories",
                    url: "/admin/blog-categories",
                    icon: BookmarkIcon,
                },
                
            ],
        },
        
        {
            title: "Users Account",
            url: "/admin/users",
            icon: Users2Icon,
            items: [
                {
                    title: "Users",
                    url: "/admin/users",
                },
                
            ],
        },
        {
            title: "Newsletter",
            url: "/admin/newsletter",
            icon: MailIcon,
            items: [
                {
                    title: "Subscribers",
                    url: "/admin/newsletter",
                },
                
            ],
        },
          
    ],
}
  


//export function DashboardSidebar({ user }: DashboardHeaderProps){
// export function DashboardSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar>) {
export function AdminDashboardSidebar({ user }: AdminSidebarProps) {

  return (
      // <Sidebar collapsible="icon" {...props}>
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavHeader  />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
