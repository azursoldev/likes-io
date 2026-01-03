import { NextRequest, NextResponse } from 'next/server';
import { socialMediaAPI } from '@/lib/social-media-api';
import { Platform } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const cursor = searchParams.get('cursor') || undefined;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
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

    const result = await socialMediaAPI.fetchPosts(platform, username, cursor);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Posts API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

