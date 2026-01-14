import { Suspense } from "react";
import { Metadata } from "next";
import YouTubeSubscribersCheckoutForm from "./_components/YouTubeSubscribersCheckoutForm";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function FinalCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YouTubeSubscribersCheckoutForm />
    </Suspense>
  );
}
