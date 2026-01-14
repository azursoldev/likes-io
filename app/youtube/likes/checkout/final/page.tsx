import type { Metadata } from "next";
import FinalCheckoutClient from "./FinalCheckoutClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function FinalCheckoutPage() {
  return <FinalCheckoutClient />;
}
