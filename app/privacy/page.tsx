import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PrivacyPolicyPage from "../components/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Likes.io",
  description: "Your privacy is our priority. Read our Privacy Policy to understand how we collect, use, and protect your personal information.",
};

export default function Page() {
  return (
    <div className="page-wrapper">
      <Header />
      <PrivacyPolicyPage />
      <Footer />
    </div>
  );
}

