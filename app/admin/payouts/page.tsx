import type { Metadata } from "next";
import PayoutsDashboard from "../../components/PayoutsDashboard";

export const metadata: Metadata = {
  title: "Payouts | Likes.io",
  description: "Review and process pending payout requests from affiliates.",
};

export default function Page() {
  return <PayoutsDashboard />;
}

