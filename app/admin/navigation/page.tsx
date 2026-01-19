import type { Metadata } from "next";
import NavigationDashboard from "../../components/NavigationDashboard";

export const metadata: Metadata = {
  title: "Navigation | Likes.io",
  description: "Manage header and footer navigation menus used across the site.",
};

export default function Page() {
  return <NavigationDashboard />;
}

