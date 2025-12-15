import { NextRequest, NextResponse } from 'next/server';
import { socialMediaAPI } from '@/lib/social-media-api';
import { Platform } from '@prisma/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const platform = params.platform.toUpperCase() as Platform;
    
    if (!['INSTAGRAM', 'TIKTOK', 'YOUTUBE'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be instagram, tiktok, or youtube' },
        { status: 400 }
      );
    }

    const validation = await socialMediaAPI.validateUrl(platform, url);

    return NextResponse.json(validation);
  } catch (error: any) {
    console.error('Validation API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate URL' },
      { status: 500 }
    );
  }
}

