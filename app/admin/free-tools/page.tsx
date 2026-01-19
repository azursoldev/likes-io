import type { Metadata } from "next";
import FreeToolsDashboard from "../../components/FreeToolsDashboard";

export const metadata: Metadata = {
  title: "Free Tools | Likes.io",
  description: "Manage free tools content.",
};

export default function Page() {
  return <FreeToolsDashboard />;
}
