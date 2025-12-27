import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { PostsSelectionContent as InstagramFollowersPosts } from '../../../../instagram/followers/checkout/posts/page';
import { PostsSelectionContent as YouTubeViewsPosts } from '../../../../youtube/views/checkout/posts/page';

export default async function CheckoutPostsPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }; 
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const content = await prisma.servicePageContent.findUnique({
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
  if (platform === 'instagram' && serviceType === 'followers') {
    return <InstagramFollowersPosts basePath={basePath} />;
  }
  
  if (platform === 'youtube' && serviceType === 'views') {
    return <YouTubeViewsPosts basePath={basePath} />;
  }

  // Fallback
  const queryString = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      queryString.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach(v => queryString.append(key, v));
    }
  });
  
  const destination = `/${platform}/${serviceType}/checkout/posts?${queryString.toString()}`;
  
  redirect(destination);
}
