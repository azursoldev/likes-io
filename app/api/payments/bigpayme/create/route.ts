import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { bigPayMeAPI } from '@/lib/bigpayme-api';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order belongs to user
    if (order.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Create payment session
    const paymentSession = await bigPayMeAPI.createPaymentSession(
      orderId,
      order.price,
      order.currency,
      order.platform
    );

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: 'BIGPAYME',
        transactionId: paymentSession.id,
        amount: order.price,
        currency: order.currency,
        status: 'PENDING',
      },
    });

    return NextResponse.json({
      checkoutUrl: paymentSession.checkout_url,
      expiresAt: paymentSession.expires_at,
    });
  } catch (error: any) {
    console.error('Create payment session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment session' },
      { status: 500 }
    );
  }
}

