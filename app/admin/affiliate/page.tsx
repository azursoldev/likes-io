import type { Metadata } from "next";
import AffiliatesDashboard from "../../components/AffiliatesDashboard";

export const metadata: Metadata = {
  title: "Affiliates | Likes.io",
  description: "Manage affiliates, referral links, and commissions.",
};

export default function Page() {
  return <AffiliatesDashboard />;
}
