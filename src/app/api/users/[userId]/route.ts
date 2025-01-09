import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

// GET /api/users/[userId] - Get user profile
export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only allow users to view their own profile or admin to view any profile
    if (session.user.id !== params.userId && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        books: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
        _count: {
          select: {
            books: true,
            comments: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[userId] - Update user profile
export async function PATCH(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only allow users to update their own profile or admin to update any profile
    if (session.user.id !== params.userId && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email, password, image, role } = body;

    // Only admin can change roles
    if (role && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized to change role" },
        { status: 401 }
      );
    }

    // If email is being changed, check if it's already in use
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: { id: params.userId },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }

    const data: any = {
      ...(name && { name }),
      ...(email && { email }),
      ...(image && { image }),
      ...(role && { role }),
    };

    // Hash password if provided
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: params.userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        emailVerified: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[userId] - Delete user (Admin only)
export async function DELETE(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Prevent deleting the last admin
    if (session.user.id === params.userId) {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin user" },
          { status: 400 }
        );
      }
    }

    await prisma.user.delete({
      where: { id: params.userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
