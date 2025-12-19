import { NextRequest, NextResponse } from 'next/server';

/**
 * Validate and fetch Instagram username information using RapidAPI
 * Supports multiple RapidAPI Instagram APIs:
 * - instagram-scraper-api (by apidash)
 * - instagram-looter2 (by apidash)
 * - instagram-scraper-2024 (by apidash)
 * 
 * Set RAPIDAPI_KEY in your .env.local file
 * Set RAPIDAPI_INSTAGRAM_HOST to the API host (e.g., 'instagram-scraper-api.p.rapidapi.com')
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

    // Use RapidAPI if configured
    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_INSTAGRAM_HOST || 'instagram-scraper-api.p.rapidapi.com';

    if (rapidApiKey) {
      try {
        // Try to fetch Instagram profile data from RapidAPI
        // Using instagram-scraper-api endpoint
        const rapidApiResponse = await fetch(
          `https://${rapidApiHost}/userinfo?username=${encodeURIComponent(cleanUsername)}`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': rapidApiKey,
              'X-RapidAPI-Host': rapidApiHost,
            },
          }
        );

        if (rapidApiResponse.ok) {
          const profileData = await rapidApiResponse.json();
          
          // Handle different response formats from different RapidAPI providers
          const isPrivate = profileData.is_private || profileData.isPrivate || false;
          const followerCount = profileData.follower_count || profileData.followers || profileData.followerCount || 0;
          const profilePic = profileData.profile_pic_url || profileData.profilePic || profileData.profile_pic_url_hd || '';
          const isVerified = profileData.is_verified || profileData.isVerified || false;
          const fullName = profileData.full_name || profileData.fullName || '';

          return NextResponse.json({
            valid: true,
            username: cleanUsername,
            exists: true,
            isPrivate,
            followerCount,
            profilePic,
            isVerified,
            fullName,
            message: 'Username found and validated',
          });
        } else if (rapidApiResponse.status === 404) {
          // User not found
          return NextResponse.json(
            {
              valid: false,
              error: 'Instagram account not found. Please check the username and try again.',
            },
            { status: 404 }
          );
        } else {
          // API error but username format is valid
          const errorData = await rapidApiResponse.json().catch(() => ({}));
          console.error('RapidAPI error:', errorData);
          
          // Fall back to format validation only
          return NextResponse.json({
            valid: true,
            username: cleanUsername,
            message: 'Username format is valid (unable to verify account existence)',
            warning: 'Could not verify account existence via API',
          });
        }
      } catch (rapidApiError: any) {
        console.error('RapidAPI request failed:', rapidApiError);
        // Fall back to format validation only
        return NextResponse.json({
          valid: true,
          username: cleanUsername,
          message: 'Username format is valid (API verification unavailable)',
          warning: 'Could not verify account existence via API',
        });
      }
    }

    // If RapidAPI is not configured, return format validation only
    return NextResponse.json({
      valid: true,
      username: cleanUsername,
      message: 'Username format is valid',
      note: 'Configure RAPIDAPI_KEY and RAPIDAPI_INSTAGRAM_HOST in .env.local to enable full account verification',
    });
  } catch (error: any) {
    console.error('Instagram username validation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate username' },
      { status: 500 }
    );
  }
}
