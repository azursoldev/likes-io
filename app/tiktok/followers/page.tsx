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
import PackagesSelector, { type PackageTabConfig } from "../../components/PackagesSelector";
import QualityCompare from "../../components/QualityCompare";
import FeaturedOn from "../../components/FeaturedOn";
import AdvantageSection from "../../components/AdvantageSection";
import ReviewsSection, { type ReviewItem } from "../../components/ReviewsSection";
import MoreServicesCTA, { type CTAButton } from "../../components/MoreServicesCTA";
import type { FAQItem } from "../../components/FAQSection";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";

export const metadata: Metadata = {
  title: "Buy TikTok Followers | Likes.io",
  description:
    "Gain instant authority and unlock TikTok features faster. A stronger follower count is the ultimate social proof, attracting organic growth and brand deals.",
};

const TIKTOK_FOLLOWER_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Followers",
    packages: [
      { qty: 100, perLike: "$0.139 / follower", price: "$13.99" },
      { qty: 250, perLike: "$0.124 / follower", price: "$30.99", offText: "Save 5%" },
      { qty: 500, perLike: "$0.090 / follower", price: "$44.99", strike: "$59.99", save: "You Save $15.00", offText: "Best Value" },
      { qty: "1K", perLike: "$0.079 / follower", price: "$79.99", offText: "Popular" },
      { qty: "2.5K", perLike: "$0.068 / follower", price: "$169.99" },
      { qty: "5K", perLike: "$0.060 / follower", price: "$299.99" },
      { qty: "10,000+", perLike: "Custom quote", price: "$—", offText: "Custom" },
    ],
  },
  {
    id: "premium",
    label: "Premium Followers",
    packages: [
      { qty: 100, perLike: "$0.180 / follower", price: "$17.99", offText: "Highest Retention" },
      { qty: 250, perLike: "$0.160 / follower", price: "$39.99" },
      { qty: 500, perLike: "$0.110 / follower", price: "$54.99", strike: "$74.99", save: "You Save $20.00" },
      { qty: "1K", perLike: "$0.099 / follower", price: "$98.99" },
      { qty: "2.5K", perLike: "$0.084 / follower", price: "$209.99" },
      { qty: "5K", perLike: "$0.075 / follower", price: "$374.99" },
      { qty: "10,000+", perLike: "Concierge pricing", price: "$—", offText: "Custom" },
    ],
  },
];

const QUALITY_COLUMNS = [
  {
    title: "High-Quality Followers",
    subtitle: "Budget-friendly audiences that still look authentic on your profile.",
    bullets: [
      "Real-looking TikTok accounts with profile photos",
      "Gradual delivery keeps your growth natural",
      "Ideal for testing niches or new account launches",
      "Split followers across multiple accounts",
      "No password required",
      "24/7 support",
    ],
  },
  {
    title: "Premium Followers",
    subtitle: "For serious creators that need the best retention and algorithmic boost.",
    bullets: [
      "<strong>Followers from ACTIVE users</strong>",
      "<strong>Helps unlock collabs & brand deals faster</strong>",
      "Signals TikTok to recommend your content more",
      "Flexible delivery speed",
      "<strong>Priority 24/7 support</strong>",
      "Extended retention protection",
    ],
    highlight: true,
    badge: "RECOMMENDED",
  },
];

const TIKTOK_STEPS = [
  {
    title: "1. Choose Your Package",
    description: "Select the number of TikTok followers you want to add to your profile.",
  },
  {
    title: "2. Enter Your Username",
    description: "Provide your TikTok username. Your account must be public, but passwords are never required.",
  },
  {
    title: "3. Watch Your Fame Grow",
    description: "Complete checkout and see authentic followers roll in, unlocking new reach within minutes.",
  },
];

const TIKTOK_REVIEWS: ReviewItem[] = [
  {
    handle: "@ViralWorksDesign",
    role: "Verified Buyer",
    text: "The added followers help me launch new design trends with confidence. Clients love the instant credibility.",
  },
  {
    handle: "@DoriEats",
    role: "Verified Buyer",
    text: "Crossing every milestone is easier now. The delivery was fast and looked natural.",
  },
  {
    handle: "@MappingYourDreams",
    role: "Verified Buyer",
    text: "I gained enough followers to get 10,000+ views per upload. Highly recommend for fast traction.",
  },
];

const TIKTOK_FAQS: FAQItem[] = [
  {
    q: "Why is buying TikTok followers a good strategy?",
    a: "Followers equal social proof. A bigger audience attracts real viewers, collaborations, and TikTok's recommendation engine.",
  },
  {
    q: "How does the \"drip-feed\" delivery for TikTok followers work?",
    a: "We can spread delivery over hours or days so the growth curve appears organic, which protects your account.",
  },
  {
    q: "What's the difference between High-Quality and Premium TikTok followers?",
    a: "Premium followers offer the best retention and engagement signals. High-Quality followers are budget-friendly while still looking real.",
  },
  {
    q: "Is it safe for my TikTok account?",
    a: "Yes. We never ask for your password and always follow safe pacing to keep your growth compliant.",
  },
  {
    q: "Will the followers I buy disappear?",
    a: "Minor fluctuations can occur on any platform, but our retention rates are excellent. Premium packages include refill protection.",
  },
];

const CTA_BUTTONS: CTAButton[] = [
  { href: "/tiktok/likes", label: "BUY TIKTOK LIKES", icon: faHeart },
  { href: "/tiktok/views", label: "BUY TIKTOK VIEWS", icon: faEye },
];

export default function Page() {
  notFound();
  return (
    <>
      <Header />
      <ServicePageContentProvider
        platform="tiktok"
        serviceType="followers"
        defaultHeroTitle="Skyrocket Your Influence with TikTok Followers"
        defaultHeroSubtitle="Gain instant authority and unlock TikTok features faster. A stronger follower count is the ultimate social proof, attracting organic growth and brand deals."
        defaultHeroRating="4.9/5"
        defaultHeroReviewCount="12,850+ reviews"
        defaultAssuranceCardText="Join over a million satisfied customers, including artists, companies, and top influencers. Our services are <b>100% discreet, secure, and delivered naturally</b> to ensure your account is always safe."
        defaultPackages={TIKTOK_FOLLOWER_TABS}
        defaultQualityCompare={{ title: "Compare Follower Quality", columns: QUALITY_COLUMNS }}
        defaultHowItWorks={{
          title: "How It Works",
          subtitle: "Our process is straightforward, reliable, and designed for rapid results. Start building your TikTok empire today.",
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
          subtitle="Real reviews from creators and brands who've seen incredible growth with our service."
          reviews={TIKTOK_REVIEWS}
        />
        <DynamicFAQSection />
        <MoreServicesCTA
          title="More Growth Services from Likes.io"
          highlight="Services"
          body="TikTok followers are powerful tools, but they're not the only engagements available from Likes.io. Pair them with our premium like and view boosts to keep your engagement metrics balanced."
          buttons={CTA_BUTTONS}
        />
      </ServicePageContentProvider>
      <Footer />
    </>
  );
}
