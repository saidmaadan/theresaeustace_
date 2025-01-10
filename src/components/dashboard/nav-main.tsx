"use client"

import { ChevronRight, Settings, Users2Icon, LayoutDashboardIcon, BookOpen, FolderIcon, type LucideIcon } from "lucide-react"
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"


// const items = [
//     {
//       title: "Dashboard",
//       url: "/dashboard",
//         icon: LayoutDashboardIcon,
//         isActive: true,
//     },
//     {
//       title: "Books",
//       url: "/dashboard/books",
//       icon: BookOpen,
//       isActive: false,
//     },
//     {
//       title: "Free Books",
//       url: "/dashboard/free-books",
//       icon: FolderIcon,
//       isActive: false,
//     },
//     {
//         title: "Profile",
//         url: "/dashboard/profile",
//         icon: Users2Icon,
//         isActive: false,
//     },
//     {
//         title: "Settings",
//         url: "/dashboard/settings",
//         icon: Settings,
//         isActive: false,
//       },
    
// ];

export function NavMain({
    items,
  }: {
    items: {
      title: string
      url: string
      icon?: LucideIcon
      isActive?: boolean
      items?: {
        title: string
        url: string
      }[]
    }[]
  }) {

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Welcome back</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

