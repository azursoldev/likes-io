import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.bannerMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching banner messages:", error);
    return NextResponse.json({ error: "Failed to fetch banner messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = await prisma.bannerMessage.create({
      data: {
        text: body.text,
        icon: body.icon || "🔥",
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating banner message:", error);
    return NextResponse.json({ error: "Failed to create banner message" }, { status: 500 });
  }
}
