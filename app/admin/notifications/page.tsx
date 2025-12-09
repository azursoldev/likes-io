import type { Metadata } from "next";
import NotificationsDashboard from "../../components/NotificationsDashboard";

export const metadata: Metadata = {
  title: "Notifications | Likes.io",
  description: "Manage sitewide banners and bell notifications.",
};

export default function Page() {
  return <NotificationsDashboard />;
}

