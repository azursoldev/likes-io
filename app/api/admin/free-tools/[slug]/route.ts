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
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
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
      assurance1, assurance2, assurance3,
      faqs, reviews
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
        assurance1, assurance2, assurance3,
        faqs,
        reviews
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
        assurance1, assurance2, assurance3,
        faqs,
        reviews
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
