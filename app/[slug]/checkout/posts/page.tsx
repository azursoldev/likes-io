import { redirect, notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

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

  // Helper to reconstruct query string
  const queryString = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      queryString.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach(v => queryString.append(key, v));
    }
  });
  const searchString = queryString.toString() ? `?${queryString.toString()}` : '';

  // For services that don't need post selection, redirect to final checkout
  if (platform === 'instagram' && serviceType === 'followers') {
    redirect(`/${params.slug}/checkout/final${searchString}`);
  }
  
  if (platform === 'youtube' && serviceType === 'views') {
    redirect(`/${params.slug}/checkout/final${searchString}`);
  }

  // For other services (like Likes), redirect to their specific checkout posts page
  // We don't import them statically to avoid build errors if they don't exist yet for some services
  // But usually we would have a mapping or specific component imports.
  // Since the original code was redirecting for "Fallback", let's see what it did.
  
  // Original fallback was:
  // const destination = `/${platform}/${serviceType}/checkout/posts?${queryString.toString()}`;
  // redirect(destination);

  // We will stick to the fallback redirect pattern for everything else, 
  // which seems to be the intention for other services that might have this page.
  
  const destination = `/${platform}/${serviceType}/checkout/posts${searchString}`;
  
  redirect(destination);
}
