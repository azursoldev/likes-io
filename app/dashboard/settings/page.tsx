import type { Metadata } from "next";
import SettingsDashboard from "../../components/SettingsDashboard";

export const metadata: Metadata = {
  title: "Settings | Likes.io",
  description: "Manage your account settings, profile information, and notification preferences.",
};

export default function Page() {
  return <SettingsDashboard />;
}

