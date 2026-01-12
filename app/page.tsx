import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import PlatformSection from "./components/PlatformSection";
import GetStarted from "./components/GetStarted";
import InfluenceSection from "./components/InfluenceSection";
import AdvantageSection from "./components/AdvantageSection";
import FAQSection from "./components/FAQSection";
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
        <GetStarted />
        <InfluenceSection />
        <AdvantageSection />
        <FeaturedOn />
        {/* <ReviewsSection /> */}
         <FAQSection category="homepage" />
        <QuickStartSection />
      </main>
      <Footer />
    </>
  );
}
