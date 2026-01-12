import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import PlatformSection from "./components/PlatformSection";
import InfluenceSection from "./components/InfluenceSection";
import AdvantageSection from "./components/AdvantageSection";
import QuickStartSection from "./components/QuickStartSection";
import FeaturedOn from "./components/FeaturedOn";
import ReviewsSection from "./components/ReviewsSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PlatformSection />
        <InfluenceSection />
        <AdvantageSection />
        <FeaturedOn />
        {/* <ReviewsSection /> */}
        <QuickStartSection />
      </main>
      <Footer />
    </>
  );
}
