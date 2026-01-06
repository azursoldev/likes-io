import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Using raw query to bypass potential Prisma Client outdated types
    const coupons = await prisma.$queryRaw`
      SELECT * FROM "coupons" ORDER BY "createdAt" DESC
    `;

    return NextResponse.json(coupons);
  } catch (error: any) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    if (!code || !type || value === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate ID manually since we are using raw query insert (Postgres doesn't auto-generate string IDs like cuid() in raw SQL easily without extensions, 
    // but Prisma usually handles it. Here we can let Postgres generate if default is set, 
    // but raw insert doesn't use Prisma default logic. 
    // Better to use Prisma Client if possible, but fallback to raw:
    // We'll use crypto.randomUUID() for ID.
    const id = crypto.randomUUID();
    const now = new Date();

    await prisma.$executeRaw`
      INSERT INTO "coupons" (
        "id", "code", "type", "value", "currency", "status", 
        "startsAt", "expiresAt", "maxRedemptions", "maxRedemptionsPerUser", 
        "minOrderAmount", "applicableServices", "createdAt", "updatedAt"
      ) VALUES (
        ${id}, ${code}, ${type}::"CouponType", ${parseFloat(value)}, 'USD', ${status}::"CouponStatus",
        ${startsAt ? new Date(startsAt) : null}, ${expiresAt ? new Date(expiresAt) : null}, 
        ${maxRedemptions ? parseInt(maxRedemptions) : null}, 
        ${maxRedemptionsPerUser ? parseInt(maxRedemptionsPerUser) : null}, 
        ${minOrderAmount ? parseFloat(minOrderAmount) : null}, 
        ${applicableServices ? JSON.stringify(applicableServices) : null}::jsonb,
        ${now}, ${now}
      )
    `;

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    if (error.code === 'P2010' || error.message?.includes('unique constraint')) {
        return NextResponse.json(
            { error: "Coupon code already exists" },
            { status: 409 }
        );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}
