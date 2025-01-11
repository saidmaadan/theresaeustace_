import { Metadata } from "next"
import { redirect } from "next/navigation"

import { auth } from "@/auth"
import { UserBooks } from "@/components/dashboard/user-books"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "User dashboard to manage and access your books",
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("login")
  }

  return (
    <div className="container grid items-center gap-8 pb-8 pt-6 md:py-8">
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Welcome back, {session.user.name}
        </h1>
        <p className="text-lg text-muted-foreground">
          Access and manage your books from one place.
        </p>
      </div>
      <UserBooks userId={session.user.id} />
    </div>
  )
}

