import type { Metadata } from "next";
import FAQDashboard from "../../components/FAQDashboard";

export const metadata: Metadata = {
  title: "FAQ Management | Likes.io",
  description: "Manage FAQs for the homepage and the main FAQ page.",
};

export default function Page() {
  return <FAQDashboard />;
}

