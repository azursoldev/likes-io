import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await prisma.socialProof.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error: any) {
    console.error('Get social proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch social proof items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { platform, username, service, timeText, notificationLabel } = body;

    if (!platform || !username || !service || !timeText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const item = await prisma.socialProof.create({
      data: {
        platform,
        username,
        service,
        timeText,
        notificationLabel: notificationLabel || "just purchased",
        displayOrder: 0, // Default, user can reorder if we add that feature
      },
    });

    return NextResponse.json(item);
  } catch (error: any) {
    console.error('Create social proof error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create social proof item' },
      { status: 500 }
    );
  }
}
