import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const platform = searchParams.get('platform')?.toUpperCase() as Platform | null;
    const serviceType = searchParams.get('serviceType')?.toUpperCase() as ServiceType | null;

    const where: any = { isActive: true };

    if (category) where.category = category;
    // if (platform) where.platform = platform;
    // if (serviceType) where.serviceType = serviceType;

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json({ faqs });
  } catch (error: any) {
    console.error('Get FAQs error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch FAQs' },
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
      question,
      answer,
      category,
      platform,
      serviceType,
      displayOrder = 0,
      isActive = true,
    } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category,
        // platform: platform ? (platform.toUpperCase() as Platform) : null,
        // serviceType: serviceType ? (serviceType.toUpperCase() as ServiceType) : null,
        displayOrder: parseInt(displayOrder),
        isActive,
      },
    });

    return NextResponse.json({ faq });
  } catch (error: any) {
    console.error('Create FAQ error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create FAQ' },
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
        { error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    if (updateData.platform) {
      updateData.platform = updateData.platform.toUpperCase();
    }
    if (updateData.serviceType) {
      updateData.serviceType = updateData.serviceType.toUpperCase();
    }
    if (updateData.displayOrder !== undefined) {
      updateData.displayOrder = parseInt(updateData.displayOrder);
    }

    const faq = await prisma.fAQ.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json({ faq });
  } catch (error: any) {
    console.error('Update FAQ error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update FAQ' },
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
        { error: 'FAQ ID is required' },
        { status: 400 }
      );
    }

    await prisma.fAQ.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete FAQ error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}

