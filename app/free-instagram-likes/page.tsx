import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FreeLikesPage from "../components/FreeLikesPage";

export const metadata: Metadata = {
  title: "Free Instagram Likes - Get 50 Free Likes | Likes.io",
  description: "Get 50 free Instagram likes instantly! No password required. Experience our high-quality service for free and see real results in minutes.",
};

export default function Page() {
  return (
    <>
      <Header />
      <FreeLikesPage />
      <Footer />
    </>
  );
}


