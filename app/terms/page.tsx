import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TermsPage from "../components/TermsPage";

export const metadata: Metadata = {
  title: "Terms of Service | Likes.io",
  description: "Read the Terms of Service for Likes.io. Understand your rights and responsibilities when using our social media marketing services.",
};

export default function Page() {
  return (
    <>
      <Header />
      <TermsPage />
      <Footer />
    </>
  );
}

