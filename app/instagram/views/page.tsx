import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Buy Instagram Views & Go Viral on Reels | Likes.io",
  description:
    "Make your Reels and videos go viral with premium Instagram views that trigger the algorithm and capture attention on Explore.",
};

const INSTAGRAM_VIEW_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Views",
    packages: [
      { qty: 100, perLike: "$0.029 / view", price: "$2.99", offText: "Starter" },
      { qty: 250, perLike: "$0.024 / view", price: "$5.99", offText: "Save 10%" },
      { qty: 500, perLike: "$0.022 / view", price: "$10.99", offText: "Save 15%" },
      { qty: "1K", perLike: "$0.020 / view", price: "$19.99", offText: "Best Seller" },
      { qty: "2.5K", perLike: "$0.018 / view", price: "$44.99" },
      { qty: "5K", perLike: "$0.016 / view", price: "$79.99" },
      { qty: "10,000+", perLike: "Custom pricing", price: "$—", offText: "Custom" },
    ],
  },
  {
    id: "premium",
    label: "Premium Views",
    packages: [
      { qty: 100, perLike: "$0.038 / view", price: "$3.79", offText: "High Retention" },
      { qty: 250, perLike: "$0.032 / view", price: "$7.99" },
      { qty: 500, perLike: "$0.028 / view", price: "$13.99", offText: "Save 12%" },
      { qty: "1K", perLike: "$0.025 / view", price: "$24.99", strike: "$32.99", save: "You Save $8.00", offText: "Recommended" },
      { qty: "2.5K", perLike: "$0.022 / view", price: "$54.99" },
      { qty: "5K", perLike: "$0.019 / view", price: "$94.99" },
      { qty: "10,000+", perLike: "Concierge pricing", price: "$—", offText: "Custom" },
    ],
  },
];

const QUALITY_COLUMNS = [
  {
    title: "High-Quality Views",
    subtitle: "Add views quickly across Reels, Stories, and long-form videos.",
    bullets: [
      "REAL views only",
      "Near-instant delivery",
      "No password required",
      "Split across multiple videos",
      "Safe pacing to protect reach",
      "24/7 support",
    ],
  },
  {
    title: "Premium Views",
    subtitle: "Highest retention and watch time for serious campaigns.",
    bullets: [
      "<strong>High-retention views</strong> from ACTIVE users",
      "<strong>Boosts visibility</strong> on Explore & For You",
      "Ideal for brand collaborations",
      "Custom drip schedules",
      "<strong>Priority support</strong>",
      "Hourly 24/7 support",
    ],
    highlight: true,
    badge: "RECOMMENDED",
  },
];

const INSTAGRAM_STEPS = [
  {
    title: "1. Select Your Package",
    description: "Choose the number of views (or mix of high-quality vs. premium) that fits your budget.",
  },
  {
    title: "2. Provide Your Post Link",
    description: "Enter the link to your Instagram video or Reel. No password is needed, ever.",
  },
  {
    title: "3. Watch Your Views Climb",
    description: "Once your order is confirmed, our delivery system drives real views to your videos within minutes.",
  },
];

const INSTAGRAM_REVIEWS: ReviewItem[] = [
  {
    handle: "@TravelFox",
    role: "Verified Buyer",
    text: "My travel reels started to show up on Explore after I added these views. Perfect for launching new series quickly.",
  },
  {
    handle: "@ReelTrends",
    role: "Verified Buyer",
    text: "Simple, safe, effective. This is my go-to for giving my video campaigns the initial spark they need.",
  },
  {
    handle: "@Groovey_clipz_central",
    role: "Verified Buyer",
    text: "Our brand videos get way more inbound messages now. Engagement jumped within a day.",
  },
];

const INSTAGRAM_FAQS: FAQItem[] = [
  {
    q: "Do these views work for both Instagram Reels and regular videos?",
    a: "Yes. You can submit links for Reels, feed videos, Stories, and IGTV—just make sure the content is public.",
  },
  {
    q: "How can buying Instagram views help my profile grow?",
    a: "Views are a strong ranking signal. When Instagram sees your content getting attention, it pushes it to more people.",
  },
  {
    q: "Can I split one order of views across multiple different videos?",
    a: "Absolutely. During checkout you can specify multiple links and how many views each should receive.",
  },
  {
    q: "Are the views permanent?",
    a: "Yes, we deliver stable views with excellent retention. Minor drops can happen, but we offer refills if needed.",
  },
  {
    q: "How quickly are the views delivered?",
    a: "Delivery begins within minutes. You can choose instant or drip pacing depending on how natural you want it to look.",
  },
];

const CTA_BUTTONS: CTAButton[] = [
  { platform: "instagram", serviceType: "likes", label: "BUY LIKES", icon: faThumbsUp },
  { platform: "instagram", serviceType: "followers", label: "BUY FOLLOWERS", icon: faUserPlus },
];

export default function Page() {
  notFound();
  return (
    <>
      <Header />
      <ServicePageContentProvider
        platform="instagram"
        serviceType="views"
        defaultHeroTitle="Buy Instagram Views & Go Viral on Reels"
        defaultHeroSubtitle="Make your Reels and videos go viral. Buying views gives your content the initial velocity it needs to get noticed by the algorithm, pushing it onto Explore and in front of millions."
        defaultHeroRating="4.95/5"
        defaultHeroReviewCount="17,249+ reviews"
        defaultAssuranceCardText="Join over a million satisfied customers, including artists, companies, and top influencers. Our services are <b>100% discreet, secure, and delivered naturally</b> to ensure your account is always safe."
        defaultPackages={INSTAGRAM_VIEW_TABS}
        defaultQualityCompare={{ title: "Compare View Quality", columns: QUALITY_COLUMNS }}
        defaultHowItWorks={{
          title: "How It Works",
          subtitle: "Our process is simple, fast, and secure. Get the views you need to make your videos dominate feeds and stand out from the crowd.",
          steps: INSTAGRAM_STEPS,
        }}
        defaultFAQs={INSTAGRAM_FAQS}
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
          subtitle="Real reviews from creators and brands who've seen incredible growth with our service."
          reviews={INSTAGRAM_REVIEWS}
        />
        <DynamicFAQSection />
        <MoreServicesCTA
          title="More Growth Services from Likes.io"
          highlight="Services"
          body="Instagram views are powerful boosts, but they're not the only engagements available from Likes.io. Combine them with our likes and follower packages to stay balanced and build social proof even faster."
          buttons={CTA_BUTTONS}
        />
      </ServicePageContentProvider>
      <Footer />
    </>
  );
}
