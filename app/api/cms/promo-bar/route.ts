import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const promoBar = await prisma.promoBar.findFirst({
      where: { isVisible: true },
    });

    if (!promoBar) {
      return NextResponse.json({
        messages: [
          'Limited Time: Double your YouTube Views on select packages today only!',
          'Boost Instagram reach with premium likes and followers.',
          'Grow TikTok faster with high-quality likes and views.',
        ],
        countdownSeconds: 20 * 3600 + 26 * 60 + 51,
        isVisible: true,
      });
    }

    return NextResponse.json(promoBar);
  } catch (error: any) {
    console.error('Get promo bar error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch promo bar' },
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
    const {
      messages,
      countdownSeconds,
      isVisible = true,
    } = body;

    let promoBar = await prisma.promoBar.findFirst();

    if (promoBar) {
      promoBar = await prisma.promoBar.update({
        where: { id: promoBar.id },
        data: {
          messages: messages as any,
          countdownSeconds: countdownSeconds ? parseInt(countdownSeconds) : null,
          isVisible,
        },
      });
    } else {
      promoBar = await prisma.promoBar.create({
        data: {
          messages: messages as any,
          countdownSeconds: countdownSeconds ? parseInt(countdownSeconds) : null,
          isVisible,
        },
      });
    }

    return NextResponse.json(promoBar);
  } catch (error: any) {
    console.error('Update promo bar error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update promo bar' },
      { status: 500 }
    );
  }
}

