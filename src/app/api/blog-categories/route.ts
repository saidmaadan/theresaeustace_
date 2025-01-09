import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import slugify from 'slugify';

// GET /api/blog-categories - Get all blog categories
export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        _count: {
          select: { blogs: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return new NextResponse(
      JSON.stringify(categories),
      { status: 200 }
    );
  } catch (error) {
    console.error("[BLOG_CATEGORIES_GET]", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      }),
      { status: 500 }
    );
  }
}

// POST /api/blog-categories - Create a new blog category (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description } = body;

    const existingCategory = await prisma.blogCategory.findUnique({
      where: { name },
    });

    if (existingCategory) {
      return new NextResponse(
        JSON.stringify({ error: "Blog category already exists" }),
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });

    // Check if slug exists
    const existingSlug = await prisma.blogCategory.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return new NextResponse(
        JSON.stringify({ error: "Blog category with similar name already exists" }),
        { status: 400 }
      );
    }

    const category = await prisma.blogCategory.create({
      data: {
        name,
        description,
        slug,
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
    console.error("[BLOG_CATEGORIES_POST]", error);
    return new NextResponse(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Internal Server Error" 
      }),
      { status: 500 }
    );
  }
}
