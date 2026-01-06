import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // @ts-ignore
    const upsells = await prisma.upsell.findMany({
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ upsells });
  } catch (error) {
    console.error('Error fetching admin upsells:', error);
    return NextResponse.json({ error: 'Failed to fetch upsells' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      serviceId,
      packageId,
      basePrice,
      discountType,
      discountValue,
      badgeText,
      badgeColor,
      badgeIcon,
      platform,
      serviceType,
      minSubtotal,
      isActive,
      sortOrder
    } = body;

    // Validation
    if (!title || basePrice === undefined || discountValue === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // @ts-ignore
    const upsell = await prisma.upsell.create({
      data: {
        title,
        description,
        serviceId,
        packageId,
        basePrice: parseFloat(basePrice),
        discountType,
        discountValue: parseFloat(discountValue),
        badgeText,
        badgeColor,
        badgeIcon,
        platform: platform || null,
        serviceType: serviceType || null,
        minSubtotal: minSubtotal ? parseFloat(minSubtotal) : null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    return NextResponse.json({ upsell });
  } catch (error) {
    console.error('Error creating upsell:', error);
    return NextResponse.json({ error: 'Failed to create upsell' }, { status: 500 });
  }
}
