import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import InstagramFollowersFinal from '../../../instagram/followers/checkout/final/page';
import InstagramLikesFinal from '../../../instagram/likes/checkout/final/page';
import InstagramViewsFinal from '../../../instagram/views/checkout/final/page';
import TikTokFollowersFinal from '../../../tiktok/followers/checkout/final/page';
import TikTokLikesFinal from '../../../tiktok/likes/checkout/final/page';
import TikTokViewsFinal from '../../../tiktok/views/checkout/final/page';
import YouTubeViewsFinal from '../../../youtube/views/checkout/final/page';
import YouTubeLikesFinal from '../../../youtube/likes/checkout/final/page';
import YouTubeSubscribersFinal from '../../../youtube/subscribers/checkout/final/page';

export default async function CheckoutFinalPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }; 
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const content = await prisma.servicePageContent.findFirst({
    where: { slug: params.slug },
    select: { platform: true, serviceType: true }
  });

  if (!content || !content.platform || !content.serviceType) {
    return notFound();
  }

  const platform = content.platform.toLowerCase();
  const serviceType = content.serviceType.toLowerCase();
  const basePath = `/${params.slug}`;

  // Mapping logic
  if (platform === 'instagram') {
    if (serviceType === 'followers') return <InstagramFollowersFinal />;
    if (serviceType === 'likes') return <InstagramLikesFinal />;
    if (serviceType === 'views') return <InstagramViewsFinal />;
  }

  if (platform === 'tiktok') {
    if (serviceType === 'followers') return <TikTokFollowersFinal />;
    if (serviceType === 'likes') return <TikTokLikesFinal />;
    if (serviceType === 'views') return <TikTokViewsFinal />;
  }
  
  if (platform === 'youtube') {
    if (serviceType === 'views') return <YouTubeViewsFinal basePath={basePath} searchParams={searchParams} />;
    if (serviceType === 'likes') return <YouTubeLikesFinal />;
    if (serviceType === 'subscribers') return <YouTubeSubscribersFinal />;
  }

  // If no match found, 404
  return notFound();
}
