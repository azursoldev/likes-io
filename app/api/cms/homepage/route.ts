import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Get homepage content (public - no auth required)
export async function GET(request: NextRequest) {
  try {
    const homepageContent = await prisma.homepageContent.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({
      content: homepageContent || null,
    });
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
    const { heroTitle, heroSubtitle, heroRating, heroReviewCount, heroCtaButtons, isActive } = body;

    // Validate required fields
    if (!heroTitle || !heroSubtitle) {
      return NextResponse.json(
        { error: 'Hero title and subtitle are required' },
        { status: 400 }
      );
    }

    // Find existing active content or create new
    let homepageContent = await prisma.homepageContent.findFirst({
      where: { isActive: true },
    });

    if (homepageContent) {
      // Update existing
      homepageContent = await prisma.homepageContent.update({
        where: { id: homepageContent.id },
        data: {
          heroTitle,
          heroSubtitle,
          heroRating: heroRating || null,
          heroReviewCount: heroReviewCount || null,
          heroCtaButtons: heroCtaButtons ? JSON.parse(JSON.stringify(heroCtaButtons)) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    } else {
      // Create new
      homepageContent = await prisma.homepageContent.create({
        data: {
          heroTitle,
          heroSubtitle,
          heroRating: heroRating || null,
          heroReviewCount: heroReviewCount || null,
          heroCtaButtons: heroCtaButtons ? JSON.parse(JSON.stringify(heroCtaButtons)) : null,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    }

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
