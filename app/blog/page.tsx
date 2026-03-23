import BlogPage from "../components/BlogPage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Likes.io",
  description:
    "The latest news, strategies, and insights to help you master your social media growth.",
  alternates: {
    canonical: "/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <BlogPage />
      <Footer />
    </>
  );
}
