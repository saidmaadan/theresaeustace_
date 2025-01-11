import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/shared/social-share";
import { SimilarPosts } from "@/components/main/blog/similar-posts";
import { getPublicUrl } from "@/lib/utils";
// import { SafeHTML } from "@/components/ui/safe-html"

interface BlogPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  const post = await prisma.blog.findUnique({
    where: { slug },
    include: {
      category: true, 
      },
  });

  if (!post) {
    notFound();
  }

  return post;
}

export async function generateMetadata({
  params,
}: BlogPageProps){
  const searchParams = await params
  const post = await getBlogPost(searchParams.slug);

  if (!post) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
    };
  }

  const ogUrl = getPublicUrl(`/blog/${post.slug}`);

  return {
    title: `${post.title} - Theresa Eustace`,
    description: 'Best Seller Author',
    openGraph: {
      title: post.title,
      description: "Best seller author",
      type: "article",
      url: ogUrl,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.title,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const SearchParams = await params
  const post = await getBlogPost(SearchParams.slug);

  return (
    <div className="container-center py-10 mt-10">
      <Button variant="ghost" size="sm" className="mb-8" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
        <article className="md:col-span-2 lg:col-span-3 ">
          <header className="mb-8">
            <Badge variant="outline" className="mb-4 capitalize">
              {post.category.name}
            </Badge>
            <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
            <div className="flex items-center gap-4">
              
              {post.createdAt && (
                <time
                  dateTime={post.createdAt.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {format(post.createdAt, "MMM d, yyyy")}
                </time>
              )}
            </div>
          </header>

          {post.featuredImage && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-8">
            <SocialShare
              url={`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
              title={post.title}
            />
          </div>
        </article>

        <div className="md:col-span-1 md:mt-40 mt-20">
          <SimilarPosts currentPostId={post.id} categoryId={post.categoryId} />
        </div>
      </div>
    </div>
  );
}
