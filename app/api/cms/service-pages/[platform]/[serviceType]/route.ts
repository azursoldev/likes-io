import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string; serviceType: string } }
) {
  try {
    const platform = params.platform.toUpperCase() as Platform;
    const serviceType = params.serviceType.toUpperCase() as ServiceType;

    const content = await prisma.servicePageContent.findUnique({
      where: {
        platform_serviceType: {
          platform,
          serviceType,
        },
      },
    });

    if (!content) {
      return NextResponse.json({
        heroTitle: `Buy ${params.serviceType} for ${params.platform}`,
        heroSubtitle: `Get real, high-quality ${params.serviceType} for your ${params.platform} account.`,
        packages: [],
        qualityCompare: null,
        howItWorks: null,
      });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Get service page content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch service page content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { platform: string; serviceType: string } }
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
    const platform = params.platform.toUpperCase() as Platform;
    const serviceType = params.serviceType.toUpperCase() as ServiceType;

    const {
      heroTitle,
      heroSubtitle,
      heroRating,
      heroReviewCount,
      packages,
      qualityCompare,
      howItWorks,
      isActive = true,
    } = body;

    const content = await prisma.servicePageContent.upsert({
      where: {
        platform_serviceType: {
          platform,
          serviceType,
        },
      },
      update: {
        heroTitle,
        heroSubtitle,
        heroRating,
        heroReviewCount,
        packages: packages as any,
        qualityCompare: qualityCompare as any,
        howItWorks: howItWorks as any,
        isActive,
      },
      create: {
        platform,
        serviceType,
        heroTitle,
        heroSubtitle,
        heroRating,
        heroReviewCount,
        packages: packages as any,
        qualityCompare: qualityCompare as any,
        howItWorks: howItWorks as any,
        isActive,
      },
    });

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Update service page content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update service page content' },
      { status: 500 }
    );
  }
}

