import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // 1. Fetch settings
    const settings = await prisma.adminSettings.findFirst();
    
    if (settings?.sitemapEnabled === false) {
      return new NextResponse('Sitemap is disabled', { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_URL || new URL(request.url).origin;
    
    // 2. Fetch dynamic pages
    const services = await prisma.servicePageContent.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    });
    
    const blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true }
    });

    // 3. Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Static pages
    const staticPages = [
      '',
      '/about',
      '/contact',
      '/blog',
      '/faq',
      '/login',
      '/signup',
      '/reviews',
    ];

    staticPages.forEach(path => {
      xml += `  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Dynamic Services
    services.forEach(service => {
      if (service.slug) {
        xml += `  <url>
    <loc>${baseUrl}/${service.slug}</loc>
    <lastmod>${service.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
      }
    });

    // Dynamic Blog Posts
    blogPosts.forEach(post => {
      xml += `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // Custom XML from Admin
    if (settings?.customSitemapXml) {
      xml += settings.customSitemapXml + '\n';
    }

    xml += `</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
      },
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
