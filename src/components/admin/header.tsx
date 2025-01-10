import { User } from "next-auth";
import { UserNav } from "@/components/shared/user-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";

import { Logo } from "@/components/shared/logo";
import Link from "next/link";

interface AdminHeaderProps {
  user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Left side content */}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" >
            <Button variant="ghost" size="icon" className="mr-8">
              <Logo />
            </Button>
          </Link>
          <ThemeToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}
