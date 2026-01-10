import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCryptomusAPI } from '@/lib/cryptomus-api';
import { japAPI } from '@/lib/jap-api';
import { recordCouponRedemption } from '@/lib/coupon-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const signature = request.headers.get('sign') || '';
    const merchant = request.headers.get('merchant') || '';

    // Get Cryptomus API instance to verify webhook
    const cryptomusAPI = await getCryptomusAPI();
    
    if (!cryptomusAPI) {
      console.error('Cryptomus API not configured');
      return NextResponse.json(
        { error: 'Cryptomus API not configured' },
        { status: 500 }
      );
    }

    // Verify webhook signature
    if (!cryptomusAPI.verifyWebhook(body, signature)) {
      console.error('Invalid Cryptomus webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const { order_id, payment_status, uuid, amount, currency } = body;

    if (!order_id) {
      console.error('Missing order_id in Cryptomus webhook');
      return NextResponse.json(
        { error: 'Missing order_id' },
        { status: 400 }
      );
    }

    // Find payment by transaction ID (uuid)
    const payment = await prisma.payment.findFirst({
      where: {
        transactionId: uuid,
        gateway: 'CRYPTOMUS',
      },
      include: {
        order: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!payment) {
      console.error(`Payment not found for Cryptomus transaction: ${uuid}`);
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    const order = payment.order;

    // Update payment status
    let paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' = 'PENDING';
    let orderStatus = order.status;

    if (payment_status === 'paid' || payment_status === 'paid_over') {
      paymentStatus = 'SUCCESS';
      orderStatus = 'PROCESSING';

      // Update payment
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: paymentStatus,
          amount: parseFloat(amount) || payment.amount,
          currency: currency || payment.currency,
        },
      });

      // Update order
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: orderStatus,
        },
      });

      // Record Coupon Redemption using data stored on payment at creation time
      const existingWebhookData = payment.webhookData as any || {};
      await recordCouponRedemption(payment.orderId, existingWebhookData, order.userId);

      // Create JAP order if service has japServiceId
      if (order.serviceId && order.link && order.service?.japServiceId) {
        try {
          const japOrder = await japAPI.createOrder(
            order.service.japServiceId,
            order.link,
            order.quantity
          );

          // Update order with JAP order ID
          await prisma.order.update({
            where: { id: order.id },
            data: {
              japOrderId: japOrder.order.toString(),
              japStatus: japOrder.status,
            },
          });
        } catch (error: any) {
          console.error('Failed to create JAP order after Cryptomus payment:', error);
          // Order will remain in processing state, can be retried manually
        }
      }
    } else if (payment_status === 'fail' || payment_status === 'cancel' || payment_status === 'system_fail') {
      paymentStatus = 'FAILED';
      orderStatus = 'FAILED';

      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: paymentStatus },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: { status: orderStatus },
      });
    } else {
      // Payment is still pending (wait, process, confirm_check)
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'PENDING' },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Cryptomus webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

