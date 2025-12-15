import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform')?.toUpperCase() as Platform | null;
    const status = searchParams.get('status');
    const isAdmin = session.user.role === 'ADMIN';

    const where: any = {};
    
    // Non-admin users can only see their own orders
    if (!isAdmin) {
      where.userId = session.user.id;
    }

    if (platform) {
      where.platform = platform;
    }

    if (status) {
      where.status = status.toUpperCase();
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        service: true,
        payment: true,
        user: isAdmin ? {
          select: {
            id: true,
            email: true,
            name: true,
          },
        } : false,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Get orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      serviceId,
      platform,
      serviceType,
      quantity,
      link,
    } = body;

    if (!serviceId || !platform || !serviceType || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service to calculate price
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    if (!service.isActive) {
      return NextResponse.json(
        { error: 'Service is not available' },
        { status: 400 }
      );
    }

    // Validate quantity
    if (service.minQuantity && quantity < service.minQuantity) {
      return NextResponse.json(
        { error: `Minimum quantity is ${service.minQuantity}` },
        { status: 400 }
      );
    }

    if (service.maxQuantity && quantity > service.maxQuantity) {
      return NextResponse.json(
        { error: `Maximum quantity is ${service.maxQuantity}` },
        { status: 400 }
      );
    }

    // Calculate price
    const price = service.finalPrice * quantity;

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        serviceId: service.id,
        platform: platform.toUpperCase() as Platform,
        serviceType: serviceType.toUpperCase() as ServiceType,
        quantity: parseInt(quantity),
        price,
        currency: 'USD', // TODO: Get from user preferences or settings
        status: 'PENDING_PAYMENT',
        link: link || null,
      },
      include: {
        service: true,
      },
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

