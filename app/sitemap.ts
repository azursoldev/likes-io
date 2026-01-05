import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use environment variable for base URL, fallback to https://likes.io
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://likes.io';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/contact',
    '/blog',
    '/login',
    '/signup',
    '/faq',
    '/reviews',
    '/terms',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating blog sitemap:', error);
  }

  // 3. Service Pages
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const servicePages = await prisma.servicePageContent.findMany({
      where: { isActive: true },
      select: { platform: true, serviceType: true, updatedAt: true },
    });

    serviceRoutes = servicePages.map((page) => {
      const platform = page.platform.toLowerCase();
      const service = page.serviceType.toLowerCase();
      return {
        url: `${baseUrl}/${platform}/${service}`,
        lastModified: page.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    });
  } catch (error) {
    console.error('Error generating service sitemap:', error);
  }

  return [...staticRoutes, ...blogRoutes, ...serviceRoutes];
}
