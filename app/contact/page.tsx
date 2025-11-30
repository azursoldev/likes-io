import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactPage from "../components/ContactPage";

export const metadata: Metadata = {
  title: "Contact Us | Likes.io",
  description: "Get in touch with Likes.io. Our support team is available 24/7 to assist you with any questions, billing inquiries, or help you need.",
};

export default function Page() {
  return (
    <>
      <Header />
      <ContactPage />
      <Footer />
    </>
  );
}

