import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AffiliatePage from "../components/AffiliatePage";

export const metadata: Metadata = {
  title: "Become an Affiliate | Likes.io",
  description: "Join the Likes.io affiliate program and earn 25% recurring commission on every sale. Start earning today by promoting the #1 social media growth service.",
};

export default function Page() {
  return (
    <>
      <Header />
      <AffiliatePage />
      <Footer />
    </>
  );
}


