import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import InstagramFollowersCheckout from '../../components/checkout/InstagramFollowersCheckout';
import InstagramLikesCheckout from '../../components/checkout/InstagramLikesCheckout';
import InstagramViewsCheckout from '../../instagram/views/checkout/page';
import TikTokFollowersCheckout from '../../tiktok/followers/checkout/page';
import TikTokLikesCheckout from '../../tiktok/likes/checkout/page';
import TikTokViewsCheckout from '../../tiktok/views/checkout/page';
import { YouTubeViewsCheckout } from '../../youtube/views/checkout/page';
import YouTubeLikesCheckout from '../../youtube/likes/checkout/page';
import YouTubeSubscribersCheckout from '../../youtube/subscribers/checkout/page';
import { type PackageTabConfig } from '../../components/PackagesSelector';

export default async function CheckoutPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }; 
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const content = await prisma.servicePageContent.findFirst({
    where: { slug: params.slug },
    select: { platform: true, serviceType: true, packages: true }
  });

  if (!content || !content.platform || !content.serviceType) {
    return notFound();
  }

  const platform = content.platform.toLowerCase();
  const serviceType = content.serviceType.toLowerCase();
  const basePath = `/${params.slug}`;
  const packages = content.packages as unknown as PackageTabConfig[] | undefined;

  // Mapping logic
  if (platform === 'instagram') {
    if (serviceType === 'followers') return <InstagramFollowersCheckout basePath={basePath} packages={packages} />;
    if (serviceType === 'likes') return <InstagramLikesCheckout />;
    if (serviceType === 'views') return <InstagramViewsCheckout />;
  }

  if (platform === 'tiktok') {
    if (serviceType === 'followers') return <TikTokFollowersCheckout />;
    if (serviceType === 'likes') return <TikTokLikesCheckout />;
    if (serviceType === 'views') return <TikTokViewsCheckout />;
  }
  
  if (platform === 'youtube') {
    if (serviceType === 'views') return <YouTubeViewsCheckout basePath={basePath} packages={packages} />;
    if (serviceType === 'likes') return <YouTubeLikesCheckout />;
    if (serviceType === 'subscribers') return <YouTubeSubscribersCheckout />;
  }

  // If no match found, 404
  return notFound();
}
