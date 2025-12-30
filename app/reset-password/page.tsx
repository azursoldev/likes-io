import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ResetPasswordPage from "../components/ResetPasswordPage";

export const metadata: Metadata = {
  title: "Reset Password | Likes.io",
  description: "Set a new password for your Likes.io account.",
};

export default function Page({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token || "";
  return (
    <div className="page-wrapper">
      <Header />
      <ResetPasswordPage token={token} />
      <Footer />
    </div>
  );
}

