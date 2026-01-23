import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReviewsPage from "../components/ReviewsPage";

export const metadata: Metadata = {
  title: "Customer Reviews | Likes.io",
  description: "Read authentic customer reviews and testimonials from verified buyers who have used Likes.io services.",
  alternates: {
    canonical: '/reviews',
  },
};

export default function Page() {
  return (
    <>
      <Header />
      <ReviewsPage />
      <Footer />
    </>
  );
}


