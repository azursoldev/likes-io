import type { Metadata } from "next";
import UpsellsDashboard from "../../components/UpsellsDashboard";

export const metadata: Metadata = {
  title: "Upsells & Order Bumps | Likes.io Admin",
  description: "Manage checkout upsells and order bumps.",
};

export default function Page() {
  return <UpsellsDashboard />;
}
