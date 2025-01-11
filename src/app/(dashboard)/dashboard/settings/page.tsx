import { Metadata } from "next"
import { auth } from "@/auth";
// import { currentUser } from "@/lib/session"
import { redirect } from "next/navigation"
import { UserSettings } from "@/components/dashboard/user-settings"

export const metadata: Metadata = {
  title: "User Settings",
  description: "Manage your profile settings",
}

export default async function ProfilePage() {
  // const user = await currentUser()
  const session = await auth()
  const user = session.user

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
        <UserSettings user={user} />
      </div>
    </div>
  )
}
