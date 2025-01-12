import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import slugify from 'slugify';

// GET /api/blogs/[blogId] - Get a single blog
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const { blogId } = await context.params;

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        category: true,
      },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("[BLOG_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/blogs/[blogId] - Update a blog (Admin only)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { blogId } = await context.params;

    // Get the current blog first
    const currentBlog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!currentBlog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { title, content, featuredImage, isFeatured, blogCategoryId, isPublished, isPremium } = body;

    // Generate new slug if title is being updated
    let newSlug = currentBlog.slug;
    if (title) {
      newSlug = slugify(title, { lower: true, strict: true });

      // If slug is changing, check if new slug is unique
      if (newSlug !== currentBlog.slug) {
        const existingBlog = await prisma.blog.findFirst({
          where: { 
            AND: [
              { slug: newSlug },
              { id: { not: blogId } }
            ]
          },
        });
        if (existingBlog) {
          return NextResponse.json(
            { error: "Blog with similar title already exists" },
            { status: 400 }
          );
        }
      }

      // Check if title is unique
      const existingBlog = await prisma.blog.findFirst({
        where: {
          title,
          NOT: { id: currentBlog.id },
        },
      });

      if (existingBlog) {
        return NextResponse.json(
          { error: "Blog with this title already exists" },
          { status: 400 }
        );
      }
    }

    // const blog = await prisma.blog.update({
    //   where: { id: currentBlog.id },
    //   data: {
    //     title,
    //     content,
    //     featuredImage,
    //     blogCategoryId,
    //     isPublished,
    //     slug: newSlug,
    //   },
    //   include: {
    //     category: true,
    //     user: {
    //       select: {
    //         id: true,
    //         name: true,
    //         image: true,
    //       },
    //     },
    //     _count: {
    //       select: { comments: true },
    //     },
    //   },
    // });

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        title: title || undefined,
        slug: newSlug,
        content: content || undefined,
        featuredImage: featuredImage || undefined,
        categoryId: blogCategoryId || undefined,
        isPublished: isPublished || undefined,        
        isFeatured: isFeatured || undefined,
        isPremium: isPremium || undefined,
        
      },
      include: {
        category: true,
        // author: {
        //   select: {
        //     id: true,
        //     name: true,
        //     image: true,
        //   },
        // },
        
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("[BLOG_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/blogs/[blogId] - Delete a blog (Admin only)
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ blogId: string }> }
) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { blogId } = await context.params;

    await prisma.blog.delete({
      where: { id: blogId },
    });

    return NextResponse.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("[BLOG_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
