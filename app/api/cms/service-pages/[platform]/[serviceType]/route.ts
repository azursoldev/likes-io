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
    // In Next.js 15, params is a Promise. In 14, it's an object.
    // We access it safely here.
    const resolvedParams = await Promise.resolve(params);
    const platform = resolvedParams.platform.toUpperCase() as Platform;
    const serviceType = resolvedParams.serviceType.toUpperCase() as ServiceType;

    console.log(`GET service content for ${platform} ${serviceType}`);

    if (!Object.values(Platform).includes(platform)) {
      console.error(`Invalid platform: ${platform}`);
      return NextResponse.json({ error: `Invalid platform: ${platform}` }, { status: 400 });
    }

    if (!Object.values(ServiceType).includes(serviceType)) {
      console.error(`Invalid serviceType: ${serviceType}`);
      return NextResponse.json({ error: `Invalid serviceType: ${serviceType}` }, { status: 400 });
    }

    const content = await prisma.servicePageContent.findUnique({
      where: {
        platform_serviceType: {
          platform,
          serviceType,
        },
      },
    });

    const defaultContent = {
      heroTitle: `Buy ${resolvedParams.serviceType} for ${resolvedParams.platform}`,
      heroSubtitle: `Get real, high-quality ${resolvedParams.serviceType} for your ${resolvedParams.platform} account.`,
      assuranceCardText: "Join over a million satisfied customers, including artists, companies, and top influencers. Our services are 100% discreet, secure, and delivered naturally to ensure your account is always safe.",
      packages: [],
      qualityCompare: null,
      howItWorks: null,
      faqs: [],
      benefits: null,
    };

    if (!content) {
      return NextResponse.json(defaultContent);
    }

    // Parse JSON fields
    const responseData: any = {
      ...content,
      // Explicitly include assuranceCardText and learnMoreText (may be undefined if column doesn't exist)
      assuranceCardText: (content as any).assuranceCardText || null,
      learnMoreText: (content as any).learnMoreText || null,
      learnMoreModalContent: (content as any).learnMoreModalContent || null,
      moreServicesTitle: (content as any).moreServicesTitle || null,
      moreServicesHighlight: (content as any).moreServicesHighlight || null,
      moreServicesBody: (content as any).moreServicesBody || null,
      moreServicesButtons: content.moreServicesButtons ? (typeof content.moreServicesButtons === 'string' ? JSON.parse(content.moreServicesButtons) : content.moreServicesButtons) : null,
      packages: typeof content.packages === 'string' ? JSON.parse(content.packages) : content.packages,
      qualityCompare: content.qualityCompare ? (typeof content.qualityCompare === 'string' ? JSON.parse(content.qualityCompare) : content.qualityCompare) : null,
      howItWorks: content.howItWorks ? (typeof content.howItWorks === 'string' ? JSON.parse(content.howItWorks) : content.howItWorks) : null,
      benefits: (() => {
        try {
          return content.benefits ? (typeof content.benefits === 'string' ? JSON.parse(content.benefits) : content.benefits) : null;
        } catch (e) {
          console.error('Error parsing benefits JSON:', e);
          return null;
        }
      })(),
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

    // Fetch Testimonials
    // const testimonials = await prisma.testimonial.findMany({
    //   where: {
    //     isApproved: true,
    //     OR: [
    //       { platform: null },
    //       { platform: platform, serviceType: null },
    //       { platform: platform, serviceType: serviceType }
    //     ],
    //   },
    //   orderBy: { displayOrder: 'asc' },
    // });
    const testimonials: any[] = [];

    responseData.testimonials = testimonials.map(t => ({
      handle: t.handle,
      role: t.role,
      text: t.text,
    }));

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Get service page content error:', error);
    
    // Fallback for database connection issues in development/staging
    // This allows the frontend to function in "Mock Mode" when DB is unreachable
    if (error.message && (
      error.message.includes("Can't reach database server") || 
      error.message.includes("Connection lost") ||
      error.code === 'P1001'
    )) {
      console.warn('Returning default mock content due to database connection error');
      return NextResponse.json({
        heroTitle: `Buy ${params.serviceType} for ${params.platform}`,
        heroSubtitle: `Get real, high-quality ${params.serviceType} for your ${params.platform} account.`,
        assuranceCardText: "Join over a million satisfied customers, including artists, companies, and top influencers. Our services are 100% discreet, secure, and delivered naturally to ensure your account is always safe.",
        packages: [],
        qualityCompare: null,
        howItWorks: null,
        faqs: [],
        benefits: null,
        _isMock: true,
        _dbError: error.message
      });
    }

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
    const resolvedParams = await Promise.resolve(params);
    const platform = resolvedParams.platform.toUpperCase() as Platform;
    const serviceType = resolvedParams.serviceType.toUpperCase() as ServiceType;

    console.log(`PUT service content for ${platform} ${serviceType}`);

    if (!Object.values(Platform).includes(platform)) {
      return NextResponse.json({ error: `Invalid platform: ${platform}` }, { status: 400 });
    }

    if (!Object.values(ServiceType).includes(serviceType)) {
      return NextResponse.json({ error: `Invalid serviceType: ${serviceType}` }, { status: 400 });
    }

    const {
      slug,
      metaTitle,
      metaDescription,
      heroTitle,
      heroSubtitle,
      heroRating,
      heroReviewCount,
      assuranceCardText,
      learnMoreText,
      learnMoreModalContent,
      packages,
      qualityCompare,
      howItWorks,
      benefits,
      faqs,
      moreServicesTitle,
      moreServicesHighlight,
      moreServicesBody,
      moreServicesButtons,
      customEnabled,
      customMinQuantity,
      customMaxQuantity,
      customStep,
      customRoundToStep,
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
          metaTitle,
          metaDescription,
          heroTitle,
          heroSubtitle,
          heroRating,
          heroReviewCount,
          assuranceCardText: assuranceCardText as any,
          learnMoreText: learnMoreText as any,
          learnMoreModalContent: learnMoreModalContent as any,
          packages: packages as any,
          qualityCompare: qualityCompare as any,
          howItWorks: howItWorks as any,
          benefits: benefits as any,
          moreServicesTitle: moreServicesTitle as any,
          moreServicesHighlight: moreServicesHighlight as any,
          moreServicesBody: moreServicesBody as any,
          moreServicesButtons: moreServicesButtons as any,
          customEnabled: customEnabled as boolean,
          customMinQuantity: customMinQuantity as any,
          customMaxQuantity: customMaxQuantity as any,
          customStep: customStep as any,
          customRoundToStep: customRoundToStep as boolean,
          isActive,
        } as any,
        create: {
          platform,
          serviceType,
          slug,
          metaTitle,
          metaDescription,
          heroTitle,
          heroSubtitle,
          heroRating,
          heroReviewCount,
          assuranceCardText: assuranceCardText as any,
          learnMoreText: learnMoreText as any,
          learnMoreModalContent: learnMoreModalContent as any,
          packages: packages as any,
          qualityCompare: qualityCompare as any,
          howItWorks: howItWorks as any,
          benefits: benefits as any,
          moreServicesTitle: moreServicesTitle as any,
          moreServicesHighlight: moreServicesHighlight as any,
          moreServicesBody: moreServicesBody as any,
          moreServicesButtons: moreServicesButtons as any,
          customEnabled: customEnabled as boolean,
          customMinQuantity: customMinQuantity as any,
          customMaxQuantity: customMaxQuantity as any,
          customStep: customStep as any,
          customRoundToStep: customRoundToStep as boolean,
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

      if (error.message && error.message.includes('Unknown argument')) {
        console.warn('One or more columns not found in database. Saving supported fields. Please run: npx prisma db push');
        
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
            benefits: benefits as any,
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
            benefits: benefits as any,
            isActive,
          },
        });
        
        return NextResponse.json({
          ...content,
          warning: 'Some fields were not saved (slug, assuranceCardText, learnMoreText, metaTitle, metaDescription). Please run: npx prisma db push',
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
      if (faqs.length > 0) {
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
