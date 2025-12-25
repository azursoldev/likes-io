import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const content = await prisma.servicePageContent.findUnique({
      where: { slug }, 
    });

    if (!content) {
      return NextResponse.json({ error: 'Service page not found' }, { status: 404 });
    }

    // Parse JSON fields
    const responseData: any = {
      ...content,
      assuranceCardText: (content as any).assuranceCardText || null,
      packages: typeof content.packages === 'string' ? JSON.parse(content.packages) : content.packages,
      qualityCompare: content.qualityCompare ? (typeof content.qualityCompare === 'string' ? JSON.parse(content.qualityCompare) : content.qualityCompare) : null,
      howItWorks: content.howItWorks ? (typeof content.howItWorks === 'string' ? JSON.parse(content.howItWorks) : content.howItWorks) : null,
    };
    
    // Fetch FAQs
    const faqs = await prisma.fAQ.findMany({
      where: {
        platform: content.platform,
        serviceType: content.serviceType,
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
    });
    
    responseData.faqs = faqs.map(faq => ({
      q: faq.question,
      a: faq.answer,
    }));

    // Fetch Testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: {
        OR: [
          { platform: content.platform },
          { platform: null }
        ],
        isApproved: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    responseData.testimonials = testimonials.map(t => ({
      handle: t.handle,
      role: t.role,
      text: t.text,
    }));

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Get service page content by slug error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch service page content' },
      { status: 500 }
    );
  }
}
