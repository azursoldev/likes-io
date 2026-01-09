import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getServiceMapping } from "@/lib/service-utils";
import {
  ServicePageContentProvider,
  DynamicServiceHero,
  DynamicAssuranceCard,
  DynamicPackagesSelector,
  DynamicQualityCompare,
  DynamicHowItWorks,
  DynamicFAQSection,
  DynamicAdvantageSection,
  DynamicMoreServicesCTA,
  ServicePageContentData
} from "../components/ServicePageContent";
import FeaturedOn from "../components/FeaturedOn";
import ReviewsSection from "../components/ReviewsSection";
import LearnMoreSection from "../components/LearnMoreSection";

import { getDefaultMoreServicesButtons } from "../utils/serviceDefaults";

async function getServiceContent(slug: string): Promise<ServicePageContentData | null> {
  let content;
  let faqs: any[] = [];
  let testimonials: any[] = [];

  try {
    content = await prisma.servicePageContent.findFirst({
      where: { slug },
    });

    if (content) {
      // Fetch FAQs
      faqs = await prisma.fAQ.findMany({
        where: {
          platform: content.platform,
          serviceType: content.serviceType,
          isActive: true,
        },
        orderBy: { displayOrder: 'asc' },
      });

      // Fetch Testimonials
      testimonials = await prisma.testimonial.findMany({
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
    }
  } catch (error) {
    console.error('Error fetching service content from DB:', error);
  }

  // Fallback: If no content in DB (or DB error), try to infer from slug
  if (!content) {
    const mapping = getServiceMapping(slug);
    if (mapping) {
      console.log(`Service content not found in DB for slug "${slug}". Generating dynamic content.`);
      
      const platformName = mapping.platform.charAt(0).toUpperCase() + mapping.platform.slice(1);
      const serviceName = mapping.serviceType.charAt(0).toUpperCase() + mapping.serviceType.slice(1);
      
      // Construct minimal default content
      return {
        heroTitle: `Buy ${platformName} ${serviceName}`,
        heroSubtitle: `Boost your ${platformName} presence with high-quality ${serviceName.toLowerCase()}.`,
        metaTitle: `Buy ${platformName} ${serviceName} | Real & Instant`,
        metaDescription: `Get the best ${platformName} ${serviceName} instantly. Secure payment and fast delivery.`,
        heroRating: "4.9/5",
        heroReviewCount: "1000+ reviews",
        packages: [
           { id: 1, name: `100 ${serviceName}`, price: 2.99, amount: 100 },
           { id: 2, name: `500 ${serviceName}`, price: 6.99, amount: 500 },
           { id: 3, name: `1000 ${serviceName}`, price: 11.99, amount: 1000 },
        ],
        benefits: {
          title: "Why Choose Us?",
          items: [
            { title: "Instant Delivery", description: "Starts within minutes" },
            { title: "High Quality", description: "Real looking profiles" },
            { title: "24/7 Support", description: "We are always here to help" }
          ]
        },
        howItWorks: {
          title: "How It Works",
          steps: [
            { title: "Select Package", description: `Choose the amount of ${serviceName.toLowerCase()} you need.` },
            { title: "Enter Details", description: "Provide your username or link. No password required." },
            { title: "Watch it Grow", description: "Sit back and watch the results." }
          ]
        },
        platform: mapping.platform.toUpperCase(),
        serviceType: mapping.serviceType.toUpperCase(),
        slug: slug,
        moreServices: {
           buttons: getDefaultMoreServicesButtons(mapping.platform)
        },
        // Empty lists for now as DB might be down
        faqs: [],
        testimonials: []
      } as ServicePageContentData;
    }
    return null;
  }

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
    benefits: content.benefits ? (typeof content.benefits === 'string' ? JSON.parse(content.benefits) : content.benefits) : undefined,
    faqs: faqs.map(faq => ({
      q: faq.question,
      a: faq.answer,
    })),
    testimonials: testimonials.map(t => ({
      handle: t.handle,
      role: t.role || "Verified Buyer",
      text: t.text,
    })),
    moreServices: {
      title: (content as any).moreServicesTitle || undefined,
      highlight: (content as any).moreServicesHighlight || undefined,
      body: (content as any).moreServicesBody || undefined,
      buttons: (content as any).moreServicesButtons 
        ? (typeof (content as any).moreServicesButtons === 'string' ? JSON.parse((content as any).moreServicesButtons) : (content as any).moreServicesButtons) 
        : getDefaultMoreServicesButtons(content.platform || ""),
    },
    platform: content.platform,
    serviceType: content.serviceType,
    slug: content.slug,
  } as ServicePageContentData;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const content = await prisma.servicePageContent.findFirst({
      where: { slug: params.slug },
    });

    if (!content) {
      return {
        title: 'Service Not Found',
      };
    }
    
    return {
      title: (content as any).metaTitle || content.heroTitle, 
      description: (content as any).metaDescription || content.heroSubtitle,
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
        defaultMoreServices={content.moreServices}
      >
        <DynamicServiceHero />
        <DynamicAssuranceCard />
        {learnMoreText && <LearnMoreSection text={learnMoreText} modalContent={learnMoreModalContent} />}
        <DynamicPackagesSelector />
        <DynamicQualityCompare />
        <FeaturedOn />
        <DynamicAdvantageSection />
        <DynamicHowItWorks />
        <ReviewsSection />
        <DynamicFAQSection />
        <DynamicMoreServicesCTA />
      </ServicePageContentProvider>
      <Footer />
    </>
  );
}
