import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { platform, username, service, timeText, notificationLabel } = body;

    const item = await prisma.socialProof.update({
      where: { id: params.id },
      data: {
        platform,
        username,
        service,
        timeText,
        notificationLabel,
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Update social proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update social proof item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.socialProof.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete social proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete social proof item' },
      { status: 500 }
    );
  }
}
