import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform')?.toUpperCase() as Platform | null;
    const isApproved = searchParams.get('approved') === 'true';
    const isFeatured = searchParams.get('featured') === 'true';

    const where: any = {};
    if (platform) where.platform = platform;
    if (isApproved !== null) where.isApproved = isApproved;
    if (isFeatured !== null) where.isFeatured = isFeatured;

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
      role,
      text,
      rating,
      platform,
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
      typeof rating === 'number'
        ? Math.round(rating)
        : typeof rating === 'string' && rating.trim() !== ''
          ? parseInt(rating, 10)
          : null;
    const normalizedDisplayOrder =
      typeof displayOrder === 'number'
        ? displayOrder
        : typeof displayOrder === 'string' && displayOrder.trim() !== ''
          ? parseInt(displayOrder, 10)
          : 0;
    const normalizedPlatform = platform ? (platform.toUpperCase() as Platform) : null;

    let testimonial;
    try {
      testimonial = await prisma.testimonial.create({
        data: {
          handle,
          role,
          text,
          rating: normalizedRating,
          platform: normalizedPlatform,
          isApproved,
          isFeatured,
          displayOrder: normalizedDisplayOrder,
        },
      });
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes("Can't reach database server")) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
      }
      throw err;
    }

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
    if (updateData.displayOrder !== undefined) {
      updateData.displayOrder =
        typeof updateData.displayOrder === 'number'
          ? updateData.displayOrder
          : typeof updateData.displayOrder === 'string' && updateData.displayOrder.trim() !== ''
            ? parseInt(updateData.displayOrder, 10)
            : 0;
    }
    if (updateData.rating !== undefined) {
      updateData.rating =
        typeof updateData.rating === 'number'
          ? Math.round(updateData.rating)
          : typeof updateData.rating === 'string' && updateData.rating.trim() !== ''
            ? parseInt(updateData.rating, 10)
            : null;
    }

    let testimonial;
    try {
      testimonial = await prisma.testimonial.update({
        where: { id: parseInt(id) },
        data: updateData,
      });
    } catch (err: any) {
      const msg = String(err?.message || '');
      if (msg.includes("Can't reach database server")) {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 });
      }
      throw err;
    }

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
        where: { id: parseInt(id) },
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

