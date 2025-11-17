import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Likes.io: Buy Instagram, TikTok & YouTube Engagement | Real & Instant',
  description:
    'Elevate your social media presence with Likes.io. Buy real, high-quality Instagram, TikTok, and YouTube engagement (Likes, Followers, Views) with instant delivery. Safe, secure, and guaranteed results.',
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}