import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { Platform, ServiceType } from '@prisma/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string; serviceType: string } }
) {
  try {
    const platform = params.platform.toUpperCase() as Platform;
    const serviceType = params.serviceType.toUpperCase() as ServiceType;

    const content = await prisma.servicePageContent.findUnique({
      where: {
        platform_serviceType: {
          platform,
          serviceType,
        },
      },
    });

    if (!content) {
      return NextResponse.json({
        heroTitle: `Buy ${params.serviceType} for ${params.platform}`,
        heroSubtitle: `Get real, high-quality ${params.serviceType} for your ${params.platform} account.`,
        assuranceCardText: "Join over a million satisfied customers, including artists, companies, and top influencers. Our services are 100% discreet, secure, and delivered naturally to ensure your account is always safe.",
        packages: [],
        qualityCompare: null,
        howItWorks: null,
        faqs: [],
      });
    }

    // Parse JSON fields
    const responseData: any = {
      ...content,
      // Explicitly include assuranceCardText (may be undefined if column doesn't exist)
      assuranceCardText: (content as any).assuranceCardText || null,
      packages: typeof content.packages === 'string' ? JSON.parse(content.packages) : content.packages,
      qualityCompare: content.qualityCompare ? (typeof content.qualityCompare === 'string' ? JSON.parse(content.qualityCompare) : content.qualityCompare) : null,
      howItWorks: content.howItWorks ? (typeof content.howItWorks === 'string' ? JSON.parse(content.howItWorks) : content.howItWorks) : null,
    };
    
    // Fetch FAQs if they exist
    const faqs = await prisma.fAQ.findMany({
      where: {
        platform,
        serviceType,
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
    
    responseData.faqs = faqs.map(faq => ({
      q: faq.question,
      a: faq.answer,
    }));

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Get service page content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch service page content' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { platform: string; serviceType: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const platform = params.platform.toUpperCase() as Platform;
    const serviceType = params.serviceType.toUpperCase() as ServiceType;

    const {
      slug,
      heroTitle,
      heroSubtitle,
      heroRating,
      heroReviewCount,
      assuranceCardText,
      packages,
      qualityCompare,
      howItWorks,
      faqs,
      isActive = true,
    } = body;

    // Try upsert with assuranceCardText and slug first
    // If it fails because the column doesn't exist, retry without them
    let content;
    try {
      content = await prisma.servicePageContent.upsert({
        where: {
          platform_serviceType: {
            platform,
            serviceType,
          },
        },
        update: {
          slug,
          heroTitle,
          heroSubtitle,
          heroRating,
          heroReviewCount,
          assuranceCardText: assuranceCardText as any,
          packages: packages as any,
          qualityCompare: qualityCompare as any,
          howItWorks: howItWorks as any,
          isActive,
        } as any,
        create: {
          platform,
          serviceType,
          slug,
          heroTitle,
          heroSubtitle,
          heroRating,
          heroReviewCount,
          assuranceCardText: assuranceCardText as any,
          packages: packages as any,
          qualityCompare: qualityCompare as any,
          howItWorks: howItWorks as any,
          isActive,
        } as any,
      });
    } catch (error: any) {
      // Check for unique constraint violation on slug
      if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
        return NextResponse.json(
          { error: 'This Service URL / Key is already in use. Please choose a different one.' },
          { status: 400 }
        );
      }

      // If error is about unknown argument, the column doesn't exist yet
      // Retry without assuranceCardText and slug
      if (error.message && error.message.includes('Unknown argument')) {
        console.warn('assuranceCardText or slug column not found in database. Saving other fields. Please run: npx prisma db push');
        
        // Save without assuranceCardText and slug
        content = await prisma.servicePageContent.upsert({
          where: {
            platform_serviceType: {
              platform,
              serviceType,
            },
          },
          update: {
            heroTitle,
            heroSubtitle,
            heroRating,
            heroReviewCount,
            packages: packages as any,
            qualityCompare: qualityCompare as any,
            howItWorks: howItWorks as any,
            isActive,
          },
          create: {
            platform,
            serviceType,
            heroTitle,
            heroSubtitle,
            heroRating,
            heroReviewCount,
            packages: packages as any,
            qualityCompare: qualityCompare as any,
            howItWorks: howItWorks as any,
            isActive,
          },
        });
        
        // Return a warning in the response
        return NextResponse.json({
          ...content,
          warning: 'assuranceCardText was not saved because the database column does not exist. Please run: npx prisma db push',
        });
      } else {
        // Re-throw if it's a different error
        throw error;
      }
    }

    // Update FAQs
    if (faqs && Array.isArray(faqs)) {
      // Delete existing FAQs for this service
      await prisma.fAQ.deleteMany({
        where: { platform, serviceType },
      });
      
      // Create new FAQs
      await prisma.fAQ.createMany({
        data: faqs.map((faq: any, index: number) => ({
          platform,
          serviceType,
          question: faq.q || faq.question,
          answer: faq.a || faq.answer,
          displayOrder: index,
          isActive: true,
        })),
      });
    }

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('Update service page content error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update service page content' },
      { status: 500 }
    );
  }
}

