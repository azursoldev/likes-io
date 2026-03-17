import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getZiinaAPI } from "@/lib/ziina-api";
import { applyZiinaPaymentStatus } from "@/lib/ziina-order-sync";
import type { PaymentGateway } from "@prisma/client";

export const dynamic = "force-dynamic";

/**
 * GET /api/orders/[orderId]/sync-payment
 * For Ziina orders: fetches payment intent status from Ziina and updates our DB.
 * Call this when webhook isn't working (e.g. user returned to success page).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const ziinaAPI = await getZiinaAPI();
    if (!ziinaAPI) {
      return NextResponse.json({ error: "Ziina not configured" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!order.payment || order.payment.gateway !== ("ZIINA" as PaymentGateway)) {
      return NextResponse.json({ synced: false, message: "Not a Ziina order" });
    }

    const transactionId = order.payment.transactionId;
    if (!transactionId) {
      return NextResponse.json({ error: "No payment intent id on payment" }, { status: 400 });
    }

    const intent = await ziinaAPI.getPaymentIntent(transactionId);
    const status = (intent.status || "").toLowerCase();
    const isSuccess = status === "completed";
    const newStatus = isSuccess ? "SUCCESS" : "FAILED";

    if (order.payment.status === newStatus) {
      return NextResponse.json({ synced: true, message: "Already up to date", orderStatus: order.status });
    }

    const paymentWithOrder = await prisma.payment.findFirst({
      where: { id: order.payment.id },
      include: { order: true },
    });

    if (!paymentWithOrder?.order) {
      return NextResponse.json({ error: "Payment or order not found" }, { status: 500 });
    }

    await applyZiinaPaymentStatus(
      {
        ...paymentWithOrder,
        order: {
          id: paymentWithOrder.order.id,
          userId: paymentWithOrder.order.userId,
          serviceId: paymentWithOrder.order.serviceId,
          link: paymentWithOrder.order.link,
          quantity: paymentWithOrder.order.quantity,
        },
      },
      newStatus
    );

    const updated = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    return NextResponse.json({
      synced: true,
      ziinaStatus: intent.status,
      orderStatus: updated?.status ?? "PROCESSING",
    });
  } catch (error: unknown) {
    console.error("[Ziina sync-payment] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Sync failed" },
      { status: 500 }
    );
  }
}
