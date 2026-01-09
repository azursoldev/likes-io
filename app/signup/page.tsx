import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SignupPage from "../components/SignupPage";

export const metadata: Metadata = {
  title: "Create Your Account | Likes.io",
  description: "Create a new account on Likes.io to start boosting your social media presence.",
};

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="page-wrapper">
      <Header />
      <SignupPage />
      <Footer />
    </div>
  );
}
