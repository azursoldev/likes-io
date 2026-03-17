import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { recordCouponRedemption } from "@/lib/coupon-utils";
import { japAPI } from "@/lib/jap-api";

export interface OrderMinimal {
  id: string;
  userId: string | null;
  serviceId: string;
  link: string | null;
  quantity: number;
}

export interface PaymentWithOrder {
  id: string;
  orderId: string;
  webhookData: unknown;
  order: OrderMinimal;
}

/**
 * Apply Ziina payment status to our DB: update Payment + Order, run JAP and emails.
 * Used by webhook and by GET /payment_intent sync.
 */
export async function applyZiinaPaymentStatus(
  payment: PaymentWithOrder,
  newStatus: "SUCCESS" | "FAILED",
  webhookDataMerge?: object
): Promise<void> {
  const existingWebhookData = (payment.webhookData as Record<string, unknown>) || {};

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: newStatus,
      ...(webhookDataMerge && { webhookData: { ...existingWebhookData, ...webhookDataMerge } as object }),
    },
  });

  if (newStatus === "SUCCESS") {
    const order = payment.order;
    await recordCouponRedemption(payment.orderId, existingWebhookData, order.userId);

    if (order.serviceId && order.link) {
      try {
        const service = await prisma.service.findUnique({ where: { id: order.serviceId } });
        if (service?.japServiceId) {
          const japOrder = await japAPI.createOrder(
            service.japServiceId,
            order.link,
            order.quantity
          );
          await prisma.order.update({
            where: { id: order.id },
            data: {
              status: "PROCESSING",
              japOrderId: japOrder.order.toString(),
              japStatus: japOrder.status,
            },
          });
        }
      } catch (err: unknown) {
        console.error("[Ziina sync] JAP order error:", err);
      }
    }

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "PROCESSING" },
    });

    try {
      await emailService.sendPaymentSuccess(payment.orderId);
    } catch (e) {
      console.error("[Ziina sync] Email error:", e);
    }
  } else {
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { status: "FAILED" },
    });
    try {
      await emailService.sendPaymentFailure(payment.orderId);
    } catch (e) {
      console.error("[Ziina sync] Email error:", e);
    }
  }
}
