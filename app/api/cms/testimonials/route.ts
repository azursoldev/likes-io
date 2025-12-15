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
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
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

    const testimonial = await prisma.testimonial.create({
      data: {
        handle,
        role,
        text,
        rating: rating ? parseInt(rating) : null,
        platform: platform ? (platform.toUpperCase() as Platform) : null,
        isApproved,
        isFeatured,
        displayOrder: parseInt(displayOrder),
      },
    });

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
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    if (updateData.platform) {
      updateData.platform = updateData.platform.toUpperCase();
    }
    if (updateData.displayOrder !== undefined) {
      updateData.displayOrder = parseInt(updateData.displayOrder);
    }
    if (updateData.rating !== undefined) {
      updateData.rating = updateData.rating ? parseInt(updateData.rating) : null;
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

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
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    await prisma.testimonial.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete testimonial error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}

