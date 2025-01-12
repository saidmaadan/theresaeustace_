import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import slugify from 'slugify';

// GET /api/blogs - Get all blogs
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isFeatured = searchParams.get("isFeatured") === "true";
    const isPremium = searchParams.get("isPremium") === "true";
    
    const skip = (page - 1) * limit;

    const where = {
      isPublished: true,
      ...(category && { categoryId: category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(isFeatured && { isFeatured: true }),
    };

    
    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.blog.count({ where }),
    ]);

    return NextResponse.json({
      blogs,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("[BLOGS_GET]", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

// POST /api/blogs - Create a new blog (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }


    const body = await req.json();
    const {
      title,
      content,
      featuredImage,
      isFeatured,
      isPremium,
      isPublished,
      categoryId, 
    } = body;

    

    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug is unique
    const existingBlog = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingBlog) {
      return NextResponse.json(
        { message: "Blog with this slug already exists" },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.blogCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Blog category not found" },
        { status: 404 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        featuredImage,
        categoryId,
        isFeatured: isFeatured || false,
        isPremium: isPremium || false,
        isPublished: isPublished || false,
        slug,  
      },
      include: {
        category: true, 
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("[BLOGS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}