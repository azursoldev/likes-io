import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FreeFollowersPage from "../components/FreeFollowersPage";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Free Instagram Followers - Get 25 Free Followers | Likes.io",
  description: "Get 25 free Instagram followers instantly! No password required. Experience our high-quality service for free and see real results in minutes.",
  alternates: {
    canonical: '/free-instagram-followers',
  },
};

async function getFreeToolContent() {
  const slug = "free-instagram-followers";
  try {
    let content = await prisma.freeToolPageContent.findUnique({
      where: { slug },
    });

    if (!content) {
      content = await prisma.freeToolPageContent.create({
        data: {
          slug,
          heroTitle: "Get 25 Free Instagram Followers",
          heroDescription: "Experience our high-quality service for free. No password required. See real results in minutes and understand why thousands trust us for their growth.",
          rating: "4.9/5",
          reviewCount: "512+",
        },
      });
    }
    return content;
  } catch (error) {
    console.error("Failed to fetch free tool content:", error);
    return null;
  }
}

export default async function Page() {
  const content = await getFreeToolContent();
  
  return (
    <>
      <Header />
      <FreeFollowersPage content={content || undefined} />
      <Footer />
    </>
  );
}
