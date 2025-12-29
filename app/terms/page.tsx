import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TermsPage from "../components/TermsPage";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Terms of Service | Likes.io",
  description: "Read the Terms of Service for Likes.io. Understand your rights and responsibilities when using our social media marketing services.",
};

async function getTermsData() {
  try {
    // Use raw query because client might not be regenerated
    const result: any[] = await prisma.$queryRaw`
      SELECT * FROM "legal_pages" WHERE "slug" = 'terms' LIMIT 1
    `;
    const legalPage = result[0];
    
    if (!legalPage) {
      return {
        title: "Terms of Service",
        sections: []
      };
    }
    
    return legalPage;
  } catch (error) {
    console.error("Error fetching terms:", error);
    return {
      title: "Terms of Service",
      sections: []
    };
  }
}

export default async function Page() {
  const termsData = await getTermsData();

  return (
    <>
      <Header />
      <TermsPage data={termsData} />
      <Footer />
    </>
  );
}

