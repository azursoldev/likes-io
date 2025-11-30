import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TeamPage from "../components/TeamPage";

export const metadata: Metadata = {
  title: "Our Team | Likes.io",
  description: "Meet the passionate team behind Likes.io - strategists, engineers, and creatives dedicated to helping you succeed in the digital world.",
};

export default function Page() {
  return (
    <>
      <Header />
      <TeamPage />
      <Footer />
    </>
  );
}

