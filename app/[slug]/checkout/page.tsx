import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { CheckoutContent as InstagramFollowersCheckout } from '../../instagram/followers/checkout/page';
import { CheckoutContent as YouTubeViewsCheckout } from '../../youtube/views/checkout/page';
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

  if (platform === 'instagram' && serviceType === 'followers') {
    return <InstagramFollowersCheckout basePath={basePath} packages={packages} />;
  }
  
  if (platform === 'youtube' && serviceType === 'views') {
    return <YouTubeViewsCheckout basePath={basePath} packages={packages} />;
  }

  // Fallback for other services
  const queryString = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      queryString.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach(v => queryString.append(key, v));
    }
  });
  
  const destination = `/${platform}/${serviceType}/checkout?${queryString.toString()}`;
  
  redirect(destination);
}
