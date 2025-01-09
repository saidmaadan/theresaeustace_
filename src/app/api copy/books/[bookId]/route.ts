import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import slugify from 'slugify';

// GET /api/books/[bookId] - Get a single book
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await context.params;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        category: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("[BOOK_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/books/[bookId] - Update a book (Admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ bookId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookId } = await context.params;

    // Get the current book first
    const currentBook = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!currentBook) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { title, description, price, categoryId, isPublished, coverImage, bookFile, amazonLink, isFeatured, isPremium, isFree } = body;

    // Generate new slug if title is being updated
    let newSlug = currentBook.slug;
    if (title) {
      newSlug = slugify(title, { lower: true, strict: true });

      // If slug is changing, check if new slug is unique
      if (newSlug !== currentBook.slug) {
        const existingBook = await prisma.book.findFirst({
          where: { 
            AND: [
              { slug: newSlug },
              { id: { not: bookId } }
            ]
          },
        });
        if (existingBook) {
          return NextResponse.json(
            { error: "Book with similar title already exists" },
            { status: 400 }
          );
        }
      }

      // Check if title is unique
      const existingBook = await prisma.book.findFirst({
        where: {
          title,
          NOT: { id: currentBook.id },
        },
      });

      if (existingBook) {
        return NextResponse.json(
          { error: "Book with this title already exists" },
          { status: 400 }
        );
      }
    }

    const updatedBook = await prisma.book.update({
      where: { id: bookId },
      data: {
        title: title || undefined,
        slug: newSlug,
        description: description || undefined,
        price: price || undefined,
        categoryId: categoryId || undefined,
        isPublished: isPublished || undefined,
        coverImage: coverImage || undefined,
        bookFile: bookFile || undefined,
        amazonLink: amazonLink || undefined,
        isFeatured: isFeatured || undefined,
        isPremium: isPremium || undefined,
        isFree: isFree || undefined,
      },
      include: {
        category: true,
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("[BOOK_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[bookId] - Delete a book (Admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ bookId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookId } = await context.params;

    // Check if book has any comments
    const commentsCount = await prisma.comment.count({
      where: { bookId },
    });

    if (commentsCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete book with comments" },
        { status: 400 }
      );
    }

    await prisma.book.delete({
      where: { id: bookId },
    });

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("[BOOK_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
