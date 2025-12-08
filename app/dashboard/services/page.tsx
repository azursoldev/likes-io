import type { Metadata } from "next";
import ServicesDashboard from "../../components/ServicesDashboard";

export const metadata: Metadata = {
  title: "Services & Pricing | Likes.io",
  description: "Manage all products, packages, and their page content.",
};

export default function Page() {
  return <ServicesDashboard />;
}

