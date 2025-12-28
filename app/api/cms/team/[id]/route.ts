import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, role, description, twitterUrl, linkedinUrl, avatarUrl, displayOrder, isActive } = body;

    const member = await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        name,
        role,
        description,
        twitterUrl,
        linkedinUrl,
        avatarUrl,
        displayOrder,
        isActive,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.teamMember.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
