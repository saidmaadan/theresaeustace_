import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import slugify from 'slugify';

// GET /api/books - Get all books
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const isFree = searchParams.get("isFree") === "true";
    const isPremium = searchParams.get("isPremium") === "true";
    const isFeatured = searchParams.get("isFeatured") === "true";

    const skip = (page - 1) * limit;

    const where = {
      isPublished: true,
      ...(category && { categoryId: category }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(isFree && { isFree: true }),
      ...(isPremium && { isPremium: true }),
      ...(isFeatured && { isFeatured: true }),
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: { 
              comments: true,
              users: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.book.count({ where }),
    ]);

    return NextResponse.json({
      books,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("[BOOKS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/books - Create a new book (Admin only)
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
      description,
      price,
      amazonLink,
      coverImage,
      bookFile,
      audioFile,
      isFree,
      isPremium,
      isFeatured,
      isPublished,
      categoryId,
    } = body;
    
    // Generate slug from title
    const slug = slugify(title, { lower: true, strict: true });

    // Check if slug is unique
    const existingBook = await prisma.book.findUnique({
      where: { slug },
    });

    if (existingBook) {
      return NextResponse.json(
        { error: "Book with similar title already exists" },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Book category not found" },
        { status: 404 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        slug,
        description,
        price,
        amazonLink,
        coverImage,
        bookFile,
        audioFile,
        isFree: isFree || false,
        isPremium: isPremium || false,
        isFeatured: isFeatured || false,
        isPublished: isPublished || false,
        categoryId,
      },
      include: {
        category: true,
        _count: {
          select: { comments: true },
        },
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error("[BOOKS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
