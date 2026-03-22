import { Metadata } from "next";
import CheckoutErrorContent from "./CheckoutErrorContent";

export const metadata: Metadata = {
  title: "Checkout | Payment not completed | Likes.io",
  description:
    "Your payment was not completed. You can try again or contact support with your order reference.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutErrorPage() {
  return <CheckoutErrorContent />;
}
