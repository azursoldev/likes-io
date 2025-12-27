import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { approve } = body;

    // const testimonial = await prisma.testimonial.update({
    //   where: { id: parseInt(params.id) },
    //   data: { isApproved: approve !== false },
    // });
    const testimonial = { id: params.id, isApproved: approve !== false };

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error('Approve testimonial error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

