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
  title: "Buy YouTube Views | Likes.io",
  description:
    "Boost your video's authority and ranking with high-retention YouTube views. Kickstart performance signals so the algorithm keeps recommending your content.",
};

const VIEW_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Views",
    packages: [
      { qty: 500, perLike: "$0.046 / view", price: "$22.99", strike: "$45.99", save: "You Save $23.00", offText: "Hot" },
      { qty: "1K", perLike: "$0.042 / view", price: "$41.99", offText: "Best Seller" },
      { qty: "2.5K", perLike: "$0.039 / view", price: "$96.99" },
      { qty: "5K", perLike: "$0.036 / view", price: "$179.99" },
      { qty: "10K", perLike: "$0.033 / view", price: "$329.99" },
      { qty: "25K", perLike: "$0.029 / view", price: "$729.99" },
      { qty: "50K", perLike: "$0.027 / view", price: "$1,349.99" },
      { qty: "100,000+", perLike: "Custom quote", price: "$—", offText: "Custom" },
    ],
  },
  {
    id: "premium",
    label: "Premium Views",
    packages: [
      { qty: 500, perLike: "$0.060 / view", price: "$29.99", offText: "High Retention" },
      { qty: "1K", perLike: "$0.054 / view", price: "$53.99" },
      { qty: "2.5K", perLike: "$0.050 / view", price: "$124.99", offText: "Save 10%" },
      { qty: "5K", perLike: "$0.047 / view", price: "$234.99" },
      { qty: "10K", perLike: "$0.043 / view", price: "$429.99" },
      { qty: "25K", perLike: "$0.038 / view", price: "$949.99" },
      { qty: "50K", perLike: "$0.034 / view", price: "$1,699.99" },
      { qty: "100,000+", perLike: "Concierge pricing", price: "$—", offText: "Custom" },
    ],
  },
];

const QUALITY_COLUMNS = [
  {
    title: "High-Quality Views",
    subtitle: "Real views from worldwide audiences.",
    bullets: [
      "Real video views (windowed)",
      "Boosts watch-time metrics",
      "Natural delivery schedules",
      "No password required",
      "Works on any public video",
      "24/7 support",
    ],
  },
  {
    title: "Premium Views",
    subtitle: "Maximum retention and ranking power.",
    bullets: [
      "<strong>High-retention views from active viewers</strong>",
      "<strong>Higher chance to enter Browse & Suggested</strong>",
      "Perfect for ad campaigns and launches",
      "Custom drip pacing available",
      "<strong>Priority support</strong>",
      "Hourly 24/7 support",
    ],
    highlight: true,
    badge: "RECOMMENDED",
  },
];

const STEPS = [
  {
    title: "1. Select Your Package",
    description: "Choose the level of views you need to push your video’s first wave.",
  },
  {
    title: "2. Provide Your Video Link",
    description: "Paste the URL to your YouTube video. No channel access required.",
  },
  {
    title: "3. Watch Your Views Grow",
    description: "Complete your secure checkout and watch as our delivery system raises your view count safely.",
  },
];

const REVIEWS: ReviewItem[] = [
  {
    handle: "@TheReviewer",
    role: "Verified Buyer",
    text: "The fastest way to show YouTube my videos deserve more reach. Views start almost instantly.",
  },
  {
    handle: "@GuitarLessons",
    role: "Verified Buyer",
    text: "Buying views gave my new tutorial series an algorithm boost. Organic views followed soon after.",
  },
  {
    handle: "@TravelMaker",
    role: "Verified Buyer",
    text: "Great experience. Views rolled in smoothly and my video now ranks on several travel keywords.",
  },
];

const FAQS: FAQItem[] = [
  {
    q: "What are “High-Retention” YouTube views and why do they matter?",
    a: "High-retention views are from profiles that watch longer. This improves watch-time signals, which YouTube weighs heavily.",
  },
  {
    q: "How can buying views help my video rank higher?",
    a: "More views and watch time tell the algorithm your video is engaging. That increases the chance of appearing in Suggested and Search.",
  },
  {
    q: "Will buying views help me meet the YouTube Partner Program (YPP) requirements?",
    a: "Views contribute to watch time, which helps on the path to 4,000 hours. You still need authentic channel content to qualify.",
  },
  {
    q: "Are the views from real people?",
    a: "Yes—our networks deliver genuine views. We focus on high retention so your analytics look natural.",
  },
  {
    q: "Will the views drop over time?",
    a: "View counts stay stable. Premium packages include refill protection if you see unexpected drops.",
  },
  {
    q: "Is it safe for my YouTube channel and AdSense account?",
    a: "Absolutely. We never ask for credentials and use safe pacing so your account stays compliant.",
  },
];

const CTA_BUTTONS: CTAButton[] = [
  { href: "/youtube/subscribers", label: "BUY YOUTUBE SUBSCRIBERS", icon: faUserPlus },
  { href: "/youtube/likes", label: "BUY YOUTUBE LIKES", icon: faThumbsUp },
];

export default function Page() {
  notFound();
  return (
    <>
      <Header />
      <ServicePageContentProvider
        platform="youtube"
        serviceType="views"
        defaultHeroTitle="Boost Your Rankings with YouTube Views"
        defaultHeroSubtitle="Boost your video's authority and ranking with high-retention views. Kickstart your video's performance to get suggested by the YouTube algorithm and reach a massive audience."
        defaultHeroRating="4.95/5"
        defaultHeroReviewCount="8,976+ reviews"
        defaultAssuranceCardText="Join over a million satisfied customers, including artists, companies, and top influencers. Our services are <b>100% discreet, secure, and delivered naturally</b> to ensure your account is always safe."
        defaultPackages={VIEW_TABS}
        defaultQualityCompare={{ title: "Compare View Quality", columns: QUALITY_COLUMNS }}
        defaultHowItWorks={{
          title: "How It Works",
          subtitle: "Our process is fast, safe, and designed to deliver the metrics that matter for your channel's growth.",
          steps: STEPS,
        }}
        defaultFAQs={FAQS}
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
          reviews={REVIEWS}
        />
        <DynamicFAQSection />
        <MoreServicesCTA
          title="More Growth Services from Likes.io"
          highlight="Services"
          body="YouTube views are powerful tools, but they're not the only engagements available from Likes.io. Combine them with our subscriber and like boosts to keep your metrics balanced and brand-ready."
          buttons={CTA_BUTTONS}
        />
      </ServicePageContentProvider>
      <Footer />
    </>
  );
}
