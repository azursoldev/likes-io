"use client";

import { isWildcardPagePath } from "@/lib/featured-on-page-links";
import { resolveAssetUrl } from "@/lib/url-utils";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type PageLink = {
  pagePath: string;
  link: string | null;
  nofollow: boolean;
};

type FeaturedBrand = {
  id: number;
  brandName: string;
  logoUrl: string | null;
  altText: string | null;
  pageLinks: PageLink[];
  displayOrder: number;
  isActive: boolean;
};

/** Match paths ignoring a single trailing slash (e.g. /foo vs /foo/). */
function normalizePathForMatch(path: string): string {
  if (!path || isWildcardPagePath(path)) return path;
  return path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
}

/**
 * Prefer the page-specific row over "all" so an external URL on a service page
 * is not overridden by an earlier "all" entry (e.g. link "/" or "#").
 */
function resolvePageLinkForPath(pageLinks: PageLink[] | undefined, pathname: string): PageLink | null {
  if (!pageLinks?.length) return null;
  const current = normalizePathForMatch(pathname);
  const exact = pageLinks.find((pl) => {
    if (isWildcardPagePath(pl.pagePath)) return false;
    return normalizePathForMatch(pl.pagePath) === current;
  });
  if (exact) return exact;
  return pageLinks.find((pl) => isWildcardPagePath(pl.pagePath)) ?? null;
}

/** Avoid accidental same-origin navigation when admins omit https:// */
function normalizeFeaturedHref(raw: string): string {
  const link = raw.trim();
  if (!link || link === "#") return link;
  if (/^(https?:|mailto:|tel:)/i.test(link)) return link;
  if (link.startsWith("//")) return `https:${link}`;
  if (link.startsWith("/")) return link;
  if (/^www\./i.test(link) || /^[a-z0-9][a-z0-9-]*\.[a-z]{2,}/i.test(link)) {
    return `https://${link.replace(/^\/+/, "")}`;
  }
  return link;
}

function isExternalHttpHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

function buildBrandRel(pageLink: PageLink | null, href: string): string | undefined {
  const parts: string[] = [];
  if (pageLink?.nofollow) parts.push("nofollow");
  if (isExternalHttpHref(href)) {
    parts.push("noopener", "noreferrer");
  }
  return parts.length ? parts.join(" ") : undefined;
}

export default function FeaturedOn() {
  const pathname = usePathname();
  const [brands, setBrands] = useState<FeaturedBrand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const response = await fetch("/api/cms/featured-on");
      if (response.ok) {
        const data = await response.json();
        if (data.brands && data.brands.length > 0) {
          // Sort by displayOrder
          const sortedBrands = [...data.brands].sort((a, b) => a.displayOrder - b.displayOrder);
          setBrands(sortedBrands);
        }
      }
    } catch (error) {
      console.error("Error fetching featured brands:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter brands based on current page path
  const getDisplayBrands = (): FeaturedBrand[] => {
    if (brands.length === 0) {
      return [];
    }

    return brands.filter(brand => {
      // If no page links, show on all pages (backward compatibility)
      if (!brand.pageLinks || brand.pageLinks.length === 0) {
        return true;
      }

      return brand.pageLinks.some((pageLink) => {
        if (isWildcardPagePath(pageLink.pagePath)) return true;
        return normalizePathForMatch(pageLink.pagePath) === normalizePathForMatch(pathname);
      });
    });
  };

  const displayBrands = getDisplayBrands();

  if (loading) {
    return (
      <section className="featured-on">
        <div className="container">
          <p className="featured-label">AS FEATURED ON</p>
          <div className="featured-brands" style={{ gap: '2rem' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shimmer-bg" style={{ width: '120px', height: '24px', borderRadius: '4px' }}></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayBrands.length === 0) {
    return null;
  }

  return (
    <section className="featured-on">
      <div className="container">
        <p className="featured-label">AS FEATURED ON</p>
        <div className="featured-brands">
          {displayBrands.map((brand, index) => {
            const brandName = brand.brandName;
            const logoUrl = brand.logoUrl;
            const altText = brand.altText || brandName;
            
            const pageLinkRow = resolvePageLinkForPath(brand.pageLinks, pathname);
            const rawHref = pageLinkRow?.link?.trim() || null;
            const brandLink = rawHref ? normalizeFeaturedHref(rawHref) : null;

            const content = logoUrl ? (
              <img src={resolveAssetUrl(logoUrl)} alt={altText} style={{ maxHeight: "24px", maxWidth: "120px" }} />
            ) : (
              <span className="brand">{brandName}</span>
            );

            if (brandLink && brandLink !== "#") {
              const external = isExternalHttpHref(brandLink);
              const rel = buildBrandRel(pageLinkRow, brandLink);
              return (
                <a
                  key={brand.id ?? index}
                  href={brandLink}
                  className="brand-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                  {...(external ? { target: "_blank" } : {})}
                  {...(rel ? { rel } : {})}
                >
                  {content}
                </a>
              );
            }

            return <div key={brand.id ?? index}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
