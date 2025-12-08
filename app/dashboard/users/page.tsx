import type { Metadata } from "next";
import UsersDashboard from "../../components/UsersDashboard";

export const metadata: Metadata = {
  title: "Users | Likes.io",
  description: "Manage all registered user accounts on the platform.",
};

export default function Page() {
  return <UsersDashboard />;
}

