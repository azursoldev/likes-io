import type { Metadata } from "next";
import NavigationDashboard from "../../components/NavigationDashboard";

export const metadata: Metadata = {
  title: "Navigation | Likes.io Admin",
  description: "Manage header and footer branding from a single navigation page.",
};

export default function Page() {
  return <NavigationDashboard />;
}

