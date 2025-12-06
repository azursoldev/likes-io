import type { Metadata } from "next";
import AffiliateDashboard from "../../components/AffiliateDashboard";

export const metadata: Metadata = {
  title: "Affiliate | Likes.io",
  description: "View your affiliate statistics and earnings on Likes.io",
};

export default function Page() {
  return <AffiliateDashboard />;
}

