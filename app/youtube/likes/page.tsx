import type { Metadata } from "next";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";

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

export const metadata: Metadata = {
  title: "Buy YouTube Likes | Real & Instant Likes.io",
  description: "Increase your video's like-to-dislike ratio, boost social proof, and signal to the YouTube algorithm that viewers love your content.",
};

const YOUTUBE_PACKAGE_TABS: PackageTabConfig[] = [
  {
    id: "high",
    label: "High-Quality Likes",
    packages: [
      { qty: 50, perLike: "$0.119 / like", price: "$5.99", offText: "Starter" },
      { qty: 100, perLike: "$0.110 / like", price: "$10.99", offText: "Save 5%" },
      { qty: 250, perLike: "$0.092 / like", price: "$22.99", offText: "Save 10%" },
      { qty: 500, perLike: "$0.034 / like", price: "$16.99", strike: "$24.99", save: "You Save $7.00", offText: "Best Value" },
      { qty: "1K", perLike: "$0.021 / like", price: "$20.99", offText: "Popular" },
      { qty: "2.5K", perLike: "$0.019 / like", price: "$47.99" },
      { qty: "5K", perLike: "$0.017 / like", price: "$84.99" },
      { qty: "10K+", perLike: "Custom pricing", price: "$—", offText: "Custom" },
    ],
  },
  {
    id: "premium",
    label: "Premium Likes",
    packages: [
      { qty: 50, perLike: "$0.150 / like", price: "$7.49", offText: "Higher Retention" },
      { qty: 100, perLike: "$0.140 / like", price: "$13.99" },
      { qty: 250, perLike: "$0.120 / like", price: "$29.99", offText: "Save 10%" },
      { qty: 500, perLike: "$0.045 / like", price: "$22.99", strike: "$32.99", save: "You Save $10.00", offText: "Hot" },
      { qty: "1K", perLike: "$0.035 / like", price: "$34.99", offText: "Recommended" },
      { qty: "2.5K", perLike: "$0.029 / like", price: "$72.99" },
      { qty: "5K", perLike: "$0.025 / like", price: "$124.99" },
      { qty: "10K+", perLike: "Concierge pricing", price: "$—", offText: "Custom" },
    ],
  },
];

const QUALITY_COLUMNS = [
  {
    title: "High-Quality Likes",
    subtitle: "Great for quick boosts to your like-to-dislike ratio and social proof.",
    bullets: [
      "<strong>REAL</strong> likes from real-looking YouTube viewers",
      "Smooth, natural delivery to protect video health",
      "Ideal for new uploads and experimenting with formats",
      "Split likes across multiple videos",
      "No channel login required",
      "Always-on support",
    ],
  },
  {
    title: "Premium Likes",
    subtitle: "Best for creators who need top retention and algorithmic impact.",
    bullets: [
      "<strong>Engagement from highly active YouTube accounts</strong>",
      "<strong>Maximum signal boost for Suggested & Browse features</strong>",
      "Helps new viewers trust your content instantly",
      "Flexible drip or instant delivery schedules",
      "<strong>Priority support + extended retention guarantee</strong>",
      "Perfect for promos, premieres, and collaborations",
    ],
    highlight: true,
    badge: "RECOMMENDED",
  },
];

const YOUTUBE_STEPS = [
  {
    title: "1. Choose Your Package",
    description: "Pick the number of high-quality or premium likes you want for your video.",
  },
  {
    title: "2. Provide Your Video URL",
    description: "Paste the link to the YouTube video(s) you want to boost. No password needed.",
  },
  {
    title: "3. See Your Engagement Grow",
    description: "Checkout securely and watch your likes increase, improving social proof and visibility.",
  },
];

const YOUTUBE_REVIEWS: ReviewItem[] = [
  {
    handle: "@GamingGuru",
    role: "Verified Buyer",
    text: "The YouTube likes service is great for new uploads, especially when I need quick credibility before a sponsorship drop.",
  },
  {
    handle: "@VlogLife",
    role: "Verified Buyer",
    text: "A high like count gave my travel vlog the social proof it needed. My audience growth felt organic and sustainable.",
  },
  {
    handle: "@GuitarChannel",
    role: "Verified Buyer",
    text: "My videos on new gear announcements always need traction fast. These likes kickstart engagement perfectly.",
  },
];

const YOUTUBE_FAQS: FAQItem[] = [
  {
    q: "Why is a high like count important on YouTube?",
    a: "Likes influence how viewers perceive your content and how the algorithm ranks it. More likes signal quality and keep people watching.",
  },
  {
    q: "Does buying YouTube likes help my videos get recommended more often?",
    a: "Higher engagement metrics such as likes, watch time, and comments help videos enter Suggested and Browse feeds more frequently.",
  },
  {
    q: "Are the likes from real YouTube accounts?",
    a: "Yes. We work with high-quality profiles that look authentic and mimic typical viewer behavior.",
  },
  {
    q: "Will the likes be removed by YouTube?",
    a: "We deliver likes gradually and safely. While small drops can happen on any platform, our retention rates are excellent and refills are available for premium orders.",
  },
  {
    q: "Is it safe to buy YouTube likes for my channel?",
    a: "Absolutely. We never ask for passwords and operate within safe limits to protect your channel.",
  },
  {
    q: "How fast will my likes arrive?",
    a: "Delivery usually begins within minutes after checkout and can be instant or drip-fed depending on your preference.",
  },
  {
    q: "Can I split likes across multiple videos?",
    a: "Yes, just provide the video URLs and amounts for each during checkout, and we'll distribute them accordingly.",
  },
];

const CTA_BUTTONS: CTAButton[] = [
  { href: "/youtube/views", label: "BUY YOUTUBE VIEWS", icon: faEye },
  { href: "/youtube/subscribers", label: "BUY YOUTUBE SUBSCRIBERS", icon: faUserPlus },
];

export default function Page() {
  return (
    <>
      <Header />
      <ServiceHero
        title="Increase Engagement with YouTube Likes"
        subtitle="Improve your video's like-to-dislike ratio, increase its social proof, and signal to the YouTube algorithm that your content is valuable and engaging."
        rating="4.9/5"
        basedon="based on"
        reviewss="2,989+ reviews"
      />
      <AssuranceCard />
      <PackagesSelector
        tabsConfig={YOUTUBE_PACKAGE_TABS}
        metricLabel="Likes"
        defaultQtyTarget={500}
        ctaTemplate="Buy {qty} YouTube Likes Now"
      />
      <QualityCompare title="Compare Like Quality" columns={QUALITY_COLUMNS} />
      <FeaturedOn />
      <AdvantageSection />
      <HowItWorksSection
        title="How It Works"
        subtitle="Boosting your video's like count is a simple and effective way to increase its social proof and appeal."
        steps={YOUTUBE_STEPS}
      />
      <ReviewsSection
        title="Loved by Creators Worldwide"
        subtitle="Real reviews from creators and brands who've seen incredible growth with our service."
        reviews={YOUTUBE_REVIEWS}
      />
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Have questions? We've got answers. If you don't see your question here, contact support anytime."
        faqs={YOUTUBE_FAQS}
      />
      <MoreServicesCTA
        title="More Growth Services from Likes.io"
        highlight="Services"
        body="YouTube likes are powerful tools, but they're not the only engagements available from Likes.io. Pair them with our premium view and subscriber campaigns to make every upload pop."
        buttons={CTA_BUTTONS}
      />
      <Footer />
    </>
  );
}

