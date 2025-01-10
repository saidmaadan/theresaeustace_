"use client";

import { useState, useEffect } from "react";
import { User } from "@prisma/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { BookOpen, FileText, Heart, MessageSquare } from "lucide-react";

interface Activity {
  id: string;
  type: "BOOK" | "BLOG" | "COMMENT" | "LIKE";
  title: string;
  createdAt: Date;
}

interface UserActivityDialogProps {
  children: React.ReactNode;
  userId: string;
}

export function UserActivityDialog({
  children,
  userId,
}: UserActivityDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<{
    books: Activity[];
    blogs: Activity[];
    comments: Activity[];
    // likes: Activity[];
  }>({
    books: [],
    blogs: [],
    comments: [],
    // likes: [],
  });

  useEffect(() => {
    if (open) {
      const fetchActivity = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/users/${userId}/activity`);

          if (!response.ok) {
            throw new Error("Failed to fetch user activity");
          }

          const data = await response.json();
          setActivities(data);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Something went wrong"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchActivity();
    }
  }, [userId, open]);

  const ActivityItem = ({ activity }: { activity: Activity }) => (
    <div className="flex items-start gap-4 py-4">
      <div className="rounded-full p-2 bg-muted">
        {activity.type === "BOOK" && <BookOpen className="h-4 w-4" />}
        {activity.type === "BLOG" && <FileText className="h-4 w-4" />}
        {activity.type === "COMMENT" && <MessageSquare className="h-4 w-4" />}
        
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium leading-none">{activity.title}</p>
        <p className="text-sm text-muted-foreground">
          {formatDate(activity.createdAt)}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {typeof children === "string" ? (
          <Button>{children}</Button>
        ) : (
          children
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Activity</DialogTitle>
          <DialogDescription>
            View user's activity and interactions
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="books" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            
          </TabsList>
          <div className="mt-4">
            <TabsContent value="books">
              <Card>
                <CardHeader>
                  <CardTitle>Books</CardTitle>
                  <CardDescription>Books downloaded by the user</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {loading ? (
                      <div>Loading...</div>
                    ) : activities.books.length === 0 ? (
                      <div className="text-center text-muted-foreground py-4">
                        No book activity
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activities.books.map((activity) => (
                          <ActivityItem key={activity.id} activity={activity} />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="blogs">
              <Card>
                <CardHeader>
                  <CardTitle>Blogs</CardTitle>
                  <CardDescription>Blog posts read by the user</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {loading ? (
                      <div>Loading...</div>
                    ) : activities.blogs.length === 0 ? (
                      <div className="text-center text-muted-foreground py-4">
                        No blog activity
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activities.blogs.map((activity) => (
                          <ActivityItem key={activity.id} activity={activity} />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments">
              <Card>
                <CardHeader>
                  <CardTitle>Comments</CardTitle>
                  <CardDescription>User's comments on books and blogs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {loading ? (
                      <div>Loading...</div>
                    ) : activities.comments.length === 0 ? (
                      <div className="text-center text-muted-foreground py-4">
                        No comments
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activities.comments.map((activity) => (
                          <ActivityItem key={activity.id} activity={activity} />
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
