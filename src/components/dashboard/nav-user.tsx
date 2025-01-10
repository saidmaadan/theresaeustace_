"use client"

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
    UserIcon,
    Bell,
    ChevronsUpDown,
    Settings,
    LogOut,
  
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface UserNavProps {
    user: Pick<User, "name" | "image" | "email">;
  }

export function NavUser({ user }: UserNavProps) {
    
    const router = useRouter();
    const initials = user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    const { isMobile } = useSidebar()
    return (
        <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.image || ""} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.image || ""} alt={user?.name} />
                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span>
                    </div>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                    Settings
                </DropdownMenuItem>
                
                <DropdownMenuItem>
                    <Bell />
                    Notifications
                </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
        </SidebarMenu>
    )
}
