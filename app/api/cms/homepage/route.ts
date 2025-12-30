import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Get homepage content (public - no auth required)
export async function GET(request: NextRequest) {
  try {
    const homepageContent = await prisma.homepageContent.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    const response = NextResponse.json({
      content: homepageContent || null,
    });
    
    // Explicitly disable caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');
    
    return response;
  } catch (error: any) {
    console.error('Get homepage content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

// Update homepage content (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Please log in to access this resource' },
        { status: 401 }
      );
    }

    // Check if user is an admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      heroTitle, heroSubtitle, heroRating, heroReviewCount, heroCtaButtons,
      heroProfileHandle, heroProfileRole, heroProfileLikes, heroProfileFollowers, heroProfileEngagement, heroProfileImage,
      platformTitle, platformSubtitle, platformCards,
      whyChooseTitle, whyChooseSubtitle, benefits,
      influenceTitle, influenceSubtitle, influenceSteps, influenceImage,
      quickStartTitle, quickStartDescription1, quickStartDescription2, quickStartButtons,
      isActive 
    } = body;

    console.log('PATCH /api/cms/homepage body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!heroTitle || !heroSubtitle) {
      console.log('PATCH /api/cms/homepage: Missing required fields');
      return NextResponse.json(
        { error: 'Hero title and subtitle are required' },
        { status: 400 }
      );
    }

    // Find existing active content or create new
    let homepageContent = await prisma.homepageContent.findFirst({
      where: { isActive: true },
    });
    
    console.log('PATCH /api/cms/homepage: Existing content found:', homepageContent ? homepageContent.id : 'None');

    if (homepageContent) {
      // Update existing
      console.log('PATCH /api/cms/homepage: Updating existing record. ID:', homepageContent.id);
      console.log('PATCH /api/cms/homepage: New HeroProfileImage:', heroProfileImage);
      
      homepageContent = await prisma.homepageContent.update({
        where: { id: homepageContent.id },
        data: {
          heroTitle,
          heroSubtitle,
          heroRating: heroRating || null,
          heroReviewCount: heroReviewCount || null,
          heroCtaButtons: heroCtaButtons ? JSON.parse(JSON.stringify(heroCtaButtons)) : null,
          heroProfileHandle: heroProfileHandle || null,
          heroProfileRole: heroProfileRole || null,
          heroProfileLikes: heroProfileLikes || null,
          heroProfileFollowers: heroProfileFollowers || null,
          heroProfileEngagement: heroProfileEngagement || null,
          heroProfileImage: heroProfileImage || null,
          platformTitle: platformTitle || null,
          platformSubtitle: platformSubtitle || null,
          platformCards: platformCards ? JSON.parse(JSON.stringify(platformCards)) : null,
          whyChooseTitle: whyChooseTitle || null,
          whyChooseSubtitle: whyChooseSubtitle || null,
          benefits: benefits ? JSON.parse(JSON.stringify(benefits)) : null,
          influenceTitle: influenceTitle || null,
          influenceSubtitle: influenceSubtitle || null,
          influenceSteps: influenceSteps ? JSON.parse(JSON.stringify(influenceSteps)) : null,
          influenceImage: influenceImage || null,
          quickStartTitle: quickStartTitle || null,
          quickStartDescription1: quickStartDescription1 || null,
          quickStartDescription2: quickStartDescription2 || null,
          quickStartButtons: quickStartButtons ? JSON.parse(JSON.stringify(quickStartButtons)) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
      console.log('PATCH /api/cms/homepage: Update successful. New Image in DB:', homepageContent.heroProfileImage);
    } else {
      // Create new
      homepageContent = await prisma.homepageContent.create({
        data: {
          heroTitle,
          heroSubtitle,
          heroRating: heroRating || null,
          heroReviewCount: heroReviewCount || null,
          heroCtaButtons: heroCtaButtons ? JSON.parse(JSON.stringify(heroCtaButtons)) : null,
          heroProfileHandle: heroProfileHandle || null,
          heroProfileRole: heroProfileRole || null,
          heroProfileLikes: heroProfileLikes || null,
          heroProfileFollowers: heroProfileFollowers || null,
          heroProfileEngagement: heroProfileEngagement || null,
          heroProfileImage: heroProfileImage || null,
          platformTitle: platformTitle || null,
          platformSubtitle: platformSubtitle || null,
          platformCards: platformCards ? JSON.parse(JSON.stringify(platformCards)) : null,
          whyChooseTitle: whyChooseTitle || null,
          whyChooseSubtitle: whyChooseSubtitle || null,
          benefits: benefits ? JSON.parse(JSON.stringify(benefits)) : null,
          influenceTitle: influenceTitle || null,
          influenceSubtitle: influenceSubtitle || null,
          influenceSteps: influenceSteps ? JSON.parse(JSON.stringify(influenceSteps)) : null,
          influenceImage: influenceImage || null,
          quickStartTitle: quickStartTitle || null,
          quickStartDescription1: quickStartDescription1 || null,
          quickStartDescription2: quickStartDescription2 || null,
          quickStartButtons: quickStartButtons ? JSON.parse(JSON.stringify(quickStartButtons)) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    }

    // Purge cache for homepage and admin page
    revalidatePath('/');
    revalidatePath('/admin/homepage-content');

    return NextResponse.json({
      message: 'Homepage content updated successfully',
      content: homepageContent,
    });
  } catch (error: any) {
    console.error('Update homepage content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update homepage content' },
      { status: 500 }
    );
  }
}
