import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FreeFollowersPage from "../components/FreeFollowersPage";

export const metadata: Metadata = {
  title: "Free Instagram Followers - Get 25 Free Followers | Likes.io",
  description: "Get 25 free Instagram followers instantly! No password required. Experience our high-quality service for free and see real results in minutes.",
};

export default function Page() {
  return (
    <>
      <Header />
      <FreeFollowersPage />
      <Footer />
    </>
  );
}

