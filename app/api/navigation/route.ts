import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const services = await prisma.servicePageContent.findMany({
      where: {
        isActive: true,
      },
      select: {
        platform: true,
        serviceType: true,
        slug: true,
      },
    });

    // Create a lookup map: `${platform}-${serviceType}` -> slug
    const serviceMap: Record<string, string> = {};
    
    services.forEach((service) => {
      const key = `${service.platform.toLowerCase()}-${service.serviceType.toLowerCase()}`;
      if (service.slug) {
        serviceMap[key] = service.slug;
      }
    });

    return NextResponse.json({ serviceMap });
  } catch (error) {
    console.error('Failed to fetch navigation data:', error);
    return NextResponse.json({ error: 'Failed to fetch navigation data' }, { status: 500 });
  }
}
