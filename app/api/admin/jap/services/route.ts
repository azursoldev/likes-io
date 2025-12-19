import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { japAPI } from '@/lib/jap-api';
import { Platform } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');

    // Fetch services from JAP
    const japServices = await japAPI.syncServices(
      platform ? (platform.toUpperCase() as Platform) : undefined
    );

    return NextResponse.json({
      success: true,
      services: japServices,
      count: japServices.length,
    });
  } catch (error: any) {
    console.error('Get JAP services error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
