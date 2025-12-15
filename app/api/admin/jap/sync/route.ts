import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { japAPI } from '@/lib/jap-api';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

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
    const platform = body.platform ? (body.platform.toUpperCase() as Platform) : undefined;

    // Fetch services from JAP
    const japServices = await japAPI.syncServices(platform);

    let syncedCount = 0;
    let updatedCount = 0;

    // Sync each service to database
    for (const japService of japServices) {
      try {
        // Map JAP service to our database format
        const platformMap: Record<string, Platform> = {
          'Instagram': 'INSTAGRAM',
          'TikTok': 'TIKTOK',
          'YouTube': 'YOUTUBE',
        };

        const serviceTypeMap: Record<string, ServiceType> = {
          'Likes': 'LIKES',
          'Followers': 'FOLLOWERS',
          'Views': 'VIEWS',
          'Subscribers': 'SUBSCRIBERS',
        };

        const dbPlatform = platformMap[japService.category] || platform;
        const dbServiceType = serviceTypeMap[japService.type] || 'LIKES';

        if (!dbPlatform) continue;

        const basePrice = parseFloat(japService.rate?.toString() || '0');
        const finalPrice = basePrice;

        // Try to find existing service
        const existing = await prisma.service.findFirst({
          where: {
            japServiceId: japService.id.toString(),
          },
        });

        if (existing) {
          // Update existing
          await prisma.service.update({
            where: { id: existing.id },
            data: {
              name: japService.name,
              basePrice,
              finalPrice,
              minQuantity: japService.min,
              maxQuantity: japService.max,
              isActive: japService.available,
            },
          });
          updatedCount++;
        } else {
          // Create new
          await prisma.service.create({
            data: {
              name: japService.name,
              platform: dbPlatform,
              serviceType: dbServiceType,
              japServiceId: japService.id.toString(),
              basePrice,
              markup: 0,
              finalPrice,
              minQuantity: japService.min,
              maxQuantity: japService.max,
              isActive: japService.available,
            },
          });
          syncedCount++;
        }
      } catch (error: any) {
        console.error(`Failed to sync service ${japService.id}:`, error.message);
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      updated: updatedCount,
      total: japServices.length,
    });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync services' },
      { status: 500 }
    );
  }
}

