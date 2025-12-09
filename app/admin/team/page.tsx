import type { Metadata } from "next";
import TeamDashboard from "../../components/TeamDashboard";

export const metadata: Metadata = {
  title: "Team Management | Likes.io",
  description: "Manage team members displayed on the Our Team page.",
};

export default function Page() {
  return <TeamDashboard />;
}

