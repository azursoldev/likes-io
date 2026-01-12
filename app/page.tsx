import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import PlatformSection from "./components/PlatformSection";
import ServicesGrid from "./components/ServicesGrid";
import FeaturedOn from "./components/FeaturedOn";
import ReviewsSection from "./components/ReviewsSection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <PlatformSection />
        <ServicesGrid />
        <FeaturedOn />
        <ReviewsSection />
      </main>
      <Footer />
    </>
  );
}
