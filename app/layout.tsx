import './globals.css';
import ScrollTopButton from './components/ScrollTopButton';
import GoogleAnalytics from './components/GoogleAnalytics';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { SettingsProvider } from './contexts/SettingsContext';
import NextAuthSessionProvider from '@/lib/session-provider';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'

export async function generateMetadata(): Promise<Metadata> {
  let settings: any;
  try {
    settings = await prisma.adminSettings.findFirst();
  } catch (error) {
    console.error('Error fetching settings for metadata:', error);
  }

  return {
    title: settings?.homeMetaTitle || 'Likes.io: Buy Instagram, TikTok & YouTube Engagement | Real & Instant',
    description: settings?.homeMetaDescription || 'Elevate your social media presence with Likes.io. Buy real, high-quality Instagram, TikTok, and YouTube engagement (Likes, Followers, Views) with instant delivery. Safe, secure, and guaranteed results.',
    icons: { icon: settings?.faviconUrl || '/favicon.ico' }
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let settings: any = {};
  try {
    // Use raw query to ensure we get all fields even if client is outdated
    const result: any = await prisma.$queryRaw`SELECT * FROM "admin_settings" LIMIT 1`;
    if (Array.isArray(result) && result.length > 0) {
      settings = result[0];
    }
  } catch (error) {
    console.error('Error fetching settings for layout:', error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {settings?.googleSiteVerification && (
          <meta name="google-site-verification" content={settings.googleSiteVerification} />
        )}
      </head>
      <body suppressHydrationWarning>
        <NextAuthSessionProvider>
          <SettingsProvider settings={settings}>
            <CurrencyProvider>
              {settings?.googleAnalyticsId && <GoogleAnalytics gaId={settings.googleAnalyticsId} />}
              {children}
              <ScrollTopButton />
            </CurrencyProvider>
          </SettingsProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
