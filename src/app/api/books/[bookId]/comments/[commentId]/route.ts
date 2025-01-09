import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// PATCH /api/books/[bookId]/comments/[commentId] - Update a comment
export async function PATCH(
  req: NextRequest,
  props: { params: Promise<{ bookId: string; commentId: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Only allow the comment owner or admin to update
    if (comment.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { content } = body;

    const updatedComment = await prisma.comment.update({
      where: { id: params.commentId },
      data: { content },
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

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("[COMMENT_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[bookId]/comments/[commentId] - Delete a comment
export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ bookId: string; commentId: string }> }
) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const comment = await prisma.comment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Comment not found" },
        { status: 404 }
      );
    }

    // Only allow the comment owner or admin to delete
    if (comment.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Delete the comment and all its replies
    await prisma.comment.deleteMany({
      where: {
        OR: [
          { id: params.commentId },
          { parentId: params.commentId },
        ],
      },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("[COMMENT_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
