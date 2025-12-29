import type { Metadata } from "next";
import ProfileDashboard from "../../components/ProfileDashboard";

export const metadata: Metadata = {
  title: "My Profile | Likes.io",
  description: "View your admin account details.",
};

export default function Page() {
  return <ProfileDashboard />;
}
