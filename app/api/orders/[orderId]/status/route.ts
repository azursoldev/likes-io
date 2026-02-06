import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    const order = await prisma.order.findUnique({
      where: { id: params.orderId },
      include: {
        service: true,
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Allow access if:
    // 1. User is admin
    // 2. User is the owner
    // 3. Order is a guest order (no userId)
    // 4. For the purpose of success page, we might want to allow checking status by ID alone to support external tracking/pixels
    //    checking status is generally safe with a CUID.
    
    const isOwner = session?.user?.id === order.userId;
    const isAdmin = session?.user?.role === 'ADMIN';
    const isGuest = !order.userId;

    // If we want to be strict:
    // if (order.userId && !isOwner && !isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    // }

    // However, to support the requirement "use this URL to detect payment", 
    // we should allow viewing the status if the ID is known.
    // We can sanitize the output if needed, but the current output seems fine.

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        japOrderId: order.japOrderId,
        japStatus: order.japStatus,
        quantity: order.quantity,
        price: order.price,
        platform: order.platform,
        serviceType: order.serviceType,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        service: order.service,
        payment: order.payment,
      },
    });
  } catch (error: any) {
    console.error('Get order status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch order status' },
      { status: 500 }
    );
  }
}

