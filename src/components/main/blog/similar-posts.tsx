import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

interface Blog {
  id: string
  title: string
  content: string
  featuredImage: string | null
  slug: string
  isPublished: boolean
  createdAt: Date | null
  category: {
    name: string
  } | null
  
}

interface SimilarPostsProps {
  currentPostId: string
  categoryId: string | null
}

async function getSimilarPosts(currentPostId: string, categoryId: string | null) {
  if (categoryId) {
    // First try to get posts from the same category
    const similarPosts = await prisma.blog.findMany({
      where: {
        isPublished: true,
        categoryId,
        NOT: {
          id: currentPostId,
        },
      },
      include: {
        category: true,
        
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 2,
    })

    if (similarPosts.length > 0) {
      return similarPosts
    }
  }

  // If no posts in the same category, get latest posts
  return await prisma.blog.findMany({
    where: {
      isPublished: true,
      NOT: {
        id: currentPostId,
      },
    },
    include: {
      category: true,
      
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 2,
  })
}

export async function SimilarPosts({ currentPostId, categoryId }: SimilarPostsProps) {
  const posts = await getSimilarPosts(currentPostId, categoryId)

  if (posts.length === 0) {
    return null
  }

  return (
    <aside className="space-y-8">
      <h2 className="text-2xl font-bold">
        {categoryId && 'Similar Posts'}
        {!categoryId && 'Latest Posts'}
      </h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`}>
            <Card className="overflow-hidden hover:bg-muted/50 transition-colors">
              {post.featuredImage && (
                <div className="relative aspect-[16/9]">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader className="space-y-2">
                {post.category && (
                  <Badge variant="outline" className="w-fit capitalize">
                    {post.category.name}
                  </Badge>
                )}
                <h3 className="font-semibold line-clamp-2">{post.title}</h3>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  
                  {post.createdAt && (
                    <time dateTime={post.createdAt.toISOString()}>
                      {formatDate(post.createdAt)}
                    </time>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </aside>
  )
}
