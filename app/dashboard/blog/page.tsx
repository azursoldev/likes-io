import type { Metadata } from "next";
import BlogDashboard from "../../components/BlogDashboard";

export const metadata: Metadata = {
  title: "Blog | Likes.io",
  description: "Create, edit, and manage all blog posts.",
};

export default function Page() {
  return <BlogDashboard />;
}

