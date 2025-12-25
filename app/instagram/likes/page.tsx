import Header from "../../components/Header";
import Footer from "../../components/Footer";
import {
  ServicePageContentProvider,
  DynamicServiceHero,
  DynamicAssuranceCard,
  DynamicPackagesSelector,
  DynamicQualityCompare,
  DynamicHowItWorks,
  DynamicFAQSection,
  ServicePageContentData
} from "../../components/ServicePageContent";
import FeaturedOn from "../../components/FeaturedOn";
import AdvantageSection from "../../components/AdvantageSection";
import ReviewsSection from "../../components/ReviewsSection";
import MoreServicesCTA from "../../components/MoreServicesCTA";
import type { PackageTabConfig } from "../../components/PackagesSelector";
import type { FAQItem } from "../../components/FAQSection";

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Platform, ServiceType } from "@prisma/client";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Buy Instagram Likes",
  description: "Get high-quality, real likes delivered instantly to your posts. Boost credibility, trigger the algorithm, and get your content seen by millions on the Explore Page.",
};

const DEFAULT_PACKAGES: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Likes",
    packages: [
      { qty: 50, perLike: "$0.3599 / like", price: "$2.99", offText: "5% OFF" },
      { qty: 100, perLike: "$0.2899 / like", price: "$8.99", offText: "8% OFF" },
      { qty: 250, perLike: "$0.0899 / like", price: "$22.49", offText: "12% OFF" },
      { qty: 500, perLike: "$0.0360 / like", price: "$17.99", strike: "$27.99", save: "You Save $10.00", offText: "10% OFF" },
      { qty: "1K", perLike: "$0.0200 / like", price: "$19.99", offText: "25% OFF" },
      { qty: "2.5K", perLike: "$0.1020 / like", price: "$64.99", offText: "5% OFF" },
      { qty: "5K", perLike: "$0.1000 / like", price: "$99.00", offText: "10% OFF" },
      { qty: "10,000+", perLike: "$0.0700 / like", price: "$—", offText: "CUSTOM" },
    ],
  },
  {
    id: "premium",
    label: "Premium Likes",
    packages: [
      { qty: 50, perLike: "$0.4200 / like", price: "$3.49", offText: "5% OFF" },
      { qty: 100, perLike: "$0.3200 / like", price: "$9.99", offText: "8% OFF" },
      { qty: 250, perLike: "$0.1200 / like", price: "$29.99", offText: "12% OFF" },
      { qty: 500, perLike: "$0.0500 / like", price: "$24.99", strike: "$34.99", save: "You Save $10.00", offText: "10% OFF" },
      { qty: "1K", perLike: "$0.0300 / like", price: "$29.99", offText: "25% OFF" },
      { qty: "2.5K", perLike: "$0.1100 / like", price: "$79.99", offText: "5% OFF" },
      { qty: "5K", perLike: "$0.1050 / like", price: "$109.00", offText: "10% OFF" },
      { qty: "10,000+", perLike: "$0.0800 / like", price: "$—", offText: "CUSTOM" },
    ],
  },
];

const DEFAULT_QUALITY_COMPARE = {
  title: "Compare Like Quality",
  columns: [
    {
      title: "High-Quality Likes",
      subtitle: "Great for giving your posts a quick and affordable boost.",
      bullets: [
        "<strong>REAL</strong> likes from <strong>REAL</strong> people",
        "Guaranteed Instant Delivery",
        "Option to split likes on multiple pictures",
        "No password required",
        "Fast Delivery (gradual or instant)",
        "24/7 support",
      ],
    },
    {
      title: "Premium Likes",
      subtitle: "Our best offering for maximum impact and organic growth.",
      bullets: [
        "<strong>REAL</strong> likes from <strong>ACTIVE</strong> users",
        "<strong>Maximum chance to reach the Explore Page</strong>",
        "<strong>Helps attract organic engagement</strong>",
        "Guaranteed Instant Delivery",
        "Option to split likes on multiple pictures",
        "No password required",
        "<strong>Priority 24/7 support</strong>",
      ],
      highlight: true,
      badge: "RECOMMENDED",
    },
  ],
};

const DEFAULT_HOW_IT_WORKS = {
  title: "How It Works",
  subtitle: "Our streamlined process is designed for speed and security. Give your posts the engagement they deserve right now.",
  steps: [
    {
      title: "1. Select Your Package",
      description: "Choose from our High-Quality or Premium likes and select the quantity that matches your goals.",
    },
    {
      title: "2. Provide Your Post(s)",
      description: "Enter your username and select the posts you want to boost. No password required, ever.",
    },
    {
      title: "3. Watch the Magic Happen",
      description: "Complete the secure checkout and watch as real likes start appearing on your posts within minutes.",
    },
  ],
};

const DEFAULT_FAQS: FAQItem[] = [];

async function getServiceContent() {
  const platform = Platform.INSTAGRAM;
  const serviceType = ServiceType.LIKES;

  try {
    const content = await prisma.servicePageContent.findUnique({
      where: {
        platform_serviceType: {
          platform,
          serviceType,
        },
      },
    });

    const testimonials = await prisma.testimonial.findMany({
      where: {
        OR: [
          { platform },
          { platform: null }
        ],
        isApproved: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    const testimonialItems = testimonials.map(t => ({
      handle: t.handle,
      role: t.role,
      text: t.text,
    }));

    if (!content) return { content: null, testimonials: testimonialItems };

    const faqs = await prisma.fAQ.findMany({
      where: {
        platform,
        serviceType,
        isActive: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    const parsedContent: ServicePageContentData = {
        heroTitle: content.heroTitle,
        metaTitle: content.metaTitle || undefined,
        metaDescription: content.metaDescription || undefined,
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
        testimonials: testimonialItems,
        platform: content.platform,
        serviceType: content.serviceType,
    };

    return { content: parsedContent, testimonials: testimonialItems };
  } catch (error) {
    console.error("Error fetching service content:", error);
    return { content: null, testimonials: [] };
  }
}

export default async function Page() {
  const { content, testimonials } = await getServiceContent();
  return (
    <>
      <Header />
      <ServicePageContentProvider
        platform="instagram"
        serviceType="likes"
        initialData={content}
        defaultTestimonials={testimonials}
        defaultHeroTitle="Buy Instagram Likes & Go Viral"
        defaultHeroSubtitle="Get high-quality, real likes delivered instantly to your posts. Boost credibility, trigger the algorithm, and get your content seen by millions on the Explore Page."
        defaultHeroRating="4.9/5"
        defaultHeroReviewCount="1,352+ reviews"
        defaultAssuranceCardText="Join over a million satisfied customers, including artists, companies, and top influencers. Our services are <b>100% discreet, secure, and delivered naturally</b> to ensure your account is always safe."
        defaultPackages={DEFAULT_PACKAGES}
        defaultQualityCompare={DEFAULT_QUALITY_COMPARE}
        defaultHowItWorks={DEFAULT_HOW_IT_WORKS}
        defaultFAQs={DEFAULT_FAQS}
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
