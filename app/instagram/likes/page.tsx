import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ServiceHero from "../../components/ServiceHero";
import AssuranceCard from "../../components/AssuranceCard";
import PackagesSelector from "../../components/PackagesSelector";
import FeaturedOn from "../../components/FeaturedOn";
import AdvantageSection from "../../components/AdvantageSection";
import HowItWorksSection from "../../components/HowItWorksSection";
import ReviewsSection from "../../components/ReviewsSection";
import FAQSection from "../../components/FAQSection";
import QualityCompare from "../../components/QualityCompare";
import MoreServicesCTA from "../../components/MoreServicesCTA";
export const metadata = {
  title: "Buy Instagram Likes",
  description: "Blank page placeholder for Instagram Likes service.",
};

export default function Page() {
  return (
    <>
      <Header />
      <ServiceHero
        title="Buy Instagram Likes & Go Viral"
        subtitle="Get high-quality, real likes delivered instantly to your posts. Boost credibility, trigger the algorithm, and get your content seen by millions on the Explore Page."
        rating="4.9/5"
        basedon="based on"
        reviewss="1,352+ reviews"
      />
      <AssuranceCard />
      <PackagesSelector />
      <QualityCompare />
      <FeaturedOn />
      <AdvantageSection />
      <HowItWorksSection />
      <ReviewsSection />
      <FAQSection />
      <MoreServicesCTA />
      <Footer />
    </>
  );
}