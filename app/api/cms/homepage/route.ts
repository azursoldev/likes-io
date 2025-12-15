import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const content = await prisma.homepageContent.findFirst({
      where: { isActive: true },
    });

    if (!content) {
      // Return default structure
      return NextResponse.json({
        heroTitle: 'Real Social Media Growth, Delivered Instantly!',
        heroSubtitle: 'Get real, high-quality likes, followers, and views to boost your social presence.',
        heroRating: '5.0',
        heroReviewCount: '1,442+ Reviews',
        heroCtaButtons: [
          { label: 'View Packages', href: '#packages' },
          { label: 'Free Likes Trial', href: '#trial' },
        ],
      });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Get homepage content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      heroTitle,
      heroSubtitle,
      heroRating,
      heroReviewCount,
      heroCtaButtons,
      isActive = true,
    } = body;

    // Get or create homepage content
    let content = await prisma.homepageContent.findFirst();

    if (content) {
      content = await prisma.homepageContent.update({
        where: { id: content.id },
        data: {
          heroTitle,
          heroSubtitle,
          heroRating,
          heroReviewCount,
          heroCtaButtons: heroCtaButtons as any,
          isActive,
        },
      });
    } else {
      content = await prisma.homepageContent.create({
        data: {
          heroTitle,
          heroSubtitle,
          heroRating,
          heroReviewCount,
          heroCtaButtons: heroCtaButtons as any,
          isActive,
        },
      });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Update homepage content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update homepage content' },
      { status: 500 }
    );
  }
}

