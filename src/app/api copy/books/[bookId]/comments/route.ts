import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/books/[bookId]/comments - Get all comments for a book
export async function GET(req: NextRequest, props: { params: Promise<{ bookId: string }> }) {
  const params = await props.params;
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: {
          bookId: params.bookId,
          parentId: null, // Only get top-level comments
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count({
        where: {
          bookId: params.bookId,
          parentId: null,
        },
      }),
    ]);

    return NextResponse.json({
      comments,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("[COMMENTS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/books/[bookId]/comments - Create a new comment
export async function POST(req: NextRequest, props: { params: Promise<{ bookId: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { content, parentId } = body;

    // Verify the book exists
    const book = await prisma.book.findUnique({
      where: { id: params.bookId },
    });

    if (!book) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    // If it's a reply, verify the parent comment exists and belongs to the same book
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      });

      if (!parentComment || parentComment.bookId !== params.bookId) {
        return NextResponse.json(
          { error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        bookId: params.bookId,
        parentId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("[COMMENTS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
