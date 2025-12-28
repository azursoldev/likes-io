import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform')?.toUpperCase() as Platform | null;
    const approvedParam = searchParams.get('approved');
    const featuredParam = searchParams.get('featured');

    const where: any = {};
    if (platform) where.platform = platform;
    if (approvedParam !== null) where.isApproved = approvedParam === 'true';
    if (featuredParam !== null) where.isFeatured = featuredParam === 'true';

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ testimonials });
  } catch (error: any) {
    console.error('Get testimonials error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let session: any = null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      session = null;
    }

    if (process.env.NODE_ENV === 'production' && (!session || session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      handle,
      role = "Customer",
      text,
      rating,
      platform,
      serviceType,
      isApproved = false,
      isFeatured = false,
      displayOrder = 0,
    } = body;

    if (!handle || !text) {
      return NextResponse.json(
        { error: 'Handle and text are required' },
        { status: 400 }
      );
    }

    const normalizedRating =
      typeof rating === 'number' && !isNaN(rating)
        ? Math.round(rating)
        : typeof rating === 'string' && rating.trim() !== ''
          ? parseInt(rating, 10)
          : null;
    
    // Ensure normalizedRating is not NaN (parseInt can return NaN)
    const finalRating = normalizedRating !== null && isNaN(normalizedRating) ? 5 : (normalizedRating ?? 5);

    const normalizedDisplayOrder =
      typeof displayOrder === 'number' && !isNaN(displayOrder)
        ? displayOrder
        : typeof displayOrder === 'string' && displayOrder.trim() !== ''
          ? parseInt(displayOrder, 10)
          : 0;
    
    // Ensure normalizedDisplayOrder is not NaN
    const finalDisplayOrder = isNaN(normalizedDisplayOrder) ? 0 : normalizedDisplayOrder;

    const normalizedPlatform = platform ? (platform.toUpperCase() as Platform) : null;
    const normalizedServiceType = serviceType ? (serviceType.toUpperCase() as ServiceType) : null;
    const finalRole = role && typeof role === 'string' && role.trim() !== '' ? role : "Customer";

    let testimonial;
    try {
      testimonial = await prisma.testimonial.create({
        data: {
          handle,
          role: finalRole,
          text,
          rating: finalRating,
          platform: normalizedPlatform,
          serviceType: normalizedServiceType || undefined,
          isApproved,
          isFeatured,
          displayOrder: finalDisplayOrder,
        },
      });
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes("Can't reach database server")) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
      }
      throw err;
    }
    // const testimonial = { id: 'mock-id', handle, role: finalRole, text, rating: finalRating };

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error('Create testimonial error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    let session: any = null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      session = null;
    }

    if (process.env.NODE_ENV === 'production' && (!session || session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    if (updateData.platform) {
      updateData.platform = String(updateData.platform).toUpperCase();
    }
    if (updateData.serviceType) {
      updateData.serviceType = String(updateData.serviceType).toUpperCase();
    }
    if (updateData.displayOrder !== undefined) {
      const val = updateData.displayOrder;
      const parsed = typeof val === 'number' && !isNaN(val)
        ? val
        : typeof val === 'string' && val.trim() !== ''
          ? parseInt(val, 10)
          : 0;
      updateData.displayOrder = isNaN(parsed) ? 0 : parsed;
    }
    if (updateData.rating !== undefined) {
      const val = updateData.rating;
      const parsed = typeof val === 'number' && !isNaN(val)
        ? Math.round(val)
        : typeof val === 'string' && val.trim() !== ''
          ? parseInt(val, 10)
          : null;
      updateData.rating = (parsed !== null && isNaN(parsed)) ? null : parsed;
    }
    if (updateData.role !== undefined) {
       if (typeof updateData.role !== 'string' || updateData.role.trim() === '') {
          updateData.role = "Customer";
       }
    }

    let testimonial;
    try {
      testimonial = await prisma.testimonial.update({
        where: { id: id },
        data: updateData,
      });
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes("Can't reach database server")) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
      }
      throw err;
    }
    // const testimonial = { id: parseInt(id), ...updateData };

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error('Update testimonial error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let session: any = null;
    try {
      session = await getServerSession(authOptions);
    } catch (e) {
      session = null;
    }

    if (process.env.NODE_ENV === 'production' && (!session || session.user.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    try {
      await prisma.testimonial.delete({
        where: { id: id },
      });
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes("Can't reach database server")) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
      }
      throw err;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}

