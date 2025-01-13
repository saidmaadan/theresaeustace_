"use client"

// import * as React from "react"
import { User } from "@prisma/client";

import {
  // AudioWaveform,
  // Bot,
  // Command,
  // Frame,
  // GalleryVerticalEnd,
  // Map,
  // PieChart,
  // Settings2,
  // SquareTerminal,
  // BookmarkIcon,
  // FileTextIcon,
  // FolderIcon,
  // HomeIcon,
  // MailIcon,
  LayoutDashboardIcon,
  BookOpen,
  Users2Icon,
} from "lucide-react"


import { NavUser } from "./nav-user"
import { NavHeader } from "./nav-header"
import { NavMain } from "./nav-main"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

interface SidebarProps {
    user: User;
}

const data = {
    
    menuItems: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboardIcon,
            isActive: true,
            items: [
                {
                title: "Home",
                url: "/dashboard",
                },
                
            ],
        },
        {
            title: "Books",
            url: "/dashboard/books",
            icon: BookOpen,
            items: [
                {
                title: "All Books",
                url: "/dashboard/books",
                },
                {
                    title: "Free Books",
                    url: "/dashboard/free-books",
                },
                
            ],
        },
        
        {
            title: "Account Settings",
            url: "/dashboard/profile",
            icon: Users2Icon,
            items: [
                {
                    title: "Profile",
                    url: "/dashboard/profile",
                },
                {
                    title: "Settings",
                    url: "/dashboard/settings",
                },
                
            ],
        },
          
    ],
}
  


//export function DashboardSidebar({ user }: DashboardHeaderProps){
//export function DashboardSidebar({ user, ...props }: React.ComponentProps<typeof Sidebar>) {
export function DashboardSidebar({ user, ...props }: SidebarProps) {

  return (
      // <Sidebar collapsible="icon" {...props}>
    <Sidebar collapsible="icon" {...props} className="dark:bg-purple-950/30 bg-purple-50">
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
