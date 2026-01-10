import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use raw query to avoid client staleness issues
    let balance = 0;
    try {
      const rows: any = await prisma.$queryRaw`
        SELECT "walletBalance" FROM "User" WHERE "id" = ${session.user.id} LIMIT 1
      `;
      if (Array.isArray(rows) && rows.length > 0 && rows[0].walletBalance != null) {
        balance = Number(rows[0].walletBalance);
      }
    } catch (e) {
      // Fallback: attempt via prisma client
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { walletBalance: true }
      });
      balance = Number(user?.walletBalance || 0);
    }

    return NextResponse.json({ balance, currency: 'USD' });
  } catch (error: any) {
    console.error('Wallet balance error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch wallet balance' },
      { status: 500 }
    );
  }
}
