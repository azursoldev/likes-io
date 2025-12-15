import { NextRequest, NextResponse } from 'next/server';
import { bigPayMeAPI } from '@/lib/bigpayme-api';
import { prisma } from '@/lib/prisma';
import { japAPI } from '@/lib/jap-api';
import { emailService } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-bigpayme-signature') || '';
    const payload = await request.text();
    const event = JSON.parse(payload);

    // Verify webhook signature
    if (!bigPayMeAPI.verifyWebhook(signature, payload)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Handle webhook event
    const result = await bigPayMeAPI.handleWebhook(event);

    // Update payment and order
    const payment = await prisma.payment.findFirst({
      where: { transactionId: event.data.id },
      include: { order: true },
    });

    if (!payment) {
      console.error('Payment not found for transaction:', event.data.id);
      return NextResponse.json({ received: true });
    }

    // Update payment status
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: result.status === 'success' ? 'SUCCESS' : 'FAILED',
        webhookData: event as any,
      },
    });

    // If payment successful, create JAP order and update order status
    if (result.status === 'success') {
      const order = payment.order;
      
      if (order && order.serviceId && order.link) {
        try {
          // Get service to find JAP service ID
          const service = await prisma.service.findUnique({
            where: { id: order.serviceId },
          });

          if (service && service.japServiceId) {
            // Create order in JAP
            const japOrder = await japAPI.createOrder(
              service.japServiceId,
              order.link,
              order.quantity,
              order.platform
            );

            // Update order with JAP order ID
            await prisma.order.update({
              where: { id: order.id },
              data: {
                status: 'PROCESSING',
                japOrderId: japOrder.order.toString(),
                japStatus: japOrder.status,
              },
            });
          }
        } catch (error: any) {
          console.error('Failed to create JAP order:', error);
          // Order will remain in pending state, can be retried manually
        }
      }

      // Update order status
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: result.status === 'success' ? 'PROCESSING' : 'FAILED',
        },
      });

      // Send email notifications
      try {
        if (result.status === 'success') {
          await emailService.sendPaymentSuccess(payment.orderId);
        } else {
          await emailService.sendPaymentFailure(payment.orderId);
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail webhook if email fails
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

