import type { Metadata } from "next";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServiceHero from "../../components/ServiceHero";
import AssuranceCard from "../../components/AssuranceCard";
import PackagesSelector, { type PackageTabConfig } from "../../components/PackagesSelector";
import QualityCompare from "../../components/QualityCompare";
import FeaturedOn from "../../components/FeaturedOn";
import AdvantageSection from "../../components/AdvantageSection";
import HowItWorksSection from "../../components/HowItWorksSection";
import ReviewsSection, { type ReviewItem } from "../../components/ReviewsSection";
import FAQSection, { type FAQItem } from "../../components/FAQSection";
import MoreServicesCTA, { type CTAButton } from "../../components/MoreServicesCTA";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Buy TikTok Views | Likes.io",
  description:
    "Amplify your reach and trigger the TikTok algorithm with high-quality video views. Get the social proof you need to go viral and land on the For You Page.",
};

const TIKTOK_VIEW_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Views",
    packages: [
      { qty: 500, perLike: "$0.010 / view", price: "$4.99", strike: "$9.99", save: "You Save $5.00", offText: "Hot" },
      { qty: "1K", perLike: "$0.009 / view", price: "$8.99", offText: "Best Value" },
      { qty: "2.5K", perLike: "$0.008 / view", price: "$19.99" },
      { qty: "5K", perLike: "$0.007 / view", price: "$34.99" },
      { qty: "10K", perLike: "$0.006 / view", price: "$59.99" },
      { qty: "25K", perLike: "$0.005 / view", price: "$119.99" },
      { qty: "50K", perLike: "$0.004 / view", price: "$189.99" },
      { qty: "100,000+", perLike: "Custom quote", price: "$—", offText: "Custom" },
    ],
  },
  {
    id: "premium",
    label: "Premium Views",
    packages: [
      { qty: 500, perLike: "$0.013 / view", price: "$6.49", offText: "High Retention" },
      { qty: "1K", perLike: "$0.012 / view", price: "$11.99" },
      { qty: "2.5K", perLike: "$0.011 / view", price: "$26.99", offText: "Save 10%" },
      { qty: "5K", perLike: "$0.010 / view", price: "$47.99" },
      { qty: "10K", perLike: "$0.009 / view", price: "$74.99" },
      { qty: "25K", perLike: "$0.008 / view", price: "$159.99" },
      { qty: "50K", perLike: "$0.007 / view", price: "$279.99" },
      { qty: "100,000+", perLike: "Concierge pricing", price: "$—", offText: "Custom" },
    ],
  },
];

const QUALITY_COLUMNS = [
  {
    title: "High-Quality Views",
    subtitle: "Great for quick boosts that help your videos stand out.",
    bullets: [
      "Real video views",
      "Fast delivery times",
      "Works on Reels & native videos",
      "Optional drip schedule",
      "No password needed",
      "24/7 support",
    ],
  },
  {
    title: "Premium Views",
    subtitle: "Maximum retention, perfect for campaigns.",
    bullets: [
      "<strong>High-retention views from ACTIVE users</strong>",
      "<strong>Higher chance to reach Explore & For You</strong>",
      "Boosts credibility instantly",
      "Great for collabs and brand launches",
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
    description: "Choose the number of views you want along with your preferred plan and budget.",
  },
  {
    title: "2. Provide Your Video Link",
    description: "Simply paste the link to your TikTok video. We only need the URL—not your password.",
  },
  {
    title: "3. Watch Your Views Climb",
    description: "Complete your order and watch as real viewers push your content higher within minutes.",
  },
];

const REVIEWS: ReviewItem[] = [
  {
    handle: "@ClipDance",
    role: "Verified Buyer",
    text: "Instant surge in views. My video landed on the For You Page the same day.",
  },
  {
    handle: "@MagicTricks",
    role: "Verified Buyer",
    text: "Needed momentum for a TikTok challenge and this did the trick. Views looked organic.",
  },
  {
    handle: "@StoryTimeSasha",
    role: "Verified Buyer",
    text: "Every launch we run gets more inbound leads now because our videos look popular immediately.",
  },
];

const FAQS: FAQItem[] = [
  {
    q: "Why are views so important on TikTok?",
    a: "TikTok prioritizes videos that gain traction quickly. More views signal that your content is worth pushing to new audiences.",
  },
  {
    q: "Do the views I buy count towards the Creator Fund requirements?",
    a: "Yes, they count as real view metrics, helping you meet the thresholds for monetization programs.",
  },
  {
    q: "What are “High-Retention” views for TikTok?",
    a: "These are views from profiles that watch your video longer, giving you better watch-time signals and higher organic reach.",
  },
  {
    q: "Is the delivery instant?",
    a: "Delivery begins within minutes. You can choose instant or drip scheduling depending on your needs.",
  },
  {
    q: "Are the views permanent?",
    a: "Yes. Our views are stable. Should minor drops occur, premium packages include retention protection.",
  },
];

const CTA_BUTTONS: CTAButton[] = [
  { href: "/tiktok/likes", label: "BUY TIKTOK LIKES", icon: faHeart },
  { href: "/tiktok/followers", label: "BUY TIKTOK FOLLOWERS", icon: faUserPlus },
];

export default function Page() {
  return (
    <>
      <Header />
      <ServiceHero
        title="Go Viral on TikTok with Instant Views"
        subtitle="Amplify your reach and trigger the TikTok algorithm with high-quality video views. Get the social proof you need to go viral and land on the For You Page."
        rating="4.9/5"
        basedon="based on"
        reviewss="15,065+ reviews"
      />
      <AssuranceCard />
      <PackagesSelector
        tabsConfig={TIKTOK_VIEW_TABS}
        metricLabel="Views"
        defaultQtyTarget="5K"
        ctaTemplate="Buy {qty} TikTok Views Now"
      />
      <QualityCompare title="Compare View Quality" columns={QUALITY_COLUMNS} />
      <FeaturedOn />
      <AdvantageSection />
      <HowItWorksSection
        title="How It Works"
        subtitle="Our process is simple, fast, and secure. Get the views you need to make your videos stand out."
        steps={STEPS}
      />
      <ReviewsSection
        title="Loved by Creators Worldwide"
        subtitle="Real reviews from creators and brands who've seen incredible growth with our service."
        reviews={REVIEWS}
      />
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Have questions? We've got answers. If you don't see your question here, feel free to contact us."
        faqs={FAQS}
      />
      <MoreServicesCTA
        title="More Growth Services from Likes.io"
        highlight="Services"
        body="TikTok views are powerful tools, but they're not the only engagements available from Likes.io. Pair them with our premium like and follower campaigns to round out your engagement metrics."
        buttons={CTA_BUTTONS}
      />
      <Footer />
    </>
  );
}

