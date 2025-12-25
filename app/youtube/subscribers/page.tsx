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
import FeaturedOn from "../../components/FeaturedOn";
import AdvantageSection from "../../components/AdvantageSection";
import ReviewsSection, { type ReviewItem } from "../../components/ReviewsSection";
import MoreServicesCTA, { type CTAButton } from "../../components/MoreServicesCTA";
import type { PackageTabConfig } from "../../components/PackagesSelector";
import type { FAQItem } from "../../components/FAQSection";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Buy YouTube Subscribers | Likes.io",
  description:
    "Grow your YouTube authority faster with high-quality subscribers delivered safely. A stronger subscriber base is the ultimate social proof for brands and viewers.",
};

const SUBSCRIBER_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Subscribers",
    packages: [
      { qty: 50, perLike: "$0.499 / sub", price: "$24.99" },
      { qty: 100, perLike: "$0.420 / sub", price: "$41.99", offText: "Save 5%" },
      { qty: 250, perLike: "$0.300 / sub", price: "$74.99", offText: "Save 10%" },
      { qty: 500, perLike: "$0.070 / sub", price: "$34.99", strike: "$69.99", save: "You Save $35.00", offText: "Best Value" },
      { qty: "1K", perLike: "$0.055 / sub", price: "$54.99", offText: "Hot" },
      { qty: "2.5K", perLike: "$0.044 / sub", price: "$109.99" },
      { qty: "5K", perLike: "$0.036 / sub", price: "$179.99" },
      { qty: "10,000+", perLike: "Custom quote", price: "$—", offText: "Custom" },
    ],
  },
  {
    id: "premium",
    label: "Premium Subscribers",
    packages: [
      { qty: 50, perLike: "$0.620 / sub", price: "$30.99", offText: "Higher Retention" },
      { qty: 100, perLike: "$0.540 / sub", price: "$53.99" },
      { qty: 250, perLike: "$0.420 / sub", price: "$104.99", offText: "Save 10%" },
      { qty: 500, perLike: "$0.090 / sub", price: "$44.99", strike: "$89.99", save: "You Save $45.00", offText: "Recommended" },
      { qty: "1K", perLike: "$0.080 / sub", price: "$79.99" },
      { qty: "2.5K", perLike: "$0.068 / sub", price: "$169.99" },
      { qty: "5K", perLike: "$0.058 / sub", price: "$289.99" },
      { qty: "10,000+", perLike: "Concierge pricing", price: "$—", offText: "Custom" },
    ],
  },
];

const QUALITY_COLUMNS = [
  {
    title: "High-Quality Subscribers",
    subtitle: "Great for improving social proof and unlocking channel features.",
    bullets: [
      "<strong>REAL-LOOKING</strong> subscribers with profile photos",
      "Natural delivery to protect channel health",
      "Ideal for new creators and brand launches",
      "Split subscribers across multiple channels",
      "No password or access needed",
      "24/7 support",
    ],
  },
  {
    title: "Premium Subscribers",
    subtitle: "Maximum retention and authority for channels that need rapid growth.",
    bullets: [
      "<strong>Subscribers from active YouTube viewers</strong>",
      "<strong>Highest chance to impress sponsors</strong>",
      "Helps YouTube recommend your content more",
      "Flexible drip or instant delivery",
      "<strong>Priority 24/7 support</strong>",
      "Extended refill guarantee",
    ],
    highlight: true,
    badge: "RECOMMENDED",
  },
];

const STEPS = [
  {
    title: "1. Choose Your Package",
    description: "Select the number of subscribers you need to reach your next milestone.",
  },
  {
    title: "2. Provide Your Channel URL",
    description: "Paste the URL of your YouTube channel so we know where to send subscribers. No password required.",
  },
  {
    title: "3. See Your Channel Grow",
    description: "Complete checkout and watch your subscriber base and authority rise safely.",
  },
];

const REVIEWS: ReviewItem[] = [
  {
    handle: "@DocumentaryCreators",
    role: "Verified Buyer",
    text: "Getting to 10K subscribers unlocked collaborations and ad deals we’d been chasing for months.",
  },
  {
    handle: "@MusicIntro",
    role: "Verified Buyer",
    text: "Launching a new album roll-out is easier when the channel already looks trusted. Subscribers arrived exactly as promised.",
  },
  {
    handle: "@CreativeSchoolWorkshop",
    role: "Verified Buyer",
    text: "We hit monetization in record time. This jumpstarted our credibility with prospective students and sponsors.",
  },
];

const FAQS: FAQItem[] = [
  {
    q: "Is it safe to buy subscribers for my YouTube channel?",
    a: "Yes. We never ask for passwords and deliver subscribers gradually so your channel stays compliant.",
  },
  {
    q: "Can buying subscribers help my channel get monetized faster?",
    a: "A larger subscriber base boosts trust and helps you reach the 1K requirement. Pair it with strong watch time for monetization.",
  },
  {
    q: "How does the refill guarantee for YouTube subscribers work?",
    a: "Premium packages include automatic refills if you experience noticeable drops beyond normal platform fluctuations.",
  },
  {
    q: "Are these real subscribers? Will they watch my videos?",
    a: "We source high-quality profiles that behave like typical viewers. While views aren’t guaranteed, the social proof helps attract real audiences.",
  },
  {
    q: "Is it safe for my AdSense account?",
    a: "Absolutely. Our delivery methods follow safe pacing so your channel remains in good standing with AdSense and YouTube.",
  },
  {
    q: "How long does delivery take for subscribers?",
    a: "Most orders start within minutes and complete within the estimated window shown at checkout, depending on package size.",
  },
];

const CTA_BUTTONS: CTAButton[] = [
  { href: "/youtube/views", label: "BUY YOUTUBE VIEWS", icon: faEye },
  { href: "/youtube/likes", label: "BUY YOUTUBE LIKES", icon: faThumbsUp },
];

export default async function Page() {
  const content = await prisma.servicePageContent.findUnique({
    where: { platform_serviceType: { platform: "YOUTUBE", serviceType: "SUBSCRIBERS" } },
  });
  if (content?.slug) {
    notFound();
  }
  return (
    <>
      <Header />
      <ServicePageContentProvider
        platform="youtube"
        serviceType="subscribers"
        defaultHeroTitle="Build Your YouTube Empire with Subscribers"
        defaultHeroSubtitle="Gain instant authority and unlock YouTube features faster. A strong subscriber base is the ultimate social proof for your channel, attracting more organic viewers and collaborations."
        defaultHeroRating="4.9/5"
        defaultHeroReviewCount="9,912+ reviews"
        defaultAssuranceCardText="Join over a million satisfied customers, including artists, companies, and top influencers. Our services are <b>100% discreet, secure, and delivered naturally</b> to ensure your account is always safe."
        defaultPackages={SUBSCRIBER_TABS}
        defaultQualityCompare={{ title: "Compare Subscriber Quality", columns: QUALITY_COLUMNS }}
        defaultHowItWorks={{
          title: "How It Works",
          subtitle: "Build your channel's reputation and authority with our simple three-step process.",
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
          body="YouTube subscribers are powerful tools, but they're not the only engagements available from Likes.io. Pair them with our premium view and like boosts to keep engagement metrics balanced and boost algorithm trust."
          buttons={CTA_BUTTONS}
        />
      </ServicePageContentProvider>
      <Footer />
    </>
  );
}
