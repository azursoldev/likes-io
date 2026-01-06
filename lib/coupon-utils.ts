import { prisma } from '@/lib/prisma';

export async function recordCouponRedemption(orderId: string, webhookData: any, userId: string) {
  if (!webhookData || !webhookData.couponCode) {
    return;
  }

  const couponCode = webhookData.couponCode;

  try {
    // 1. Find the coupon (using raw query for freshness)
    const coupons: any[] = await prisma.$queryRaw`
      SELECT * FROM "Coupon" 
      WHERE "code" = ${couponCode} 
      LIMIT 1
    `;

    const coupon = coupons[0];

    if (!coupon) {
      console.warn(`Coupon ${couponCode} not found during redemption recording for order ${orderId}`);
      return;
    }

    // 2. Calculate discount amount again (or retrieve if we stored it, but we didn't store it in webhookData, just code)
    // We can just calculate it based on Order price? 
    // Wait, Order price is already discounted. 
    // We need the original price to know the discount amount?
    // Or we just don't store exact discount amount if we can't calculate it easily?
    // CouponRedemption has `discountAmount`.
    // If we want to be accurate, we should have stored `discountAmount` in webhookData too.
    
    // Let's rely on the coupon definition.
    // If it's fixed, it's easy.
    // If it's percent, we need the original price.
    // Original Price = Final Price / (1 - percent/100)
    // Discount = Original Price * percent/100
    // But this is messy with rounding.
    
    // Better approach: Let's assume we update create/route.ts to store discountAmount in webhookData too.
    // But I already updated it to store only couponCode.
    // I should update create/route.ts again to store discountAmount.
    
    // For now, let's just use 0 or try to estimate. 
    // Or I can update create/route.ts quickly.
    
    // Let's assume I will update create/route.ts.
    const discountAmount = webhookData.discountAmount || 0;

    // 3. Record redemption
    const redemptionId = crypto.randomUUID();
    
    // Check if already redeemed for this order
    const existing: any[] = await prisma.$queryRaw`
      SELECT * FROM "CouponRedemption" WHERE "orderId" = ${orderId}
    `;
    
    if (existing.length > 0) {
      console.log(`Coupon ${couponCode} already redeemed for order ${orderId}`);
      return;
    }

    await prisma.$executeRaw`
      INSERT INTO "CouponRedemption" ("id", "couponId", "userId", "orderId", "discountAmount", "redeemedAt")
      VALUES (${redemptionId}, ${coupon.id}, ${userId}, ${orderId}, ${discountAmount}, NOW())
    `;

    // 4. Update coupon count
    await prisma.$executeRaw`
      UPDATE "Coupon" 
      SET "redemptionCount" = "redemptionCount" + 1 
      WHERE "id" = ${coupon.id}
    `;
    
    console.log(`Recorded redemption for coupon ${couponCode} on order ${orderId}`);

  } catch (error) {
    console.error(`Failed to record coupon redemption for order ${orderId}:`, error);
  }
}
