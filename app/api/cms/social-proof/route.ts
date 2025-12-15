import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform } from '@prisma/client';

export async function GET() {
  try {
    const socialProof = await prisma.socialProof.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      take: 10,
    });

    return NextResponse.json({ socialProof });
  } catch (error: any) {
    console.error('Get social proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch social proof' },
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
      item,
      time,
      platform,
      isActive = true,
      displayOrder = 0,
    } = body;

    if (!handle || !item || !time) {
      return NextResponse.json(
        { error: 'Handle, item, and time are required' },
        { status: 400 }
      );
    }

    const socialProof = await prisma.socialProof.create({
      data: {
        handle,
        item,
        time,
        platform: platform ? (platform.toUpperCase() as Platform) : null,
        isActive,
        displayOrder: parseInt(displayOrder),
      },
    });

    return NextResponse.json({ socialProof });
  } catch (error: any) {
    console.error('Create social proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create social proof' },
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
        { error: 'Social proof ID is required' },
        { status: 400 }
      );
    }

    if (updateData.platform) {
      updateData.platform = updateData.platform.toUpperCase();
    }
    if (updateData.displayOrder !== undefined) {
      updateData.displayOrder = parseInt(updateData.displayOrder);
    }

    const socialProof = await prisma.socialProof.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ socialProof });
  } catch (error: any) {
    console.error('Update social proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update social proof' },
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
        { error: 'Social proof ID is required' },
        { status: 400 }
      );
    }

    await prisma.socialProof.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete social proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete social proof' },
      { status: 500 }
    );
  }
}

