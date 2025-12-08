import type { Metadata } from "next";
import OrderHistory from "../../components/OrderHistory";

export const metadata: Metadata = {
  title: "Order History | Likes.io",
  description: "View your order history and track your purchases.",
};

export default function Page() {
  return <OrderHistory />;
}

