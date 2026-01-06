import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const {
      code,
      type,
      value,
      status,
      startsAt,
      expiresAt,
      maxRedemptions,
      maxRedemptionsPerUser,
      minOrderAmount,
      applicableServices
    } = body;

    const now = new Date();

    await prisma.$executeRaw`
      UPDATE "coupons"
      SET 
        "code" = ${code},
        "type" = ${type}::"CouponType",
        "value" = ${parseFloat(value)},
        "status" = ${status}::"CouponStatus",
        "startsAt" = ${startsAt ? new Date(startsAt) : null},
        "expiresAt" = ${expiresAt ? new Date(expiresAt) : null},
        "maxRedemptions" = ${maxRedemptions ? parseInt(maxRedemptions) : null},
        "maxRedemptionsPerUser" = ${maxRedemptionsPerUser ? parseInt(maxRedemptionsPerUser) : null},
        "minOrderAmount" = ${minOrderAmount ? parseFloat(minOrderAmount) : null},
        "applicableServices" = ${applicableServices ? JSON.stringify(applicableServices) : null}::jsonb,
        "updatedAt" = ${now}
      WHERE "id" = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating coupon:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    await prisma.$executeRaw`
      DELETE FROM "coupons" WHERE "id" = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting coupon:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
