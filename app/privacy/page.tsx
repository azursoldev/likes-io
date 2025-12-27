import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PrivacyPolicyPage from "../components/PrivacyPolicyPage";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Privacy Policy | Likes.io",
  description: "Your privacy is our priority. Read our Privacy Policy to understand how we collect, use, and protect your personal information.",
};

import { PRIVACY_DEFAULT_SECTIONS } from "@/lib/legal-defaults";

async function getPrivacyData() {
  try {
    // Use raw query because client might not be regenerated
    const result: any[] = await prisma.$queryRaw`
      SELECT * FROM "legal_pages" WHERE "slug" = 'privacy' LIMIT 1
    `;
    const legalPage = result[0];

    if (!legalPage) {
      return {
        title: "Privacy Policy",
        sections: PRIVACY_DEFAULT_SECTIONS
      };
    }

    return legalPage;
  } catch (error) {
    console.error("Error fetching privacy:", error);
    return {
      title: "Privacy Policy",
      sections: PRIVACY_DEFAULT_SECTIONS
    };
  }
}

export default async function Page() {
  const privacyData = await getPrivacyData();

  return (
    <div className="page-wrapper">
      <Header />
      <PrivacyPolicyPage data={privacyData} />
      <Footer />
    </div>
  );
}
