import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FreeLikesPage from "../components/FreeLikesPage";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Free Instagram Likes - Get 50 Free Likes | Likes.io",
  description: "Get 50 free Instagram likes instantly! No password required. Experience our high-quality service for free and see real results in minutes.",
  alternates: {
    canonical: '/free-instagram-likes',
  },
};

async function getFreeToolContent() {
  const slug = "free-instagram-likes";
  try {
    let content = await prisma.freeToolPageContent.findUnique({
      where: { slug },
    });

    if (!content) {
      content = await prisma.freeToolPageContent.create({
        data: {
          slug,
          heroTitle: "Get 50 Free Instagram Likes",
          heroDescription: "Experience our high-quality service for free. No password required. See real results in minutes and understand why thousands trust us for their growth.",
          rating: "4.9/5",
          reviewCount: "451+",
        },
      });
    }
    return content;
  } catch (error) {
    console.error("Failed to fetch free tool content:", error);
    return null;
  }
}

async function getTestimonials() {
  try {
    // @ts-ignore - Platform enum might not be updated in generated client yet
    return await prisma.testimonial.findMany({
      where: {
        isApproved: true,
        platform: "FREE_INSTAGRAM",
        serviceType: "LIKES",
      },
      orderBy: {
        displayOrder: "asc",
      },
      select: {
        handle: true,
        role: true,
        text: true,
      }
    });
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

export default async function Page() {
  const content = await getFreeToolContent();
  const testimonials = await getTestimonials();
  
  return (
    <>
      <Header />
      <FreeLikesPage content={content || undefined} testimonials={testimonials} />
      <Footer />
    </>
  );
}
