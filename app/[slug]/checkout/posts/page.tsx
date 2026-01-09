import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import InstagramLikesPosts from '../../../instagram/likes/checkout/posts/page';
import InstagramViewsPosts from '../../../instagram/views/checkout/posts/page';
import TikTokLikesPosts from '../../../tiktok/likes/checkout/posts/page';
import TikTokViewsPosts from '../../../tiktok/views/checkout/posts/page';
import YouTubeViewsPosts from '../../../youtube/views/checkout/posts/page';

export default async function CheckoutPostsPage({ 
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
    if (serviceType === 'likes') return <InstagramLikesPosts />;
    if (serviceType === 'views') return <InstagramViewsPosts />;
    // Followers usually skip posts selection
  }

  if (platform === 'tiktok') {
    if (serviceType === 'likes') return <TikTokLikesPosts />;
    if (serviceType === 'views') return <TikTokViewsPosts />;
  }
  
  if (platform === 'youtube' && serviceType === 'views') {
    return <YouTubeViewsPosts basePath={basePath} />;
  }

  // If no match found (or if service doesn't have posts step), 404
  return notFound();
}
