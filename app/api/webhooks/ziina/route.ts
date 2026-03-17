import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getZiinaAPI } from "@/lib/ziina-api";
import { applyZiinaPaymentStatus } from "@/lib/ziina-order-sync";
import type { PaymentGateway } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    console.log("[Ziina Webhook] Request received");

    const ziinaAPI = await getZiinaAPI();
    if (!ziinaAPI) {
      console.log("[Ziina Webhook] Ziina is not configured (no API key)");
      return NextResponse.json({ error: "Ziina is not configured" }, { status: 400 });
    }

    const signature = request.headers.get("x-hmac-signature") || "";
    const payload = await request.text();

    let event: { event?: string; data?: { id?: string; status?: string } };
    try {
      event = JSON.parse(payload);
    } catch (e) {
      console.error("[Ziina Webhook] Invalid JSON payload:", e);
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    console.log("[Ziina Webhook] Event:", event.event, "payment_intent id:", event.data?.id, "status:", event.data?.status);

    const settings = await prisma.adminSettings.findFirst();
    const webhookSecret = (settings as { ziinaWebhookSecret?: string | null } | null)?.ziinaWebhookSecret || undefined;

    if (webhookSecret && !ziinaAPI.verifyWebhookSignature(payload, webhookSecret, signature)) {
      console.error("[Ziina Webhook] Invalid signature (webhook secret is set)");
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
    }

    if (event.event !== "payment_intent.status.updated" || !event.data?.id) {
      console.log("[Ziina Webhook] Ignored event:", event.event, "or missing data.id");
      return NextResponse.json({ received: true, message: "Ignored event" });
    }

    const paymentIntentId = event.data.id;
    const status = (event.data.status || "").toLowerCase();
    console.log("[Ziina Webhook] Looking up payment by transactionId:", JSON.stringify(paymentIntentId), "type:", typeof paymentIntentId);

    let payment = await prisma.payment.findFirst({
      where: { transactionId: paymentIntentId, gateway: "ZIINA" as PaymentGateway },
      include: { order: true },
    });

    // Fallback: Ziina might send id in different format (e.g. with/without prefix)
    if (!payment) {
      const allZiinaPending = await prisma.payment.findMany({
        where: { gateway: "ZIINA" as PaymentGateway, status: "PENDING" },
        include: { order: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      });
      console.log("[Ziina Webhook] Exact match failed. Recent ZIINA PENDING payments transactionIds:", allZiinaPending.map((p) => p.transactionId));
      const idStr = String(paymentIntentId).trim();
      payment = allZiinaPending.find(
        (p) => p.transactionId === idStr || p.transactionId === paymentIntentId || (p.transactionId && (p.transactionId.endsWith(idStr) || idStr.endsWith(p.transactionId)))
      ) ?? null;
    }

    if (!payment) {
      console.error("[Ziina Webhook] Payment not found for intent id:", paymentIntentId, "- check transactionId in Payment table matches Ziina payment_intent id");
      return NextResponse.json({ received: true, message: "Payment not found" });
    }

    console.log("[Ziina Webhook] Found payment:", payment.id, "orderId:", payment.orderId, "current payment.status:", payment.status);

    const isSuccess = status === "completed";
    const newStatus = isSuccess ? "SUCCESS" : "FAILED";
    const existingWebhookData = (payment.webhookData as Record<string, unknown>) || {};

    if (payment.status !== newStatus) {
      console.log("[Ziina Webhook] Updating payment", payment.id, "to", newStatus, "and order", payment.orderId);
      const orderRel = (payment as { order?: { id: string; userId: string | null; serviceId: string; link: string | null; quantity: number } }).order
        ?? await prisma.order.findUnique({ where: { id: payment.orderId } });
      if (!orderRel) throw new Error("Order not found");
      await applyZiinaPaymentStatus(
        {
          ...payment,
          order: {
            id: orderRel.id,
            userId: orderRel.userId,
            serviceId: orderRel.serviceId,
            link: orderRel.link,
            quantity: orderRel.quantity,
          },
        },
        newStatus,
        { ...event, couponCode: existingWebhookData.couponCode ?? null, discountAmount: existingWebhookData.discountAmount ?? null }
      );
      console.log("[Ziina Webhook] Order", payment.orderId, "set to", newStatus === "SUCCESS" ? "PROCESSING" : "FAILED");
    } else {
      console.log("[Ziina Webhook] Payment status already", payment.status, "- no update needed");
    }

    console.log("[Ziina Webhook] Done, returning 200");
    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    console.error("[Ziina Webhook] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Webhook error" },
      { status: 500 }
    );
  }
}
