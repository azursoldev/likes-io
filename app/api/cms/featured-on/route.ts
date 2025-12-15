import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const brands = await prisma.featuredOn.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ brands });
  } catch (error: any) {
    console.error('Get featured on error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch featured brands' },
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
      brandName,
      logoUrl,
      link,
      displayOrder = 0,
      isActive = true,
    } = body;

    if (!brandName) {
      return NextResponse.json(
        { error: 'Brand name is required' },
        { status: 400 }
      );
    }

    const brand = await prisma.featuredOn.create({
      data: {
        brandName,
        logoUrl,
        link,
        displayOrder: parseInt(displayOrder),
        isActive,
      },
    });

    return NextResponse.json({ brand });
  } catch (error: any) {
    console.error('Create featured on error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create featured brand' },
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
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    if (updateData.displayOrder !== undefined) {
      updateData.displayOrder = parseInt(updateData.displayOrder);
    }

    const brand = await prisma.featuredOn.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ brand });
  } catch (error: any) {
    console.error('Update featured on error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update featured brand' },
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
        { error: 'Brand ID is required' },
        { status: 400 }
      );
    }

    await prisma.featuredOn.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete featured on error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete featured brand' },
      { status: 500 }
    );
  }
}

