import { Suspense } from "react"
import Link from "next/link"
import { Download } from "lucide-react"

import { getBooks } from "@/lib/actions/book"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Image from "next/image"
import { AudioPlayer } from "./audio-player"
import { DownloadButton } from "./download-button"
import { ViewButton } from "./view-button"
import { SafeHTML } from "@/components/ui/safe-html"

interface UserBooksProps {
  userId: string
  
}

async function BooksList() {
  const books = await getBooks()

  if (!books?.length) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No books available.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {books.map((book) => (
        {
          book.bookFile &&
            <Card key={book.id} className="flex flex-col">
              <CardHeader className="flex-none">
                <CardTitle className="line-clamp-1">{book.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-md">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary">
                      <span className="text-sm text-muted-foreground">No cover</span>
                    </div>
                  )}
                </AspectRatio>
            
                <SafeHTML
                  html={book.description || ""}
                  truncate={200}
                  as="p"
                  className="line-clamp-2 text-sm text-muted-foreground"
                />
          
              </CardContent>
              <CardFooter className="flex-none">
                <div className="flex w-full flex-col gap-2">
                  {book.bookFile && (book.isPremium || book.isFree) && (
                    <>
                      <ViewButton
                        fileUrl={book.bookFile}
                        title={book.title}
                      />
                      <DownloadButton
                        fileUrl={book.bookFile}
                        fileName={book.title}
                        title="Download PDF"
                      />
                      <AudioPlayer bookFile={book.bookFile} title={book.title} />
                    </>
                  )}
                  {!book.bookFile && (
                    <Button asChild variant="secondary" className="w-full">
                      <Link href={book.amazonLink || "#"} target="_blank" rel="noopener noreferrer">
                        View on Amazon
                      </Link>
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
        }
      ))}
    </div>
  )
}

export function UserBooks({ userId }: UserBooksProps) {
  return (
    <div className="grid gap-6">
      <Suspense fallback={<div className="text-center py-10">Loading books...</div>}>
        <BooksList />
      </Suspense>
    </div>
  )
}




