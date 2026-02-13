import { japAPI } from '../jap-api';
import { prisma } from '../prisma';

export async function pollOrderStatuses() {
  try {
    // Get all processing orders
    const processingOrders = await prisma.order.findMany({
      where: {
        status: 'PROCESSING',
        japOrderId: {
          not: null,
        },
      },
      take: 100, // Limit to avoid overwhelming the API
    });

    console.log(`Polling ${processingOrders.length} orders...`);

    for (const order of processingOrders) {
      if (!order.japOrderId) continue;

      try {
        const status = await japAPI.getOrderStatus(order.japOrderId);

        // Update order status based on JAP status (Instruction 7)
        let newStatus = order.status;
        const panelStatus = status.status.toLowerCase();

        if (panelStatus === 'completed') {
          newStatus = 'COMPLETED';
        } else if (panelStatus === 'canceled' || panelStatus === 'cancelled') {
          newStatus = 'CANCELLED';
        } else if (panelStatus === 'failed') {
          newStatus = 'FAILED';
        } else if (panelStatus === 'in progress' || panelStatus === 'pending' || panelStatus === 'processing') {
          newStatus = 'PROCESSING';
        } else if (panelStatus === 'partial') {
          // Partial often means COMPLETED but with some issues, 
          // but for metrics we might want to treat it as COMPLETED if paid.
          newStatus = 'COMPLETED'; 
        }

        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: newStatus,
            japStatus: status.status,
          },
        });

        console.log(`Order ${order.id} status updated: ${newStatus}`);
      } catch (error: any) {
        console.error(`Failed to poll order ${order.id}:`, error.message);
        // Continue with other orders
      }
    }

    return { processed: processingOrders.length };
  } catch (error: any) {
    console.error('Order polling error:', error);
    throw error;
  }
}

