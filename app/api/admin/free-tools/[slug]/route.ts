import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    let content = await prisma.freeToolPageContent.findUnique({
      where: { slug },
    });

    if (!content) {
      // Return default content if not found
      if (slug === 'free-instagram-likes') {
        content = await prisma.freeToolPageContent.create({
          data: {
            slug,
            heroTitle: "Get 50 Free Instagram Likes",
            heroDescription: "Experience our high-quality service for free. No password required. See real results in minutes and understand why thousands trust us for their growth.",
            rating: "4.9/5",
            reviewCount: "451+",
          },
        });
      } else if (slug === 'free-instagram-followers') {
        content = await prisma.freeToolPageContent.create({
          data: {
            slug,
            heroTitle: "Get 25 Free Instagram Followers",
            heroDescription: "Experience our high-quality service for free. No password required. See real results in minutes and understand why thousands trust us for their growth.",
            rating: "4.9/5",
            reviewCount: "512+",
          },
        });
      } else {
        return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
      }
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Get free tool content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slug = params.slug;
    const body = await request.json();
    const { 
      heroTitle, heroDescription, rating, reviewCount,
      step1Title, step1Description,
      step2Title, step2Description,
      step3Title, step3Description,
      inputLabel, inputPlaceholder,
      buttonText,
      assurance1, assurance2, assurance3
    } = body;

    const content = await prisma.freeToolPageContent.upsert({
      where: { slug },
      update: {
        heroTitle,
        heroDescription,
        rating,
        reviewCount,
        step1Title, step1Description,
        step2Title, step2Description,
        step3Title, step3Description,
        inputLabel, inputPlaceholder,
        buttonText,
        assurance1, assurance2, assurance3
      },
      create: {
        slug,
        heroTitle,
        heroDescription,
        rating,
        reviewCount,
        step1Title, step1Description,
        step2Title, step2Description,
        step3Title, step3Description,
        inputLabel, inputPlaceholder,
        buttonText,
        assurance1, assurance2, assurance3
      },
    });

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Update free tool content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update content' },
      { status: 500 }
    );
  }
}
