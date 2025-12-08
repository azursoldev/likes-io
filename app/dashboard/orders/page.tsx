import type { Metadata } from "next";
import OrdersDashboard from "../../components/OrdersDashboard";

export const metadata: Metadata = {
  title: "Orders | Likes.io",
  description: "Monitor and manage all customer orders.",
};

export default function Page() {
  return <OrdersDashboard />;
}

