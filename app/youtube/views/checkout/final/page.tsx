import { Suspense } from "react";
import { Metadata } from "next";
import YouTubeViewsCheckoutForm from "./_components/YouTubeViewsCheckoutForm";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function FinalCheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <YouTubeViewsCheckoutForm />
    </Suspense>
  );
}
