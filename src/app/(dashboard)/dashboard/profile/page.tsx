import { Metadata } from "next"
import { UserProfile } from "@/components/dashboard/user-profile"
import { currentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your profile settings",
}

export default async function ProfilePage() {
  const user = await currentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col gap-8 px-4 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your profile information and account settings
          </p>
        </div>
        <UserProfile user={user} />
      </div>
    </div>
  )
}
