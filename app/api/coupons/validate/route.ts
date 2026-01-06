import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { code, orderAmount, serviceType, userId } = await req.json();

    if (!code) {
      return NextResponse.json(
        { valid: false, message: "Coupon code is required" },
        { status: 400 }
      );
    }

    // specific raw query to avoid prisma client type issues if not regenerated
    const coupons: any[] = await prisma.$queryRaw`
      SELECT * FROM "coupons" 
      WHERE LOWER("code") = LOWER(${code}) 
      AND "status" = 'ACTIVE'
      LIMIT 1
    `;

    const coupon = coupons[0];

    if (!coupon) {
      return NextResponse.json(
        { valid: false, message: "Invalid or expired coupon code" },
        { status: 200 } // Return 200 with valid: false to handle gracefully in frontend
      );
    }

    const now = new Date();

    // Check dates
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return NextResponse.json(
        { valid: false, message: "Coupon is not yet active" },
        { status: 200 }
      );
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return NextResponse.json(
        { valid: false, message: "Coupon has expired" },
        { status: 200 }
      );
    }

    // Check usage limits
    if (coupon.maxRedemptions !== null) {
      const redemptionsCount: any[] = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM "coupon_redemptions" WHERE "couponId" = ${coupon.id}
      `;
      const count = Number(redemptionsCount[0].count);
      
      if (count >= coupon.maxRedemptions) {
        return NextResponse.json(
          { valid: false, message: "Coupon usage limit reached" },
          { status: 200 }
        );
      }
    }

    // Check per-user usage limits
    if (coupon.maxRedemptionsPerUser !== null && userId) {
      const userRedemptionsCount: any[] = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM "coupon_redemptions" 
        WHERE "couponId" = ${coupon.id} AND "userId" = ${userId}
      `;
      const userCount = Number(userRedemptionsCount[0].count);

      if (userCount >= coupon.maxRedemptionsPerUser) {
        return NextResponse.json(
          { valid: false, message: "You have already used this coupon" },
          { status: 200 }
        );
      }
    }

    // Check minimum order amount
    if (coupon.minOrderAmount !== null && orderAmount !== undefined) {
      if (orderAmount < coupon.minOrderAmount) {
        return NextResponse.json(
          { 
            valid: false, 
            message: `Minimum order amount of ${coupon.minOrderAmount} required` 
          },
          { status: 200 }
        );
      }
    }

    // Check applicable services
    if (coupon.applicableServices && serviceType) {
        // Handle applicableServices JSON check if needed. 
        // For now assuming it matches if the array contains the serviceType
        // Parsing JSON manually since queryRaw returns it as object usually
        const services = typeof coupon.applicableServices === 'string' 
          ? JSON.parse(coupon.applicableServices) 
          : coupon.applicableServices;
          
        if (Array.isArray(services) && services.length > 0) {
           if (!services.includes(serviceType)) {
             return NextResponse.json(
               { valid: false, message: "Coupon not applicable for this service" },
               { status: 200 }
             );
           }
        }
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        currency: coupon.currency,
        minOrderAmount: coupon.minOrderAmount,
      },
      message: "Coupon applied successfully"
    });

  } catch (error: any) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { valid: false, message: "Error validating coupon" },
      { status: 500 }
    );
  }
}
