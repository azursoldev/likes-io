import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Add/Remove funds
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to access this resource' },
        { status: 401 }
      );
    }

    // Check if user is an admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { userId } = params;
    const body = await request.json();
    const { amount, type = 'CREDIT', note = 'Admin adjustment' } = body;

    if (!amount || isNaN(parseFloat(amount))) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    const amountValue = parseFloat(amount);

    if (amountValue <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate new balance
    let newBalance = user.walletBalance;
    if (type === 'CREDIT') {
      newBalance += amountValue;
    } else if (type === 'DEBIT') {
      newBalance -= amountValue;
      // Allow negative balance? Usually no, but admin might want to correct an error.
      // Let's prevent negative for now unless explicitly needed.
      if (newBalance < 0) {
        return NextResponse.json(
          { error: 'Insufficient funds for this deduction' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid transaction type' },
        { status: 400 }
      );
    }

    // Update user and create transaction
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { walletBalance: newBalance },
      }),
      prisma.walletTransaction.create({
        data: {
          userId: userId,
          amount: amountValue,
          type: type as 'CREDIT' | 'DEBIT',
          note: note,
          currency: 'USD',
        },
      }),
    ]);

    return NextResponse.json({
      message: 'Funds updated successfully',
      balance: updatedUser.walletBalance,
      transaction,
    });
  } catch (error: any) {
    console.error('Add funds error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add funds' },
      { status: 500 }
    );
  }
}
