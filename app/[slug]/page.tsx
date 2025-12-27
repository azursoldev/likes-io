import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  ServicePageContentProvider,
  DynamicServiceHero,
  DynamicAssuranceCard,
  DynamicPackagesSelector,
  DynamicQualityCompare,
  DynamicHowItWorks,
  DynamicFAQSection,
  ServicePageContentData
} from "../components/ServicePageContent";
import FeaturedOn from "../components/FeaturedOn";
import AdvantageSection from "../components/AdvantageSection";
import ReviewsSection from "../components/ReviewsSection";
import MoreServicesCTA from "../components/MoreServicesCTA";
import LearnMoreSection from "../components/LearnMoreSection";

async function getServiceContent(slug: string) {
  try {
    const content = await prisma.servicePageContent.findUnique({
      where: { slug },
    });

    if (!content) return null;

    // Fetch FAQs
    const faqs = await prisma.fAQ.findMany({
      where: {
        // platform: content.platform, // Removed as per schema
        // serviceType: content.serviceType, // Removed as per schema
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    // Fetch Testimonials
    const testimonials = await prisma.testimonial.findMany({
      where: {
        isApproved: true,
        OR: [
          { platform: null },
          { platform: content.platform, serviceType: null },
          { platform: content.platform, serviceType: content.serviceType }
        ],
      },
      orderBy: { displayOrder: 'asc' },
    });

    // Parse JSON fields
    return {
        heroTitle: content.heroTitle,
        metaTitle: content.metaTitle || undefined,
        metaDescription: content.metaDescription || undefined,
        heroSubtitle: content.heroSubtitle,
        heroRating: content.heroRating || "4.9/5",
        heroReviewCount: content.heroReviewCount || "1000+ reviews",
        assuranceCardText: content.assuranceCardText || undefined,
        learnMoreText: content.learnMoreText || undefined,
        learnMoreModalContent: content.learnMoreModalContent || undefined,
        packages: typeof content.packages === 'string' ? JSON.parse(content.packages) : content.packages,
        qualityCompare: content.qualityCompare ? (typeof content.qualityCompare === 'string' ? JSON.parse(content.qualityCompare) : content.qualityCompare) : undefined,
        howItWorks: content.howItWorks ? (typeof content.howItWorks === 'string' ? JSON.parse(content.howItWorks) : content.howItWorks) : undefined,
        faqs: faqs.map(faq => ({
          q: faq.question,
          a: faq.answer,
        })),
        testimonials: testimonials.map(t => ({
          handle: t.handle,
          role: t.role,
          text: t.text,
        })),
        platform: content.platform,
        serviceType: content.serviceType,
        slug: content.slug,
    } as ServicePageContentData;
  } catch (error) {
    console.error('Error fetching service content:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const content = await prisma.servicePageContent.findUnique({
      where: { slug: params.slug },
    });

    if (!content) {
      return {
        title: 'Service Not Found',
      };
    }
    
    return {
      title: content.metaTitle || content.heroTitle, 
      description: content.metaDescription || content.heroSubtitle,
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      title: 'Likes.io',
      description: 'Boost your social media presence',
    };
  }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const content = await getServiceContent(params.slug);

  if (!content || !content.platform || !content.serviceType) {
    notFound();
  }

  const platformName = content.platform.charAt(0).toUpperCase() + content.platform.slice(1).toLowerCase();
  const serviceName = content.serviceType.charAt(0).toUpperCase() + content.serviceType.slice(1).toLowerCase();
  const learnMoreText = content.learnMoreText;
  const learnMoreModalContent = content.learnMoreModalContent;

  return (
    <>
      <Header />
      <ServicePageContentProvider
        slug={params.slug}
        initialData={content}
        defaultHeroTitle={content.heroTitle}
        defaultHeroSubtitle={content.heroSubtitle}
        defaultHeroRating={content.heroRating}
        defaultHeroReviewCount={content.heroReviewCount}
        defaultAssuranceCardText={content.assuranceCardText}
        defaultPackages={content.packages}
        defaultQualityCompare={content.qualityCompare}
        defaultHowItWorks={content.howItWorks}
        defaultFAQs={content.faqs}
        defaultTestimonials={content.testimonials}
      >
        <DynamicServiceHero />
        <DynamicAssuranceCard />
        {learnMoreText && <LearnMoreSection text={learnMoreText} modalContent={learnMoreModalContent} />}
        <DynamicPackagesSelector />
        <DynamicQualityCompare />
        <FeaturedOn />
        <AdvantageSection />
        <DynamicHowItWorks />
        <ReviewsSection />
        <DynamicFAQSection />
        <MoreServicesCTA />
      </ServicePageContentProvider>
      <Footer />
    </>
  );
}
