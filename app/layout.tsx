import './globals.css';
import ScrollTopButton from './components/ScrollTopButton';
import { CurrencyProvider } from './contexts/CurrencyContext';
import NextAuthSessionProvider from '@/lib/session-provider';
import type { Metadata } from 'next';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

export const metadata: Metadata = {
  title: 'Likes.io: Buy Instagram, TikTok & YouTube Engagement | Real & Instant',
  description:
    'Elevate your social media presence with Likes.io. Buy real, high-quality Instagram, TikTok, and YouTube engagement (Likes, Followers, Views) with instant delivery. Safe, secure, and guaranteed results.',
  icons: { icon: '/favicon.ico' }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning>
        <NextAuthSessionProvider>
          <CurrencyProvider>
            {children}
            <ScrollTopButton />
          </CurrencyProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
