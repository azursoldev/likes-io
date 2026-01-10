import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform'); // e.g. YOUTUBE
    const serviceType = searchParams.get('serviceType'); // e.g. LIKES
    
    // Build where clause
    const where: any = {
      isActive: true,
    };

    if (platform) {
      where.platform = platform as Platform;
    }
    
    if (serviceType) {
      where.serviceType = serviceType as ServiceType;
    }

    // Try to use Prisma Client first
    try {
      // @ts-ignore - Prisma client might not be regenerated yet
      const upsells = await prisma.upsell.findMany({
        where,
        orderBy: {
          sortOrder: 'asc',
        },
      });
      return NextResponse.json({ upsells });
    } catch (e) {
      // Fallback to raw query if Prisma Client is not updated
      console.warn("Prisma client fetch failed, trying raw query", e);
      
      let query = `SELECT * FROM "Upsell" WHERE "isActive" = true`;
      const params: any[] = [];
      
      if (platform) {
        query += ` AND "platform" = $${params.length + 1}::"Platform"`;
        params.push(platform);
      }
      
      if (serviceType) {
        query += ` AND "serviceType" = $${params.length + 1}::"ServiceType"`;
        params.push(serviceType);
      }
      
      query += ` ORDER BY "sortOrder" ASC`;
      
      const upsells = await prisma.$queryRawUnsafe(query, ...params);
      return NextResponse.json({ upsells });
    }

  } catch (error: any) {
    console.error('Error fetching upsells:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch upsells' },
      { status: 500 }
    );
  }
}
