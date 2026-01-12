"use client";

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

      // Check if any page link matches current path or "all"
      return brand.pageLinks.some(pageLink => {
        if (pageLink.pagePath === "all") {
          return true;
        }
        return pageLink.pagePath === pathname;
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
            
            // Get the first matching page link for the current path
            const getPageLink = () => {
              if (!brand.pageLinks || brand.pageLinks.length === 0) return null;
              
              // Find link for current path or "all"
              const matchingLink = brand.pageLinks.find(pageLink => 
                pageLink.pagePath === pathname || pageLink.pagePath === "all"
              );
              
              return matchingLink?.link || null;
            };

            const brandLink = getPageLink();

            const content = logoUrl ? (
              <img src={logoUrl} alt={altText} style={{ maxHeight: "24px", maxWidth: "120px" }} />
            ) : (
              <span className="brand">{brandName}</span>
            );

            if (brandLink && brandLink !== "#") {
              // Find if nofollow is set for this link
              const pageLink = brand.pageLinks.find(pl => pl.pagePath === pathname || pl.pagePath === "all");
              
              return (
                <a
                  key={brand.id ?? index}
                  href={brandLink}
                  className="brand-link"
                  style={{ textDecoration: "none", color: "inherit" }}
                  {...(pageLink?.nofollow ? { rel: "nofollow" } : {})}
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
