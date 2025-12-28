import { NextRequest, NextResponse } from 'next/server';
import { socialMediaAPI } from '@/lib/social-media-api';

export async function GET(request: NextRequest) {
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

    const result = await socialMediaAPI.fetchPosts('INSTAGRAM', username, cursor);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Instagram Posts API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
