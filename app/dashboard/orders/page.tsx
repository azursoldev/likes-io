import type { Metadata } from "next";
import OrderHistory from "../../components/OrderHistory";

export const metadata: Metadata = {
  title: "Order History | Likes.io",
  description: "View your order history and track all your purchases on Likes.io",
};

export default function Page() {
  return <OrderHistory />;
}

