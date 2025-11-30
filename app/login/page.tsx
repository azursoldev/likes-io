import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginPage from "../components/LoginPage";

export const metadata: Metadata = {
  title: "Sign In | Likes.io",
  description: "Sign in to your Likes.io account to access your dashboard, manage orders, and boost your social media presence.",
};

export default function Page() {
  return (
    <>
      <Header />
      <LoginPage />
      <Footer />
    </>
  );
}

