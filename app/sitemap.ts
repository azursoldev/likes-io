import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL || 'https://likes.io';

  let sitemapEnabled = true;
  let customSitemapXml = '';
  try {
    const settings = await prisma.adminSettings.findFirst({
      select: { sitemapEnabled: true, customSitemapXml: true },
    });
    if (settings?.sitemapEnabled === false) sitemapEnabled = false;
    if (settings?.customSitemapXml) customSitemapXml = settings.customSitemapXml;
  } catch (error) {
    console.error('Error fetching sitemap settings:', error);
  }

  if (!sitemapEnabled) return [];

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
      select: { slug: true, platform: true, serviceType: true, updatedAt: true },
    });

    serviceRoutes = servicePages.map((page) => {
      const platform = page.platform.toLowerCase();
      const service = page.serviceType.toLowerCase();
      const slug = page.slug?.trim();
      const path = slug ? `/${slug}` : `/${platform}/${service}`;
      return {
        url: `${baseUrl}${path}`,
        lastModified: page.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    });
  } catch (error) {
    console.error('Error generating service sitemap:', error);
  }

  let customRoutes: MetadataRoute.Sitemap = [];
  if (customSitemapXml && customSitemapXml.trim()) {
    try {
      const locMatches = [...customSitemapXml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)];
      const lastmodMatches = [...customSitemapXml.matchAll(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/gi)];

      customRoutes = locMatches
        .map((m, index) => {
          const loc = (m[1] || '').trim();
          if (!loc) return null;

          const url = loc.startsWith('http://') || loc.startsWith('https://')
            ? loc
            : `${baseUrl}${loc.startsWith('/') ? '' : '/'}${loc}`;

          const lastmodRaw = (lastmodMatches[index]?.[1] || '').trim();
          const lastModified = lastmodRaw ? new Date(lastmodRaw) : new Date();

          return {
            url,
            lastModified: Number.isNaN(lastModified.getTime()) ? new Date() : lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          };
        })
        .filter((x): x is NonNullable<typeof x> => !!x);
    } catch (error) {
      console.error('Error parsing custom sitemap XML:', error);
    }
  }

  return [...staticRoutes, ...blogRoutes, ...serviceRoutes, ...customRoutes];
}
