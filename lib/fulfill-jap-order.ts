import { prisma } from '@/lib/prisma';
import { japAPI } from '@/lib/jap-api';

/**
 * After payment succeeds, submit the order to the SMM panel when the service is mapped and a target link exists.
 * Failures are logged; order may stay PROCESSING without japOrderId for manual follow-up.
 */
export async function trySubmitOrderToJap(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { service: true },
  });

  if (!order) {
    console.error('[JAP] Order not found:', orderId);
    return;
  }

  if (!order.serviceId || !order.link) {
    console.warn(
      `[JAP] Order ${orderId}: skipped SMM submit (missing serviceId or link)`
    );
    return;
  }

  if (!order.service?.japServiceId) {
    console.warn(
      `[JAP] Order ${orderId}: skipped SMM submit — Service "${order.service?.name ?? order.serviceId}" has no japServiceId (map package to panel in admin)`
    );
    return;
  }

  try {
    const japOrder = await japAPI.createOrder(
      order.service.japServiceId,
      order.link,
      order.quantity
    );

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESSING',
        japOrderId: japOrder.order.toString(),
        japStatus: japOrder.status ?? null,
      },
    });
  } catch (err: unknown) {
    console.error(`[JAP] Order ${orderId}: SMM panel submit failed`, err);
  }
}
