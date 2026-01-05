import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://likes.io';
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  try {
    // Fetch settings safely using raw query to avoid type errors if client isn't regenerated
    const result: any = await prisma.$queryRaw`SELECT "robotsTxtContent" FROM "admin_settings" LIMIT 1`;
    const robotsContent = Array.isArray(result) && result.length > 0 ? result[0].robotsTxtContent : null;

    if (robotsContent) {
      // Parse the stored robots.txt string into Next.js Robots object
      const rules: MetadataRoute.Robots['rules'] = [];
      let currentUserAgent: string | string[] = '*';
      let currentAllow: string[] = [];
      let currentDisallow: string[] = [];
      let currentCrawlDelay: number | undefined = undefined;

      const lines = robotsContent.split('\n');
      
      // Simple parser for single block or multiple blocks
      // Note: This is a basic parser. Complex robots.txt might need more robust parsing.
      // For now, we'll try to support the most common case: one User-agent block.
      
      // If we detect multiple User-agent lines, we might need to handle array of rules.
      // But for MVP, let's just map the whole content to one rule set if possible, 
      // or simplistic parsing.
      
      // Let's go with a simpler approach: 
      // If the user provided content, we just want to output it. 
      // But Next.js robots() requires an object.
      // So we parse.
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;

        const [key, ...values] = trimmed.split(':');
        const value = values.join(':').trim();
        const lowerKey = key.toLowerCase();

        if (lowerKey === 'user-agent') {
            if (currentDisallow.length > 0 || currentAllow.length > 0) {
                 // Push previous block
                 rules.push({
                     userAgent: currentUserAgent,
                     allow: currentAllow,
                     disallow: currentDisallow,
                     crawlDelay: currentCrawlDelay
                 });
                 // Reset
                 currentAllow = [];
                 currentDisallow = [];
                 currentCrawlDelay = undefined;
            }
            currentUserAgent = value;
        } else if (lowerKey === 'allow') {
            currentAllow.push(value);
        } else if (lowerKey === 'disallow') {
            currentDisallow.push(value);
        } else if (lowerKey === 'crawl-delay') {
            currentCrawlDelay = parseInt(value, 10);
        }
      }
      
      // Push the last block
      rules.push({
          userAgent: currentUserAgent,
          allow: currentAllow,
          disallow: currentDisallow,
          crawlDelay: currentCrawlDelay
      });

      return {
        rules: rules.length > 0 ? rules : {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/admin/']
        },
        sitemap: sitemapUrl,
      };
    }
  } catch (error) {
    console.error('Error fetching robots.txt settings:', error);
  }

  // Default fallback
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/admin/'],
    },
    sitemap: sitemapUrl,
  };
}
