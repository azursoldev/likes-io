import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL || 'https://likes.io';

  let sitemapEnabled = true;
  let customSitemapXml = '';
  try {
    const result: any = await prisma.$queryRaw`
      SELECT "sitemapEnabled", "customSitemapXml"
      FROM "admin_settings"
      LIMIT 1
    `;
    const settings = Array.isArray(result) && result.length > 0 ? result[0] : null;
    if (settings?.sitemapEnabled === false) sitemapEnabled = false;
    if (typeof settings?.customSitemapXml === 'string') customSitemapXml = settings.customSitemapXml;
  } catch (error) {
    console.error('Error fetching sitemap settings:', error);
  }

  if (!sitemapEnabled) return [];

  // Only use custom routes from Admin Settings -> Custom Sitemap URLs
  let customRoutes: MetadataRoute.Sitemap = [];
  if (customSitemapXml && customSitemapXml.trim()) {
    try {
      const locMatches = [
        ...customSitemapXml.matchAll(
          /<loc>\s*(?:<!\[CDATA\[(.*?)\]\]>|([\s\S]*?))\s*<\/loc>/gi
        ),
      ];
      const lastmodMatches = [
        ...customSitemapXml.matchAll(
          /<lastmod>\s*(?:<!\[CDATA\[(.*?)\]\]>|([\s\S]*?))\s*<\/lastmod>/gi
        ),
      ];

      const extractedLocs = locMatches
        .map((m) => ((m[1] || m[2] || '').trim()))
        .filter(Boolean);

      const fallbackUrls = extractedLocs.length
        ? extractedLocs
        : customSitemapXml
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('<') && !line.startsWith('#'));

      customRoutes = fallbackUrls
        .map((loc, index) => {
          const normalizedLoc = loc.replace(/^<!\[CDATA\[/i, '').replace(/\]\]>$/i, '').trim();
          if (!normalizedLoc) return null;

          const url = normalizedLoc.startsWith('http://') || normalizedLoc.startsWith('https://')
            ? normalizedLoc
            : `${baseUrl}${normalizedLoc.startsWith('/') ? '' : '/'}${normalizedLoc}`;

          const lastmodRaw = ((lastmodMatches[index]?.[1] || lastmodMatches[index]?.[2] || '') as string).trim();
          const normalizedLastmod = lastmodRaw
            .replace(/^<!\[CDATA\[/i, '')
            .replace(/\]\]>$/i, '')
            .trim();
          const lastModified = normalizedLastmod ? new Date(normalizedLastmod) : new Date();

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

  return customRoutes;
}
