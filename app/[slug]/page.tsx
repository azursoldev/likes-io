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

async function getServiceContent(slug: string) {
  const content = await prisma.servicePageContent.findUnique({
    where: { slug },
  });

  if (!content) return null;

  // Fetch FAQs
  const faqs = await prisma.fAQ.findMany({
    where: {
      platform: content.platform,
      serviceType: content.serviceType,
      isActive: true,
    },
    orderBy: { displayOrder: 'asc' },
  });

  // Parse JSON fields
  return {
      heroTitle: content.heroTitle,
      heroSubtitle: content.heroSubtitle,
      heroRating: content.heroRating || "4.9/5",
      heroReviewCount: content.heroReviewCount || "1000+ reviews",
      assuranceCardText: content.assuranceCardText || undefined,
      packages: typeof content.packages === 'string' ? JSON.parse(content.packages) : content.packages,
      qualityCompare: content.qualityCompare ? (typeof content.qualityCompare === 'string' ? JSON.parse(content.qualityCompare) : content.qualityCompare) : undefined,
      howItWorks: content.howItWorks ? (typeof content.howItWorks === 'string' ? JSON.parse(content.howItWorks) : content.howItWorks) : undefined,
      faqs: faqs.map(faq => ({
        q: faq.question,
        a: faq.answer,
      })),
  } as ServicePageContentData;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const content = await prisma.servicePageContent.findUnique({
    where: { slug: params.slug },
  });

  if (!content) {
    return {
      title: 'Service Not Found',
    };
  }
  
  return {
    title: content.heroTitle, 
    description: content.heroSubtitle,
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const content = await getServiceContent(params.slug);

  if (!content) {
    notFound();
  }

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
      >
        <DynamicServiceHero />
        <DynamicAssuranceCard />
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
