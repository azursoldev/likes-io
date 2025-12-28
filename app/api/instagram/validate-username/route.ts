import { NextRequest, NextResponse } from 'next/server';
import { socialMediaAPI } from '@/lib/social-media-api';

/**
 * Validate and fetch Instagram username information using RapidAPI
 * Uses the shared socialMediaAPI service for consistency.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.trim().replace(/^@/, '');

    // Basic validation: Instagram usernames must be 1-30 characters, alphanumeric, periods, underscores
    const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
    
    if (!usernameRegex.test(cleanUsername)) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Invalid username format. Instagram usernames can only contain letters, numbers, periods, and underscores (1-30 characters).'
        },
        { status: 400 }
      );
    }

    // Check for reserved words (basic check)
    const reservedWords = ['admin', 'instagram', 'meta', 'facebook', 'about', 'explore', 'accounts', 'reels', 'shop'];
    if (reservedWords.includes(cleanUsername.toLowerCase())) {
      return NextResponse.json(
        {
          valid: false,
          error: 'This username is reserved and cannot be used.'
        },
        { status: 400 }
      );
    }

    try {
      // Use the shared service which has caching and centralized logic
      const profile = await socialMediaAPI.fetchProfile('INSTAGRAM', cleanUsername);
      
      return NextResponse.json({
        valid: true,
        username: profile.username,
        exists: true,
        isPrivate: profile.isPrivate,
        followerCount: profile.followerCount,
        profilePic: profile.profilePicture,
        isVerified: profile.isVerified,
        fullName: profile.fullName,
        message: 'Username found and validated',
      });
    } catch (error: any) {
      console.error("Validation error:", error.message);
      
      // Since we disabled mock data, any error means validation failed
      // (either user not found or API issue)
      return NextResponse.json({
        valid: false,
        error: 'Username not found or could not be validated.'
      });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
