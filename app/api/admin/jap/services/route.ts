import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform')?.toUpperCase() as Platform | null;
    const serviceType = searchParams.get('serviceType')?.toUpperCase() as ServiceType | null;

    const where: any = {};
    if (platform) where.platform = platform;
    if (serviceType) where.serviceType = serviceType;

    const services = await prisma.service.findMany({
      where,
      orderBy: [
        { platform: 'asc' },
        { serviceType: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ services });
  } catch (error: any) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      platform,
      serviceType,
      japServiceId,
      basePrice,
      markup = 0,
      minQuantity,
      maxQuantity,
      isActive = true,
    } = body;

    if (!name || !platform || !serviceType || !basePrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const finalPrice = basePrice + markup;

    const service = await prisma.service.create({
      data: {
        name,
        platform: platform.toUpperCase() as Platform,
        serviceType: serviceType.toUpperCase() as ServiceType,
        japServiceId,
        basePrice: parseFloat(basePrice),
        markup: parseFloat(markup),
        finalPrice,
        minQuantity: minQuantity ? parseInt(minQuantity) : null,
        maxQuantity: maxQuantity ? parseInt(maxQuantity) : null,
        isActive,
      },
    });

    return NextResponse.json({ service });
  } catch (error: any) {
    console.error('Create service error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create service' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Recalculate final price if basePrice or markup changed
    if (updateData.basePrice !== undefined || updateData.markup !== undefined) {
      const existing = await prisma.service.findUnique({ where: { id } });
      const basePrice = updateData.basePrice ?? existing?.basePrice ?? 0;
      const markup = updateData.markup ?? existing?.markup ?? 0;
      updateData.finalPrice = basePrice + markup;
    }

    const service = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ service });
  } catch (error: any) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    await prisma.service.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete service' },
      { status: 500 }
    );
  }
}

