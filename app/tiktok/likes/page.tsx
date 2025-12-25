import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";

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
} from "../../components/ServicePageContent";
import FeaturedOn from "../../components/FeaturedOn";
import AdvantageSection from "../../components/AdvantageSection";
import ReviewsSection, { type ReviewItem } from "../../components/ReviewsSection";
import MoreServicesCTA, { type CTAButton } from "../../components/MoreServicesCTA";
import type { PackageTabConfig } from "../../components/PackagesSelector";
import type { FAQItem } from "../../components/FAQSection";

export const metadata: Metadata = {
  title: "Buy TikTok Likes | Real & Instant Likes.io",
  description:
    "Skyrocket your TikTok videos with authentic likes that trigger the algorithm, boost social proof, and help you land on the For You Page.",
};

const TIKTOK_PACKAGE_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Likes",
    packages: [
      { qty: 100, perLike: "$0.029 / like", price: "$2.99", offText: "Save 5%" },
      { qty: 250, perLike: "$0.024 / like", price: "$5.99", offText: "Save 10%" },
      { qty: 500, perLike: "$0.020 / like", price: "$9.99", strike: "$14.99", save: "You Save $5.00", offText: "15% OFF" },
      { qty: "1K", perLike: "$0.015 / like", price: "$14.99", offText: "Best Seller" },
      { qty: "2.5K", perLike: "$0.012 / like", price: "$29.99", offText: "Scale Fast" },
      { qty: "5K", perLike: "$0.009 / like", price: "$44.99" },
      { qty: "10K", perLike: "$0.007 / like", price: "$69.99" },
      { qty: "25K+", perLike: "Custom pricing", price: "$—", offText: "Custom" },
    ],
  },
  {
    id: "premium",
    label: "Premium Likes",
    packages: [
      { qty: 100, perLike: "$0.045 / like", price: "$4.49", offText: "Highest Retention" },
      { qty: 250, perLike: "$0.038 / like", price: "$9.49", offText: "Save 10%" },
      { qty: 500, perLike: "$0.032 / like", price: "$15.99", strike: "$22.99", save: "You Save $7.00", offText: "Hot" },
      { qty: "1K", perLike: "$0.028 / like", price: "$27.99", strike: "$34.99", save: "You Save $7.00", offText: "Recommended" },
      { qty: "2.5K", perLike: "$0.022 / like", price: "$54.99" },
      { qty: "5K", perLike: "$0.018 / like", price: "$89.99" },
      { qty: "10K", perLike: "$0.015 / like", price: "$149.99" },
      { qty: "25K+", perLike: "Custom concierge pricing", price: "$—", offText: "Custom" },
    ],
  },
];

const QUALITY_COLUMNS = [
  {
    title: "High-Quality Likes",
    subtitle: "Perfect for quick boosts that kick-start the TikTok algorithm.",
    bullets: [
      "<strong>REAL</strong> likes from authentic TikTok fans",
      "Delivery schedule keeps engagement looking natural",
      "Great for testing new content ideas and challenges",
      "Split likes across multiple videos",
      "No password required",
      "Responsive support, 24/7",
    ],
  },
  {
    title: "Premium Likes",
    subtitle: "Maximum retention and authority for serious creators.",
    bullets: [
      "<strong>REAL</strong> engagement from trend-setting accounts",
      "<strong>Highest chance to land on the For You Page</strong>",
      "Signals TikTok to keep pushing your clip organically",
      "Fast or drip delivery — you decide",
      "<strong>Priority support and retention guarantee</strong>",
      "Perfect for launches, collabs, and campaigns",
    ],
    highlight: true,
    badge: "RECOMMENDED",
  },
];

const TIKTOK_STEPS = [
  {
    title: "1. Select Your Package",
    description: "Choose the TikTok like bundle that matches your growth goals — from quick boosts to premium campaigns.",
  },
  {
    title: "2. Provide Your Video Link",
    description: "Paste the TikTok video URL (or multiple links) you want to amplify. No password or login ever required.",
  },
  {
    title: "3. Watch It Go Viral",
    description: "Complete checkout and watch authentic likes roll in as the For You Page algorithm takes notice.",
  },
];

const TIKTOK_REVIEWS: ReviewItem[] = [
  {
    handle: "@DanceMovesDan",
    role: "Verified Creator",
    text: "My dance challenge hit the FYP the same day. The likes looked natural and gave me the credibility I needed for brand deals.",
  },
  {
    handle: "@ComedyQueen",
    role: "Verified Buyer",
    text: "Buying premium likes gave my sketches the initial push they needed. The organic comments that followed were the real win.",
  },
  {
    handle: "@DIYVibes",
    role: "Verified Seller",
    text: "I use Likes.io for every campaign launch now. It's the fastest way to make a new product video look trustworthy immediately.",
  },
];

const TIKTOK_FAQS: FAQItem[] = [
  {
    q: "How can buying TikTok likes help me reach the For You Page?",
    a: "Likes signal to TikTok that viewers enjoy your content. That positive engagement data boosts the chances of the algorithm pushing your video to more people on the For You Page.",
  },
  {
    q: "Is it safe to buy TikTok likes?",
    a: "Absolutely. We deliver likes from high-quality profiles using safe pacing so your growth looks organic and compliant with TikTok's guidelines.",
  },
  {
    q: "How fast are TikTok likes delivered?",
    a: "Most orders begin within minutes. You can opt for instant or gradual delivery depending on how natural you want the growth to appear.",
  },
  {
    q: "Can I split likes across multiple TikTok videos?",
    a: "Yes. During checkout you can provide multiple URLs so we can distribute likes across different videos or reposts.",
  },
  {
    q: "Do you need my TikTok password?",
    a: "Never. We only need the video URL(s) to deliver the engagement. Your account stays fully secure.",
  },
  {
    q: "What's the difference between High-Quality and Premium TikTok likes?",
    a: "Premium likes come from more active, trend-setting accounts with the best retention and impact on the algorithm. High-Quality likes are budget-friendly while still coming from authentic profiles.",
  },
  {
    q: "Will the likes disappear after delivery?",
    a: "Minor fluctuations can happen on any social platform, but our retention rates are excellent. Premium orders include extended refill protection.",
  },
  {
    q: "Can you deliver likes to private TikTok accounts?",
    a: "TikTok must be able to view the video, so please make the post public during delivery. You can switch back afterward.",
  },
  {
    q: "What payment methods do you accept?",
    a: "All major credit and debit cards plus secure alternatives shown at checkout are supported.",
  },
];

const CTA_BUTTONS: CTAButton[] = [
  { href: "/tiktok/followers", label: "BUY TIKTOK FOLLOWERS", icon: faUserPlus },
  { href: "/tiktok/views", label: "BUY TIKTOK VIEWS", icon: faEye },
];

export default async function Page() {
  const content = await prisma.servicePageContent.findUnique({
    where: { platform_serviceType: { platform: "TIKTOK", serviceType: "LIKES" } },
  });
    if (content?.slug) {
      notFound();
    }
  return (
    <>
      <Header />
      <ServicePageContentProvider
        platform="tiktok"
        serviceType="likes"
        defaultHeroTitle="Skyrocket Your TikToks with Likes"
        defaultHeroSubtitle="Boost your video's appeal, trigger the algorithm, and land on the 'For You' page with our high-quality, real TikTok likes. Rated #1 for TikTok growth."
        defaultHeroRating="4.9/5"
        defaultHeroReviewCount="18,965+ reviews"
        defaultAssuranceCardText="Join over a million satisfied customers, including artists, companies, and top influencers. Our services are <b>100% discreet, secure, and delivered naturally</b> to ensure your account is always safe."
        defaultPackages={TIKTOK_PACKAGE_TABS}
        defaultQualityCompare={{ title: "Compare TikTok Like Quality", columns: QUALITY_COLUMNS }}
        defaultHowItWorks={{
          title: "How Buying TikTok Likes Works",
          subtitle: "Designed for creators who need results fast. Our streamlined process keeps things simple, safe, and wildly effective.",
          steps: TIKTOK_STEPS,
        }}
        defaultFAQs={TIKTOK_FAQS}
      >
        <DynamicServiceHero />
        <DynamicAssuranceCard />
        <DynamicPackagesSelector />
        <DynamicQualityCompare />
        <FeaturedOn />
        <AdvantageSection />
        <DynamicHowItWorks />
        <ReviewsSection
          title="Loved by Creators Worldwide"
          subtitle="Real TikTok creators who used Likes.io to ignite their growth."
          reviews={TIKTOK_REVIEWS}
        />
        <DynamicFAQSection />
        <MoreServicesCTA
          title="More Growth Services from Likes.io"
          highlight="Services"
          body="TikTok likes are powerful, but they're just one lever. Pair them with our targeted follower and view campaigns to compound your results in days."
          buttons={CTA_BUTTONS}
        />
      </ServicePageContentProvider>
      <Footer />
    </>
  );
}
