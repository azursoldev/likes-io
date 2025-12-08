import type { Metadata } from "next";
import TestimonialsDashboard from "../../components/TestimonialsDashboard";

export const metadata: Metadata = {
  title: "Testimonial Management | Likes.io",
  description: "Manage your testimonials, approve or delete them, or publish them on your site.",
};

export default function Page() {
  return <TestimonialsDashboard />;
}

