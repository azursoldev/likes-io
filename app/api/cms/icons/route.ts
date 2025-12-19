import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where: any = {};
    if (category) where.category = category;

    const icons = await prisma.iconAsset.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    return NextResponse.json({ icons });
  } catch (error: any) {
    console.error('Get icons error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch icons' },
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
    const { name, category, url, alt, displayOrder, iconType, customText } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const icon = await prisma.iconAsset.create({
      data: {
        name,
        category: category || null,
        url: url || '',
        alt: alt || null,
        displayOrder: displayOrder || 0,
      },
    });

    return NextResponse.json({ icon });
  } catch (error: any) {
    console.error('Create icon error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create icon' },
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

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Icon id is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, category, url, alt, displayOrder } = body;

    const icon = await prisma.iconAsset.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(category !== undefined && { category: category || null }),
        ...(url !== undefined && { url }),
        ...(alt !== undefined && { alt: alt || null }),
        ...(displayOrder !== undefined && { displayOrder: displayOrder || 0 }),
      },
    });

    return NextResponse.json({ icon });
  } catch (error: any) {
    console.error('Update icon error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update icon' },
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
        { error: 'Icon id is required' },
        { status: 400 }
      );
    }

    await prisma.iconAsset.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete icon error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete icon' },
      { status: 500 }
    );
  }
}
