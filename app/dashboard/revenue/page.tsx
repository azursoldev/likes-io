import type { Metadata } from "next";
import RevenueDashboard from "../../components/RevenueDashboard";

export const metadata: Metadata = {
  title: "Revenue | Likes.io",
  description: "Track all income and view transaction history.",
};

export default function Page() {
  return <RevenueDashboard />;
}

