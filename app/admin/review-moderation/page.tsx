import type { Metadata } from "next";
import ReviewModerationDashboard from "../../components/ReviewModerationDashboard";

export const metadata: Metadata = {
  title: "Review Moderation | Likes.io",
  description: "Approve or decline new user-submitted reviews.",
};

export default function Page() {
  return <ReviewModerationDashboard />;
}

