import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      console.error('No session found');
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to access this resource' },
        { status: 401 }
      );
    }

    // Check if user is an admin
    if (session.user.role !== 'ADMIN') {
      console.error('User is not an admin:', session.user.role);
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build where clause - exclude admin users
    const where: any = {
      role: { not: 'ADMIN' }, // Exclude admin users from the list
    };
    
    // Add search filter if provided
    if (search) {
      where.AND = [
        { role: { not: 'ADMIN' } }, // Always exclude admins
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
      // Remove the top-level role filter since it's now in AND
      delete where.role;
    }

    // Fetch users with order counts
    let users, totalCount;
    try {
      [users, totalCount] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            orders: {
              select: {
                id: true,
                price: true,
                currency: true,
                status: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      throw new Error(`Database error: ${dbError.message || 'Failed to query users'}`);
    }

    // Transform users to match the expected format
    const transformedUsers = users.map((user) => {
      // Calculate order count
      const ordersCount = user.orders.length;
      
      // Calculate wallet balance from completed orders
      // Note: This is a simplified calculation. You may want to add a proper wallet/balance field to the User model
      const completedOrders = user.orders.filter(
        (order) => order.status === 'COMPLETED'
      );
      const walletBalance = completedOrders.reduce(
        (sum, order) => sum + order.price,
        0
      );

      return {
        id: user.id,
        name: user.name || 'Unknown',
        email: user.email,
        joined: user.createdAt.toISOString().split('T')[0],
        orders: ordersCount,
        wallet: `$${walletBalance.toFixed(2)}`,
        status: user.isBlocked ? ('inactive' as const) : ('active' as const),
      };
    });

    return NextResponse.json({
      users: transformedUsers,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

