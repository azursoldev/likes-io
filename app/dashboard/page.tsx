import type { Metadata } from "next";
import Dashboard from "../components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Likes.io",
  description: "Manage your orders, track your growth, and boost your social media presence from your Likes.io dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <Dashboard />;
}

