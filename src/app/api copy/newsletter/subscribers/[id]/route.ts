import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { isActive } = await req.json();

    const subscriber = await prisma.newsletter.update({
      where: { id: params.id },
      data: { isActive },
    });

    return NextResponse.json(subscriber);
  } catch (error) {
    console.error("[NEWSLETTER_SUBSCRIBER_PATCH]", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to update subscriber",
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const session = await auth();

    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.newsletter.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[NEWSLETTER_SUBSCRIBER_DELETE]", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to delete subscriber",
      }),
      { status: 500 }
    );
  }
}
