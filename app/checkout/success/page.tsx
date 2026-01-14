import { Metadata } from 'next';
import CheckoutSuccessContent from './CheckoutSuccessContent';

export const metadata: Metadata = {
  title: 'Payment Successful | Likes.io',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessContent />;
}
