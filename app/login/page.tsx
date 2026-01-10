import type { Metadata } from "next";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth-options";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginPage from "../components/LoginPage";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Sign In | Likes.io",
  description: "Sign in to your Likes.io account to access your dashboard, manage orders, and boost your social media presence.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession(authOptions);

  if (session) {
    const callbackUrl = searchParams?.callbackUrl;
    if (typeof callbackUrl === "string" && callbackUrl) {
      redirect(callbackUrl);
    }
    redirect("/dashboard");
  }

  let dbSiteKey = null;
  try {
    const result: any = await prisma.$queryRaw`SELECT * FROM "admin_settings" LIMIT 1`;
    const settings = Array.isArray(result) && result.length > 0 ? result[0] : null;
    if (settings && settings.recaptchaSiteKey) {
      dbSiteKey = settings.recaptchaSiteKey as string;
    }
  } catch {}

  return (
    <div className="page-wrapper">
      <Header />
      <Suspense fallback={<div className="container py-20 text-center">Loading...</div>}>
        <LoginPage dbSiteKey={dbSiteKey} />
      </Suspense>
      <Footer />
    </div>
  );
}
