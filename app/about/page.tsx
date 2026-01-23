import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutPage from "../components/AboutPage";

export const metadata: Metadata = {
  title: "About Us | Likes.io",
  description: "Learn about Likes.io - our mission, values, and the team behind your social media growth. Discover how we help creators and brands achieve their full potential.",
  alternates: {
    canonical: '/about',
  },
};

export default function Page() {
  return (
    <div className="page-wrapper">
      <Header />
      <AboutPage />
      <Footer />
    </div>
  );
}

