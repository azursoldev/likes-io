import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { japAPI } from '@/lib/jap-api';
import { getMyFatoorahAPI } from '@/lib/myfatoorah-api';
import { emailService } from '@/lib/email';
import { recordCouponRedemption } from '@/lib/coupon-utils';

export async function POST(request: NextRequest) {
  try {
    const myFatoorahAPI = await getMyFatoorahAPI();
    if (!myFatoorahAPI) {
      return NextResponse.json({ error: 'MyFatoorah is not configured' }, { status: 400 });
    }

    const signature = request.headers.get('myfatoorah-signature') || '';
    const payload = await request.text();
    
    let event;
    try {
        event = JSON.parse(payload);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Get secret from settings
    let webhookSecret: string | undefined;
    try {
        const settings = await prisma.adminSettings.findFirst();
        webhookSecret = settings?.myFatoorahWebhookSecret || undefined;
    } catch (e) {
        console.error('Failed to fetch settings:', e);
    }

    // Verify webhook signature
    // Note: If secret is not configured, we can't verify, so we should reject (or log warning)
    if (!webhookSecret) {
       console.error('MyFatoorah Webhook Error: Webhook Secret not configured in Admin Settings');
       return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
    }

    if (!myFatoorahAPI.verifyWebhookSignature(signature, payload, webhookSecret)) {
       console.error('MyFatoorah Webhook Signature Verification Failed');
       return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    console.log('MyFatoorah Webhook Received:', event);

    // MyFatoorah V2 EventType 1 = Transaction Status Changed
    // We can also just check if Data exists
    const data = event.Data;
    
    if (!data || !data.InvoiceId) {
        return NextResponse.json({ received: true, message: 'No InvoiceId found' });
    }

    const invoiceId = data.InvoiceId.toString();
    // Check status. "Success" is the standard success status.
    const isSuccess = data.TransactionStatus === 'Success';

    // Find payment by transactionId (InvoiceId)
    const payment = await prisma.payment.findFirst({
      where: { transactionId: invoiceId },
      include: { order: true },
    });

    if (!payment) {
      console.error('Payment not found for InvoiceId:', invoiceId);
      // Return 200 to acknowledge receipt even if we can't process it (to stop retries)
      return NextResponse.json({ received: true, message: 'Payment not found' });
    }

    // Determine new status
    const newStatus = isSuccess ? 'SUCCESS' : 'FAILED';
    
    const existingWebhookData = payment.webhookData as any || {};

    // Only update if status changed
    if (payment.status !== newStatus) {
        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: newStatus,
                webhookData: { ...(event as any), couponCode: existingWebhookData.couponCode, discountAmount: existingWebhookData.discountAmount },
            },
        });

        // If payment successful, process order
        if (newStatus === 'SUCCESS') {
            const order = payment.order;
            
            // Record Coupon Redemption
            await recordCouponRedemption(payment.orderId, existingWebhookData, order.userId);
            
             if (order && order.serviceId && order.link) {
                try {
                  const service = await prisma.service.findUnique({
                    where: { id: order.serviceId },
                  });

                  if (service && service.japServiceId) {
                    const japOrder = await japAPI.createOrder(
                      service.japServiceId,
                      order.link,
                      order.quantity
                    );

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
                }
             }
             
            // Update order status (if not already handled by JAP logic above)
            // Ensure order status is PROCESSING even if JAP fails (manual intervention needed)
            await prisma.order.update({
                where: { id: payment.orderId },
                data: {
                  status: 'PROCESSING',
                },
            });

             // Send email
             try {
                await emailService.sendPaymentSuccess(payment.orderId);
             } catch (e) {
                console.error('Email error:', e);
             }
        } else {
             // Payment failed
              await prisma.order.update({
                where: { id: payment.orderId },
                data: {
                  status: 'FAILED',
                },
            });
            try {
                await emailService.sendPaymentFailure(payment.orderId);
             } catch (e) {
                console.error('Email error:', e);
             }
        }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('MyFatoorah webhook error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
