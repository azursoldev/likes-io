import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ForgotPasswordPage from "../components/ForgotPasswordPage";

export const metadata: Metadata = {
  title: "Forgot Password | Likes.io",
  description: "Reset your Likes.io account password securely.",
};

export default function Page() {
  return (
    <div className="page-wrapper">
      <Header />
      <ForgotPasswordPage />
      <Footer />
    </div>
  );
}

