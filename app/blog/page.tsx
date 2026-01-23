import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BlogPage from "../components/BlogPage";

export const metadata: Metadata = {
  title: "Blog | Likes.io",
  description: "The latest news, strategies, and insights to help you master your social media growth.",
  alternates: {
    canonical: '/blog',
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

