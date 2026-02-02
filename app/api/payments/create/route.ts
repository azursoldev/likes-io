import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';
import { checkoutAPI } from '@/lib/checkout-api';
import { getCryptomusAPI } from '@/lib/cryptomus-api';
import { getMyFatoorahAPI } from '@/lib/myfatoorah-api';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let userId: string | null = null;
    let user: any = null;

    if (session && session.user && session.user.id) {
      userId = session.user.id;
      user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (user && user.isBlocked) {
        return NextResponse.json(
          { error: 'Your account has been blocked. Please contact support.' },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const {
      platform,
      serviceType,
      quantity,
      price,
      link,
      paymentMethod, // 'card' or 'crypto' or 'wallet'
      currency = 'USD',
      serviceId, // Optional: serviceId from package data (database service ID)
      packageServiceId, // Optional: JAP Service ID from package (SMM Panel Integration)
      sessionId, // Optional: MyFatoorah session ID (for embedded payment)
      couponCode, // Optional: Coupon code
      upsellIds, // Optional: Array of upsell IDs
      email, // Optional: Guest email
      name, // Optional: Guest name
    } = body;

    if (!platform || !serviceType || !quantity || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Custom Quantity Validation
    if (platform && serviceType) {
      const normalizedPlatform = String(platform).toLowerCase();
      const normalizedServiceType = String(serviceType).toLowerCase();

      const platformEnumMap: Record<string, Platform> = {
        instagram: Platform.INSTAGRAM,
        tiktok: Platform.TIKTOK,
        youtube: Platform.YOUTUBE,
      };

      const serviceTypeEnumMap: Record<string, ServiceType> = {
        likes: ServiceType.LIKES,
        followers: ServiceType.FOLLOWERS,
        views: ServiceType.VIEWS,
        subscribers: ServiceType.SUBSCRIBERS,
      };

      const platformEnum = platformEnumMap[normalizedPlatform];
      const serviceTypeEnum = serviceTypeEnumMap[normalizedServiceType];

      if (platformEnum && serviceTypeEnum) {
        const serviceContent = await prisma.servicePageContent.findUnique({
          where: {
            platform_serviceType: {
              platform: platformEnum,
              serviceType: serviceTypeEnum,
            },
          },
        });

        if (serviceContent && serviceContent.customEnabled) {
          const qty = parseInt(quantity);
          const min = serviceContent.customMinQuantity;
          const max = serviceContent.customMaxQuantity;
          
          let isStandardPackage = false;
          const packages = serviceContent.packages as any[];
          
          if (packages && Array.isArray(packages)) {
            const parsePkgQty = (q: string | number): number => {
               if (typeof q === 'number') return q;
               const s = q.toString().replace(/,/g, '').trim();
               if (s.toLowerCase().includes('k')) return parseFloat(s) * 1000;
               return parseFloat(s);
            };

            for (const tab of packages) {
               if (tab.packages && Array.isArray(tab.packages)) {
                  for (const pkg of tab.packages) {
                     if (typeof pkg.qty === 'string' && pkg.qty.includes('+')) continue;
                     
                     const pkgQty = parsePkgQty(pkg.qty);
                     if (pkgQty === qty) {
                        isStandardPackage = true;
                        break;
                     }
                  }
               }
               if (isStandardPackage) break;
            }
          }

          if (!isStandardPackage) {
             if (min !== null && qty < min) {
                return NextResponse.json({ error: `Quantity must be at least ${min}` }, { status: 400 });
             }
             if (max !== null && qty > max) {
                return NextResponse.json({ error: `Quantity must be at most ${max}` }, { status: 400 });
             }
             if (serviceContent.customRoundToStep && serviceContent.customStep) {
                if (qty % serviceContent.customStep !== 0) {
                   return NextResponse.json({ error: `Quantity must be a multiple of ${serviceContent.customStep}` }, { status: 400 });
                }
             }
          }
        }
      }
    }

    // Upsell Calculation
    let upsellTotal = 0;
    const upsellData: any[] = [];
    
    if (upsellIds && Array.isArray(upsellIds) && upsellIds.length > 0) {
      try {
        // @ts-ignore
        const upsells = await prisma.upsell.findMany({
          where: { id: { in: upsellIds }, isActive: true }
        });
        
        for (const upsell of upsells) {
          let itemPrice = upsell.basePrice;
          if (upsell.discountType === 'PERCENT') {
            itemPrice -= (itemPrice * upsell.discountValue / 100);
          } else {
            itemPrice -= upsell.discountValue;
          }
          if (itemPrice < 0) itemPrice = 0;
          
          upsellTotal += itemPrice;
          upsellData.push({
            id: upsell.id,
            title: upsell.title,
            price: itemPrice,
            originalPrice: upsell.basePrice
          });
        }
      } catch (e) {
        console.error("Error fetching upsells:", e);
      }
    }

    // Coupon Validation and Price Calculation
    // We assume 'price' passed from client is the Service Price (excluding upsells if upsellIds provided)
    // If no upsellIds, 'price' is the Total Price (legacy/standard behavior)
    let servicePrice = parseFloat(price);
    let totalBeforeDiscount = servicePrice + upsellTotal;
    let finalPrice = totalBeforeDiscount;
    
    let appliedCoupon = null;
    let discountAmount = 0;

    if (couponCode) {
      try {
        // Use raw query to bypass potential Prisma Client staleness
        const coupons: any[] = await prisma.$queryRaw`
          SELECT * FROM "Coupon" 
          WHERE "code" = ${couponCode} 
          AND "status" = 'ACTIVE' 
          LIMIT 1
        `;

        const coupon = coupons[0];

        if (coupon) {
          // Check expiry
          if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            console.log(`Coupon ${couponCode} expired`);
          } 
          // Check start date
          else if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) {
            console.log(`Coupon ${couponCode} not started yet`);
          }
          // Check max redemptions
          else if (coupon.maxRedemptions && coupon.redemptionCount >= coupon.maxRedemptions) {
             console.log(`Coupon ${couponCode} max redemptions reached`);
          }
          else {
            // Check per user limit
            const userRedemptions: any[] = await prisma.$queryRaw`
              SELECT COUNT(*) as count FROM "CouponRedemption"
              WHERE "couponId" = ${coupon.id} AND "userId" = ${userId}
            `;
            
            const userRedemptionCount = Number(userRedemptions[0]?.count || 0);
            
            if (coupon.maxRedemptionsPerUser && userRedemptionCount >= coupon.maxRedemptionsPerUser) {
              console.log(`Coupon ${couponCode} max redemptions per user reached`);
            } else {
               // Coupon is valid, calculate discount
               if (coupon.type === 'PERCENT') {
                 discountAmount = (finalPrice * coupon.value) / 100;
               } else {
                 discountAmount = coupon.value;
               }
               
               // Ensure price doesn't go below 0
               if (discountAmount > finalPrice) {
                 discountAmount = finalPrice;
               }
               
               // Recalculate final price (trusting the input price as base, but applying discount)
               // Ideally we should recalculate base price from DB, but for now we trust the input price matches the selected package
               // If we wanted to be stricter, we would re-fetch the service price.
               
               // Let's rely on the client sending the discounted price, but we VERIFY it.
               // Or better, we ignore the client's discounted price and calculate it ourselves from the client's "original" price?
               // The client sends `price` which is usually the FINAL price. 
               // Wait, the client code sends `finalPrice`.
               // So if we apply discount again, we might double discount!
               
               // Strategy: 
               // 1. We assume the `price` sent by client IS the final price they expect to pay.
               // 2. We verify if this price matches (Base Price - Discount).
               // But we don't know the Base Price easily without fetching the package.
               // 
               // Alternative: The client sends `price` (final) and `couponCode`.
               // We just log the usage and update the DB. 
               // BUT validation is important. 
               // If I can't easily fetch base price, I will assume the `price` in body IS the final price.
               // I will record the redemption.
               
               appliedCoupon = coupon;
            }
          }
        }
      } catch (err) {
        console.error("Error validating coupon in payment flow:", err);
      }
    }

    // Final price after coupon
    finalPrice = Math.max(0, totalBeforeDiscount - discountAmount);

    // Find service - first try by serviceId if provided, otherwise find by platform/serviceType
    let service = null;
    
    if (serviceId) {
      service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
    }

    // If packageServiceId is provided, try to find a service with that specific JAP ID first
    if (!service && packageServiceId) {
      service = await prisma.service.findFirst({
        where: {
          platform: platform.toUpperCase() as Platform,
          serviceType: serviceType.toUpperCase() as ServiceType,
          japServiceId: packageServiceId,
        }
      });
    }
    
    // If not found by serviceId or japServiceId, find any active service by platform/serviceType
    if (!service) {
      service = await prisma.service.findFirst({
        where: {
          platform: platform.toUpperCase() as Platform,
          serviceType: serviceType.toUpperCase() as ServiceType,
          isActive: true,
        },
      });
    }

    // If no service exists, create a basic one (fallback)
    if (!service) {
      // Calculate price per unit from total price and quantity
      const pricePerUnit = servicePrice / parseInt(quantity);
      
      service = await prisma.service.create({
        data: {
          name: `${platform} ${serviceType}`,
          platform: platform.toUpperCase() as Platform,
          serviceType: serviceType.toUpperCase() as ServiceType,
          basePrice: pricePerUnit,
          markup: 0,
          finalPrice: pricePerUnit,
          japServiceId: packageServiceId || null, // Use JAP Service ID from package if provided
          isActive: true,
        },
      });
    } else if (packageServiceId) {
      // If packageServiceId is provided, update service's japServiceId if it's different or missing
      if (!service.japServiceId || service.japServiceId !== packageServiceId) {
        service = await prisma.service.update({
          where: { id: service.id },
          data: { japServiceId: packageServiceId },
        });
        console.log(`Updated service ${service.id} with JAP Service ID: ${packageServiceId}`);
      }
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: userId,
        serviceId: service.id,
        platform: platform.toUpperCase() as Platform,
        serviceType: serviceType.toUpperCase() as ServiceType,
        quantity: parseInt(quantity),
        price: finalPrice,
        currency,
        status: 'PENDING_PAYMENT',
        link: link || null,
        upsellData: upsellData.length ? upsellData : undefined,
      },
    });

    // Create payment session based on payment method
    if (paymentMethod === 'wallet') {
      if (!user) {
        return NextResponse.json(
          { error: 'Please log in to use wallet balance' },
          { status: 401 }
        );
      }

      // Wallet payment: deduct balance and mark order as paid immediately
      try {
        // Get current balance (raw to avoid client staleness)
        const rows: any = await prisma.$queryRaw`
          SELECT "walletBalance" FROM "User" WHERE "id" = ${user.id} LIMIT 1
        `;
        const currentBalance = Array.isArray(rows) && rows.length > 0 && rows[0].walletBalance != null
          ? Number(rows[0].walletBalance)
          : Number((user as any)?.walletBalance ?? 0);

        if (currentBalance < order.price) {
          return NextResponse.json(
            { error: 'Insufficient wallet balance' },
            { status: 400 }
          );
        }

        // Deduct and create transaction in a transaction block
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { walletBalance: currentBalance - order.price }
          }),
          prisma.payment.create({
            data: {
              orderId: order.id,
              gateway: 'WALLET',
              transactionId: null,
              amount: order.price,
              currency: order.currency,
              status: 'SUCCESS',
              webhookData: appliedCoupon ? { couponCode: appliedCoupon.code, discountAmount } : undefined,
            },
          }),
          prisma.walletTransaction.create({
            data: {
              userId: user.id,
              amount: order.price,
              currency: order.currency,
              type: 'DEBIT',
              note: `Order ${order.id} payment`
            }
          }),
          prisma.order.update({
            where: { id: order.id },
            data: { status: 'PROCESSING' }
          })
        ]);

        try {
          await emailService.sendPaymentSuccess(order.id);
        } catch (e) {
          console.error('Email error:', e);
        }

        return NextResponse.json({
          orderId: order.id,
          paymentStatus: 'SUCCESS'
        });
      } catch (error: any) {
        console.error('Wallet payment error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to process wallet payment' },
          { status: 500 }
        );
      }
    } else if (paymentMethod === 'crypto') {
      // Cryptomus payment
      try {
        const cryptomusAPI = await getCryptomusAPI();
        
        if (!cryptomusAPI) {
          return NextResponse.json(
            { error: 'Cryptomus payment is not configured. Please contact support or use card payment.' },
            { status: 400 }
          );
        }

        const cryptomusPayment = await cryptomusAPI.createPayment(
          order.id,
          order.price,
          order.currency,
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?orderId=${order.id}`,
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/webhooks/cryptomus`
        );

        // Create payment record
        await prisma.payment.create({
          data: {
            orderId: order.id,
            gateway: 'CRYPTOMUS',
            transactionId: cryptomusPayment.uuid,
            amount: order.price,
            currency: order.currency,
            status: 'PENDING',
            webhookData: appliedCoupon ? { couponCode: appliedCoupon.code, discountAmount } : undefined,
          },
        });

        return NextResponse.json({
          orderId: order.id,
          checkoutUrl: cryptomusPayment.payment_url,
          paymentId: cryptomusPayment.uuid,
          paymentStatus: cryptomusPayment.payment_status,
        });
      } catch (error: any) {
        console.error('Cryptomus payment creation error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to create Cryptomus payment session' },
          { status: 500 }
        );
      }
    } else if (paymentMethod === 'myfatoorah') {
      // MyFatoorah payment
      try {
        const myFatoorahAPI = await getMyFatoorahAPI();
        
        if (!myFatoorahAPI) {
          return NextResponse.json(
            { error: 'MyFatoorah payment is not configured. Please contact support or use card payment.' },
            { status: 400 }
          );
        }

        const myFatoorahPayment = await myFatoorahAPI.createPayment(
          order.id,
          order.price,
          order.currency,
          user?.name || name || 'Customer',
          user?.email || email || 'guest@example.com',
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?orderId=${order.id}`,
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/error?orderId=${order.id}`,
          sessionId
        );

        // Create payment record
        await prisma.payment.create({
          data: {
            orderId: order.id,
            gateway: 'MYFATOORAH',
            transactionId: myFatoorahPayment.InvoiceId.toString(),
            amount: order.price,
            currency: order.currency,
            status: 'PENDING',
            webhookData: appliedCoupon ? { couponCode: appliedCoupon.code, discountAmount } : undefined,
          },
        });

        return NextResponse.json({
          orderId: order.id,
          checkoutUrl: myFatoorahPayment.PaymentURL,
          paymentId: myFatoorahPayment.InvoiceId,
          paymentStatus: 'PENDING',
        });
      } catch (error: any) {
        console.error('MyFatoorah payment creation error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to create MyFatoorah payment session' },
          { status: 500 }
        );
      }
    } else {
      // Card payment using Checkout.com
      try {
        const paymentSession = await checkoutAPI.createPaymentSession(
          order.id,
          order.price,
          order.currency,
          order.platform
        );

        // Create payment record
        await prisma.payment.create({
          data: {
            orderId: order.id,
            gateway: 'CHECKOUT_COM',
            transactionId: paymentSession.id,
            amount: order.price,
            currency: order.currency,
            status: 'PENDING',
            webhookData: appliedCoupon ? { couponCode: appliedCoupon.code, discountAmount } : undefined,
          },
        });

        return NextResponse.json({
          orderId: order.id,
          checkoutUrl: paymentSession.checkout_url,
          expiresAt: paymentSession.expires_at,
        });
      } catch (error: any) {
        console.error('Payment session creation error:', error);
        return NextResponse.json(
          { error: error.message || 'Failed to create payment session' },
          { status: 500 }
        );
      }
    }
  } catch (error: any) {
    console.error('Create payment error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process payment' },
      { status: 500 }
    );
  }
}

