import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQPage from "../components/FAQPage";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Likes.io",
  description: "Find answers to common questions about Likes.io services, orders, account safety, and billing.",
};

export default function Page() {
  return (
    <>
      <Header />
      <FAQPage />
      <Footer />
    </>
  );
}

