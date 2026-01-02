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

    const profile = await socialMediaAPI.fetchProfile(platform, username);
    console.log(`API returning profile for ${username} on ${platform}:`, profile ? "Found" : "Null");
    return NextResponse.json({ profile });
  } catch (error: any) {
    console.error('Profile API Error:', error);
    
    // Check for 404 errors from the underlying API
    const isNotFound = error.message?.includes('404') || 
                      error.message?.toLowerCase().includes('not found') ||
                      error.response?.status === 404;
                      
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: isNotFound ? 404 : 500 }
    );
  }
}

