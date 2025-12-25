import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
import LearnMoreSection from "../../components/LearnMoreSection";
import FeaturedOn from "../../components/FeaturedOn";
import AdvantageSection from "../../components/AdvantageSection";
import ReviewsSection, { type ReviewItem } from "../../components/ReviewsSection";
import MoreServicesCTA, { type CTAButton } from "../../components/MoreServicesCTA";
import type { PackageTabConfig } from "../../components/PackagesSelector";
import type { FAQItem } from "../../components/FAQSection";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Buy Instagram Followers | Likes.io",
  description: "Gain instant authority with high-quality Instagram followers delivered safely and naturally. Boost social proof, attract partnerships, and unlock organic growth.",
};

const INSTAGRAM_FOLLOWER_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Followers",
    packages: [
      { qty: 100, perLike: "$0.045 / follower", price: "$4.49", offText: "Starter" },
      { qty: 250, perLike: "$0.040 / follower", price: "$9.99", offText: "Save 10%" },
      { qty: 500, perLike: "$0.032 / follower", price: "$15.99", strike: "$22.99", save: "You Save $7.00", offText: "Hot" },
      { qty: "1K", perLike: "$0.028 / follower", price: "$27.99", offText: "Popular" },
      { qty: "2.5K", perLike: "$0.025 / follower", price: "$62.49", offText: "Best Value" },
      { qty: "5K", perLike: "$0.022 / follower", price: "$109.99" },
      { qty: "10,000+", perLike: "Custom pricing", price: "$—", offText: "Custom" },
    ],
  },
  {
    id: "premium",
    label: "Premium Followers",
    packages: [
      { qty: 100, perLike: "$0.065 / follower", price: "$6.49", offText: "Higher Retention" },
      { qty: 250, perLike: "$0.058 / follower", price: "$14.49" },
      { qty: 500, perLike: "$0.050 / follower", price: "$24.99", strike: "$34.99", save: "You Save $10.00", offText: "Hot" },
      { qty: "1K", perLike: "$0.042 / follower", price: "$41.99", offText: "Recommended" },
      { qty: "2.5K", perLike: "$0.038 / follower", price: "$94.99" },
      { qty: "5K", perLike: "$0.034 / follower", price: "$169.99" },
      { qty: "10,000+", perLike: "Concierge pricing", price: "$—", offText: "Custom" },
    ],
  },
];

const QUALITY_COLUMNS = [
  {
    title: "High-Quality Followers",
    subtitle: "Authentic-looking accounts that deliver steady credibility.",
    bullets: [
      "<strong>REAL-LOOKING</strong> profiles with photos & bios",
      "Safe delivery pace to keep growth natural",
      "Perfect for new brands and creators testing formats",
      "Split followers across multiple accounts",
      "No password required",
      "24/7 support",
    ],
  },
  {
    title: "Premium Followers",
    subtitle: "Top-tier audiences for campaigns that demand the best.",
    bullets: [
      "<strong>Highest quality</strong> accounts with real activity",
      "<strong>Maximum chance</strong> to spark organic follows",
      "Ideal for launches, partnerships, and press pushes",
      "Flexible drip or instant delivery",
      "<strong>Priority retention protection</strong>",
      "Dedicated success manager",
    ],
    highlight: true,
    badge: "RECOMMENDED",
  },
];

const INSTAGRAM_STEPS = [
  {
    title: "1. Select Your Package",
    description: "Choose the number of high-quality or premium followers you need to hit your growth goals.",
  },
  {
    title: "2. Provide Your Username",
    description: "Enter your Instagram username. We never ask for passwords or intrusive permissions.",
  },
  {
    title: "3. Watch Your Account Grow",
    description: "Complete the secure checkout and see your follower count rise naturally and reliably.",
  },
];

const INSTAGRAM_REVIEWS: ReviewItem[] = [
  {
    handle: "@StyleEdit",
    role: "Verified Buyer",
    text: "The boost in followers helped us land collaborations faster. Everything looked organic and delivered in hours.",
  },
  {
    handle: "@MealPrep_Fitness",
    role: "Verified Buyer",
    text: "I finally crossed 10K followers and unlocked swipe-up links. Likes.io made it effortless and safe.",
  },
  {
    handle: "@MusicMaven",
    role: "Verified Buyer",
    text: "Industry outreach is so much easier now. The social proof from these followers helps every pitch.",
  },
];

const INSTAGRAM_FAQS: FAQItem[] = [
  {
    q: "Why should I buy Instagram followers?",
    a: "A higher follower count instantly increases trust, attracts partnerships, and helps your content perform better in Explore and search.",
  },
  {
    q: "How long does it take to get the Instagram followers?",
    a: "Delivery typically starts within minutes. Depending on your package size, completion can take from an hour to a couple of days for maximum safety.",
  },
  {
    q: "What happens if the Instagram followers I bought unfollow me?",
    a: "We include retention protection. If you notice drops beyond natural variation, contact support for a quick refill.",
  },
  {
    q: "Is it safe to buy followers on Instagram?",
    a: "Yes. We never ask for your password and follow secure delivery practices that keep your account compliant.",
  },
  {
    q: "Does a higher follower count really drive more organic followers?",
    a: "Yes. Social proof encourages real users to follow you, especially when they see strong engagement levels.",
  },
  {
    q: "What is the difference between High-Quality and Premium followers?",
    a: "Premium followers provide the highest retention and activity. High-Quality followers are budget-friendly while still looking authentic.",
  },
];

const CTA_BUTTONS: CTAButton[] = [
  { platform: "instagram", serviceType: "likes", label: "BUY LIKES", icon: faThumbsUp },
  { platform: "instagram", serviceType: "views", label: "BUY VIEWS", icon: faEye },
];

export default async function Page() {
  const content = await prisma.servicePageContent.findUnique({
    where: { platform_serviceType: { platform: "INSTAGRAM", serviceType: "FOLLOWERS" } },
  });
  if (content?.slug) {
    notFound();
  }
  return (
    <>
      <Header />
      <ServicePageContentProvider
        platform="instagram"
        serviceType="followers"
        defaultHeroTitle="Buy Instagram Followers & Become an Authority"
        defaultHeroSubtitle="Gain instant credibility with high-quality, real followers delivered safely in minutes. A strong follower count is the ultimate social proof to attract organic growth and unlock new revenue streams."
        defaultHeroRating="4.98/5"
        defaultHeroReviewCount="1,823+ reviews"
        defaultAssuranceCardText="Join over a million satisfied customers, including artists, companies, and top influencers. Our services are <b>100% discreet, secure, and delivered naturally</b> to ensure your account is always safe."
        defaultPackages={INSTAGRAM_FOLLOWER_TABS}
        defaultQualityCompare={{ title: "Compare Follower Quality", columns: QUALITY_COLUMNS }}
        defaultHowItWorks={{
          title: "How It Works",
          subtitle: "Growing your follower count is the fastest way to build credibility and expand your reach. See how simple it is to get started.",
          steps: INSTAGRAM_STEPS,
        }}
        defaultFAQs={INSTAGRAM_FAQS}
      >
        <DynamicServiceHero />
        <DynamicAssuranceCard />
        <LearnMoreSection text="Learn More About Instagram Followers" />
        <DynamicPackagesSelector />
        <DynamicQualityCompare />
        <FeaturedOn />
        <AdvantageSection />
        <DynamicHowItWorks />
        <ReviewsSection
          title="Loved by Creators Worldwide"
          subtitle="Real reviews from creators and brands who've seen incredible growth with our services."
          reviews={INSTAGRAM_REVIEWS}
        />
        <DynamicFAQSection />
        <MoreServicesCTA
          title="More Growth Services from Likes.io"
          highlight="Services"
          body="Instagram followers are powerful tools, but they're not the only engagements available from Likes.io. Pair them with targeted likes or views to keep your engagement metrics even more balanced."
          buttons={CTA_BUTTONS}
        />
      </ServicePageContentProvider>
      <Footer />
    </>
  );
}
