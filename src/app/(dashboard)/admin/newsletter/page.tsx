import { Suspense } from "react";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Heading } from "@/components/shared/heading";
import { EmptyState } from "@/components/shared/empty-state";
import { SubscriberList } from "@/components/admin/newsletter/subscriber-list";
import { NewsletterDialog } from "@/components/admin/newsletter/newsletter-dialog";
import { Mail, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Newsletter | Admin Dashboard",
  description: "Manage your newsletter subscribers and send newsletters",
};

async function getSubscribers() {
  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: "desc" },
  });

  return subscribers;
}

export default async function NewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="space-y-6">
      <Heading
        title="Newsletter"
        description="Manage your newsletter subscribers and send newsletters"
        icon={Mail}
        actions={
          <NewsletterDialog>
            <Plus className="mr-2 h-4 w-4" />
            Send Newsletter
          </NewsletterDialog>
        }
      />

      <Suspense fallback={<div>Loading...</div>}>
        {subscribers.length === 0 ? (
          <EmptyState
            icon={Mail}
            title="No subscribers"
            description="No one has subscribed to your newsletter yet."
          />
        ) : (
          <SubscriberList subscribers={subscribers} />
        )}
      </Suspense>
    </div>
  );
}
