import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType, Prisma } from '@prisma/client';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET: Fetch GetStartedContent based on query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const serviceType = searchParams.get('serviceType');
    const quality = searchParams.get('quality');

    if (!platform || !serviceType || !quality) {
      return NextResponse.json(
        { error: 'Missing required parameters: platform, serviceType, quality' },
        { status: 400 }
      );
    }

    const content = await prisma.getStartedContent.findUnique({
      where: {
        platform_packType_quality: {
          platform: platform.toUpperCase() as Platform,
          packType: serviceType.toUpperCase() as ServiceType,
          quality: quality.toLowerCase(),
        },
      },
    });

    if (!content) {
      // Return default structure if not found
      return NextResponse.json({
        features: [],
        explanation: '',
        pricing: null,
      });
    }

    return NextResponse.json({
      features: typeof content.features === 'string' ? JSON.parse(content.features) : content.features,
    explanation: content.explanation,
      heading: content.heading,
      explanationTitle: content.explanationTitle,
      pricing: content.pricing ? (typeof content.pricing === 'string' ? JSON.parse(content.pricing) : content.pricing) : null,
    });
  } catch (error: any) {
    console.error('Get GetStartedContent error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST: Update or Create GetStartedContent
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check auth
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { platform, serviceType, quality, features, explanation, pricing, heading, explanationTitle } = body;

    if (!platform || !serviceType || !quality) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const data = {
      platform: platform.toUpperCase() as Platform,
      packType: serviceType.toUpperCase() as ServiceType,
      quality: quality.toLowerCase(),
      features: features || [],
      explanation: explanation || '',
      heading: heading || null,
      explanationTitle: explanationTitle || null,
      pricing: pricing || Prisma.DbNull,
      isActive: true,
    };

    const content = await prisma.getStartedContent.upsert({
      where: {
        platform_packType_quality: {
          platform: data.platform,
          packType: data.packType,
          quality: data.quality,
        },
      },
      update: data,
      create: data,
    });

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Save GetStartedContent error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save content' },
      { status: 500 }
    );
  }
}
