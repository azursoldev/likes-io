import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
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

    // @ts-ignore
    const upsell = await prisma.upsell.update({
      where: { id },
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
        isActive,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    return NextResponse.json({ upsell });
  } catch (error) {
    console.error('Error updating upsell:', error);
    return NextResponse.json({ error: 'Failed to update upsell' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // @ts-ignore
    await prisma.upsell.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting upsell:', error);
    return NextResponse.json({ error: 'Failed to delete upsell' }, { status: 500 });
  }
}
