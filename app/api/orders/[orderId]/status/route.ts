import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Verify user owns order or is admin
    if (order.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

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

