import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const message = await prisma.bannerMessage.update({
      where: { id },
      data: {
        text: body.text,
        icon: body.icon,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating banner message:", error);
    return NextResponse.json({ error: "Failed to update banner message" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.bannerMessage.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting banner message:", error);
    return NextResponse.json({ error: "Failed to delete banner message" }, { status: 500 });
  }
}
