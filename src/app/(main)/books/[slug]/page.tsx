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
import { SimilarBooks } from "@/components/main/books/similar-books";
import { getPublicUrl } from "@/lib/utils";
import { ShoppingBasket, Download, Crown } from "lucide-react";
import { DownloadButton } from "@/components/dashboard/download-button";

interface BookPageProps {
  params: {
    slug: string
  }
}

async function getBookPost(slug: string) {
  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      category: true, 
      },
  });

  if (!book) {
    notFound();
  }

  return book;
}

export async function generateMetadata({
  params,
}: BookPageProps){
  const searchParams = await params
  const book = await getBookPost(searchParams.slug);

  if (!book) {
    return {
      title: "Not Found",
      description: "The page you're looking for doesn't exist.",
    };
  }

  const ogUrl = getPublicUrl(`/book/${book.slug}`);

  return {
    title: `${book.title} - SophiaBent`,
    description: 'Best Seller Author',
    openGraph: {
      title: book.title,
      description: "Best seller author",
      type: "article",
      url: ogUrl,
      images: [
        {
          url: book.coverImage,
          width: 1200,
          height: 630,
          alt: book.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description: book.title,
      images: [book.coverImage],
    },
  };
}

export default async function BookPostPage({ params }: BookPageProps) {
  const SearchParams = await params
  const book = await getBookPost(SearchParams.slug);

  return (
    <div className="container-center py-10 mt-20">
      <Button variant="ghost" size="sm" className="mb-8" asChild>
        <Link href="/books">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Book
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:grid-cols-4">
        <article className="md:col-span-2 lg:col-span-3 ">
          <header className="mb-8">
            <Badge variant="outline" className="mb-4 capitalize">
              {book.category.name}
            </Badge>
            <h1 className="mb-4 text-4xl font-bold">{book.title}</h1>
            <div className="flex items-center gap-4">
              
              {book.createdAt && (
                <time
                  dateTime={book.createdAt.toISOString()}
                  className="text-sm text-muted-foreground"
                >
                  {format(book.createdAt, "MMM d, yyyy")}
                </time>
              )}
            </div>
          </header>

          {book.coverImage && (
            <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: book.description }}
          />

          <div className="flex items-center justify-between flex-wrap space-x-2 mt-8">
            <div className="">
              {book.bookFile && book.isFree ? (
                <DownloadButton 
                  fileUrl={book.bookFile}
                  fileName={book.title}
                  title="Free Download"
                  size="lg"
              />
              ) : book.isPremium ? (
                  <Link href={"/dashboard"}>
                    <Button >
                      <Download className="mr-2 h-4 w-4" /> 
                      Premium
                      <Crown className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                
              ) : book.amazonLink ? (
                <Button asChild >
                  <a href={book.amazonLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingBasket className="mr-2 h-4 w-4" /> Buy on Amazon
                  </a>
                </Button>
              ) : null}

            </div>
            <div className="font-bold">
              <SocialShare
                url={`${process.env.NEXT_PUBLIC_APP_URL}/book/${book.slug}`}
                title={book.title}
              />
            </div>
            </div>
        </article>

        <div className="md:col-span-1 md:mt-40 mt-20">
          <SimilarBooks currentBookId={book.id} categoryId={book.categoryId} />
        </div>
      </div>
    </div>
  );
}
