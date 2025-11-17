import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import FeaturedOn from "./components/FeaturedOn";
import PlatformSection from "./components/PlatformSection";
import GetStarted from "./components/GetStarted";
import InfluenceSection from "./components/InfluenceSection";
import ReviewsSection from "./components/ReviewsSection";
import FAQSection from "./components/FAQSection";
import QuickStartSection from "./components/QuickStartSection";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <FeaturedOn />
      <PlatformSection />
      <GetStarted />
      <InfluenceSection />
      <ReviewsSection />
      <FAQSection />
      <QuickStartSection />
      <Footer />
    </main>
  );
}