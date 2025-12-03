import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SignupPage from "../components/SignupPage";

export const metadata: Metadata = {
  title: "Create Your Account | Likes.io",
  description: "Create a new account on Likes.io to start boosting your social media presence.",
};

export default function Page() {
  return (
    <div className="page-wrapper">
      <Header />
      <SignupPage />
      <Footer />
    </div>
  );
}

