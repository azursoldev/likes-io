import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { checkoutAPI } from '@/lib/checkout-api';
import { getCryptomusAPI } from '@/lib/cryptomus-api';
import { getMyFatoorahAPI } from '@/lib/myfatoorah-api';
import { Platform, ServiceType } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user exists in database
    const userId = session.user.id;
    if (!userId) {
      console.error('Session user ID is missing:', session);
      return NextResponse.json(
        { error: 'Invalid session. Please log in again.' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error(`User not found in database. Session user ID: ${userId}, Email: ${session.user.email}`);
      return NextResponse.json(
        { error: 'User account not found. Please log in again.' },
        { status: 401 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json(
        { error: 'Your account has been blocked. Please contact support.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      platform,
      serviceType,
      quantity,
      price,
      link,
      paymentMethod, // 'card' or 'crypto'
      currency = 'USD',
      serviceId, // Optional: serviceId from package data (database service ID)
      packageServiceId, // Optional: JAP Service ID from package (SMM Panel Integration)
    } = body;

    if (!platform || !serviceType || !quantity || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find service - first try by serviceId if provided, otherwise find by platform/serviceType
    let service = null;
    
    if (serviceId) {
      service = await prisma.service.findUnique({
        where: { id: serviceId },
      });
    }
    
    // If not found by serviceId, find by platform/serviceType
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
      const pricePerUnit = parseFloat(price) / parseInt(quantity);
      
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
        userId: user.id,
        serviceId: service.id,
        platform: platform.toUpperCase() as Platform,
        serviceType: serviceType.toUpperCase() as ServiceType,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        currency,
        status: 'PENDING_PAYMENT',
        link: link || null,
      },
    });

    // Create payment session based on payment method
    if (paymentMethod === 'crypto') {
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
          user.name || 'Customer',
          user.email,
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/success?orderId=${order.id}`,
          `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/checkout/error?orderId=${order.id}`
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

