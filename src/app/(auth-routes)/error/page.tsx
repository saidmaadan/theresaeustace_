import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Authentication Error
        </h1>
        <p className="text-sm text-muted-foreground">
          There was an error during authentication. Please try again.
        </p>
        <Button asChild>
          <Link href="/login">Back to Login</Link>
        </Button>
      </div>
    </div>
  );
}
