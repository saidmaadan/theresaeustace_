import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import slugify from 'slugify';

// GET /api/categories/[categoryId] - Get a single category with its books
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const { categoryId } = await context.params;

    const [category, total] = await Promise.all([
      prisma.category.findUnique({
        where: { id: categoryId },
        include: {
          books: {
            where: { isPublished: true },
            include: {
              category: true,
              _count: {
                select: { comments: true },
              },
            },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.book.count({
        where: {
          categoryId,
          isPublished: true,
        },
      }),
    ]);

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...category,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/categories/[categoryId] - Update a category (Admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { categoryId } = await context.params;

    // Get the current category first
    const currentCategory = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!currentCategory) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    // Generate new slug if name is being updated
    let newSlug = currentCategory.slug;
    if (name) {
      newSlug = slugify(name, { lower: true, strict: true });

      // If slug is changing, check if new slug is unique
      if (newSlug !== currentCategory.slug) {
        const existingCategory = await prisma.category.findFirst({
          where: { slug: newSlug },
        });
        if (existingCategory) {
          return NextResponse.json(
            { error: "Category with similar name already exists" },
            { status: 400 }
          );
        }
      }

      // Check if name is unique
      const existingCategory = await prisma.category.findFirst({
        where: {
          name,
          NOT: { id: currentCategory.id },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { error: "Category with this name already exists" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: { id: currentCategory.id },
      data: {
        name,
        description,
        slug: newSlug,
      },
      include: {
        _count: {
          select: { books: true },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[categoryId] - Delete a category (Admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ categoryId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { categoryId } = await context.params;

    // Check if category has any books
    const booksCount = await prisma.book.count({
      where: { categoryId },
    });

    if (booksCount > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with existing books" },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
