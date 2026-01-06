import type { Metadata } from "next";
import CouponsDashboard from "../../components/CouponsDashboard";

export const metadata: Metadata = {
  title: "Coupons | Likes.io Admin",
  description: "Manage discount codes and promotions.",
};

export default function Page() {
  return <CouponsDashboard />;
}
