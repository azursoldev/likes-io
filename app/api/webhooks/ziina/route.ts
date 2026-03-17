import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getZiinaAPI } from "@/lib/ziina-api";
import { emailService } from "@/lib/email";
import { recordCouponRedemption } from "@/lib/coupon-utils";
import { japAPI } from "@/lib/jap-api";
import type { PaymentGateway } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const ziinaAPI = await getZiinaAPI();
    if (!ziinaAPI) {
      return NextResponse.json({ error: "Ziina is not configured" }, { status: 400 });
    }

    const signature = request.headers.get("x-hmac-signature") || "";
    const payload = await request.text();

    let event: { event?: string; data?: { id?: string; status?: string } };
    try {
      event = JSON.parse(payload);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const settings = await prisma.adminSettings.findFirst();
    const webhookSecret = (settings as { ziinaWebhookSecret?: string | null } | null)?.ziinaWebhookSecret || undefined;

    if (webhookSecret && !ziinaAPI.verifyWebhookSignature(payload, webhookSecret, signature)) {
      console.error("Ziina Webhook: Invalid signature");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    if (event.event !== "payment_intent.status.updated" || !event.data?.id) {
      return NextResponse.json({ received: true, message: "Ignored event" });
    }

    const paymentIntentId = event.data.id;
    const status = (event.data.status || "").toLowerCase();

    const payment = await prisma.payment.findFirst({
      where: { transactionId: paymentIntentId, gateway: "ZIINA" as PaymentGateway },
      include: { order: true },
    });

    if (!payment) {
      console.error("Ziina Webhook: Payment not found for intent", paymentIntentId);
      return NextResponse.json({ received: true, message: "Payment not found" });
    }

    const isSuccess = status === "completed";
    const newStatus = isSuccess ? "SUCCESS" : "FAILED";
    const existingWebhookData = (payment.webhookData as Record<string, unknown>) || {};

    if (payment.status !== newStatus) {
      const updatedWebhookData = {
        ...event,
        couponCode: existingWebhookData.couponCode ?? null,
        discountAmount: existingWebhookData.discountAmount ?? null,
      };
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          webhookData: updatedWebhookData as object,
        },
      });

      if (newStatus === "SUCCESS") {
        const order = (payment as { order?: { id: string; userId: string | null; serviceId: string; link: string | null; quantity: number } }).order
          ?? await prisma.order.findUnique({ where: { id: payment.orderId } });
        if (!order) throw new Error("Order not found");
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
            console.error("Failed to create JAP order:", err);
          }
        }

        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "PROCESSING" },
        });

        try {
          await emailService.sendPaymentSuccess(payment.orderId);
        } catch (e) {
          console.error("Email error:", e);
        }
      } else {
        await prisma.order.update({
          where: { id: payment.orderId },
          data: { status: "FAILED" },
        });
        try {
          await emailService.sendPaymentFailure(payment.orderId);
        } catch (e) {
          console.error("Email error:", e);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("Ziina webhook error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook error" },
      { status: 500 }
    );
  }
}
