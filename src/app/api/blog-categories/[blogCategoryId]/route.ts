import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import slugify from 'slugify';

// GET /api/blog-categories/[blogCategoryId] - Get a single blog category with its blogs
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ blogCategoryId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const { blogCategoryId } = await context.params;

    const [category, total] = await Promise.all([
      prisma.blogCategory.findUnique({
        where: { id: blogCategoryId },
        include: {
          blogs: {
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      prisma.blog.count({
        where: {
          blogCategoryId,
        },
      }),
    ]);

    if (!category) {
      return new NextResponse(
        JSON.stringify({ error: "Blog category not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({
        ...category,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOG_CATEGORY_GET]", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      }),
      { status: 500 }
    );
  }
}

// PATCH /api/blog-categories/[blogCategoryId] - Update a blog category (Admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ blogCategoryId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { blogCategoryId } = await context.params;

    // Get the current category first
    const currentCategory = await prisma.blogCategory.findUnique({
      where: { id: blogCategoryId },
    });

    if (!currentCategory) {
      return new NextResponse(
        JSON.stringify({ error: "Blog category not found" }),
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
        const existingCategory = await prisma.blogCategory.findFirst({
          where: { slug: newSlug },
        });
        if (existingCategory) {
          return new NextResponse(
            JSON.stringify({ error: "Blog category with similar name already exists" }),
            { status: 400 }
          );
        }
      }

      // Check if name is unique
      const existingCategory = await prisma.blogCategory.findFirst({
        where: {
          name,
          NOT: { id: currentCategory.id },
        },
      });

      if (existingCategory) {
        return new NextResponse(
          JSON.stringify({ error: "Blog category with this name already exists" }),
          { status: 400 }
        );
      }
    }

    const category = await prisma.blogCategory.update({
      where: { id: currentCategory.id },
      data: {
        name,
        description,
        slug: newSlug,
      },
      include: {
        _count: {
          select: { blogs: true },
        },
      },
    });

    return new NextResponse(
      JSON.stringify(category),
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOG_CATEGORY_PATCH]", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      }),
      { status: 500 }
    );
  }
}

// DELETE /api/blog-categories/[blogCategoryId] - Delete a blog category (Admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ blogCategoryId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const { blogCategoryId } = await context.params;

    // Check if category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: blogCategoryId },
      include: {
        _count: {
          select: { blogs: true },
        },
      },
    });

    if (!category) {
      return new NextResponse(
        JSON.stringify({ error: "Blog category not found" }),
        { status: 404 }
      );
    }

    // Check if category has any blogs
    if (category._count.blogs > 0) {
      return new NextResponse(
        JSON.stringify({ error: "Cannot delete blog category with blogs" }),
        { status: 400 }
      );
    }

    await prisma.blogCategory.delete({
      where: { id: blogCategoryId },
    });

    return new NextResponse(
      JSON.stringify({ message: "Blog category deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOG_CATEGORY_DELETE]", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      }),
      { status: 500 }
    );
  }
}
