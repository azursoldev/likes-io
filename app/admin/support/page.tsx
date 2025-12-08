import type { Metadata } from "next";
import HelpSupportDashboard from "../../components/HelpSupportDashboard";

export const metadata: Metadata = {
  title: "Help & Support | Likes.io",
  description: "Get help and support for your Likes.io account. Find answers to frequently asked questions and contact our support team.",
};

export default function Page() {
  return <HelpSupportDashboard />;
}

