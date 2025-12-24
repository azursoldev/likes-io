"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import ServiceHero from "./ServiceHero";
import AssuranceCard from "./AssuranceCard";
import PackagesSelector, { type PackageTabConfig } from "./PackagesSelector";
import QualityCompare from "./QualityCompare";
import HowItWorksSection from "./HowItWorksSection";
import FAQSection, { type FAQItem } from "./FAQSection";

export type ServicePageContentData = {
  heroTitle: string;
  heroSubtitle: string;
  heroRating: string;
  heroReviewCount: string;
  assuranceCardText?: string;
  packages?: PackageTabConfig[];
  qualityCompare?: { title?: string; columns?: any[] };
  howItWorks?: { title?: string; subtitle?: string; steps?: any[] };
  faqs?: FAQItem[];
};

const ServiceContentContext = createContext<ServicePageContentData | null>(null);

export function useServiceContent() {
  return useContext(ServiceContentContext);
}

type ServicePageContentProviderProps = {
  platform?: string;
  serviceType?: string;
  slug?: string;
  defaultHeroTitle: string;
  defaultHeroSubtitle: string;
  defaultHeroRating: string;
  defaultHeroReviewCount: string;
  defaultAssuranceCardText?: string;
  defaultPackages?: PackageTabConfig[];
  defaultQualityCompare?: { title?: string; columns?: any[] };
  defaultHowItWorks?: { title?: string; subtitle?: string; steps?: any[] };
  defaultFAQs?: FAQItem[];
  initialData?: ServicePageContentData | null;
  children: React.ReactNode;
};

export function ServicePageContentProvider({
  platform,
  serviceType,
  slug,
  defaultHeroTitle,
  defaultHeroSubtitle,
  defaultHeroRating,
  defaultHeroReviewCount,
  defaultAssuranceCardText,
  defaultPackages,
  defaultQualityCompare,
  defaultHowItWorks,
  defaultFAQs,
  initialData,
  children,
}: ServicePageContentProviderProps) {
  const [content, setContent] = useState<ServicePageContentData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) {
        setContent(initialData);
        setLoading(false);
        return;
    }

    const fetchContent = async () => {
      try {
        let url = '';
        if (slug) {
          url = `/api/cms/service-pages/slug/${slug}`;
        } else if (platform && serviceType) {
          url = `/api/cms/service-pages/${platform}/${serviceType}`;
        } else {
          console.warn("ServicePageContentProvider: No slug or platform/serviceType provided");
          setLoading(false);
          return;
        }

        // Log for debugging - verify correct platform/serviceType is being fetched
        console.log(`Fetching service content from: ${url}`);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log(`Received packages from ${url}:`, {
            packagesCount: data.packages?.length || 0,
            hasPackages: !!(data.packages && Array.isArray(data.packages) && data.packages.length > 0),
            hasId: !!data.id // Check if this is a real CMS record (has id) or default response
          });
          
          // Check if this is a real CMS record (has id) vs default API response
          // If it's a real record, always use CMS data (even if packages is empty)
          // If it's a default response (no id), use defaults
          const isRealCMSRecord = !!data.id;
          
          setContent({
            heroTitle: data.heroTitle || defaultHeroTitle,
            heroSubtitle: data.heroSubtitle || defaultHeroSubtitle,
            heroRating: data.heroRating || defaultHeroRating,
            heroReviewCount: data.heroReviewCount || defaultHeroReviewCount,
            assuranceCardText: data.assuranceCardText || defaultAssuranceCardText,
            // If it's a real CMS record, use CMS packages (even if empty)
            // If it's a default response (service not saved yet), use defaultPackages
            packages: isRealCMSRecord 
              ? (data.packages && Array.isArray(data.packages) ? data.packages : defaultPackages)
              : defaultPackages,
            qualityCompare: isRealCMSRecord ? (data.qualityCompare || defaultQualityCompare) : defaultQualityCompare,
            howItWorks: isRealCMSRecord ? (data.howItWorks || defaultHowItWorks) : defaultHowItWorks,
            faqs: (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) ? data.faqs : defaultFAQs,
          });
        } else {
          // Use defaults if fetch fails
          setContent({
            heroTitle: defaultHeroTitle,
            heroSubtitle: defaultHeroSubtitle,
            heroRating: defaultHeroRating,
            heroReviewCount: defaultHeroReviewCount,
            packages: defaultPackages,
            qualityCompare: defaultQualityCompare,
            howItWorks: defaultHowItWorks,
            faqs: defaultFAQs,
          });
        }
      } catch (error) {
        console.error("Error fetching service content:", error);
        // Use defaults on error
        setContent({
          heroTitle: defaultHeroTitle,
          heroSubtitle: defaultHeroSubtitle,
          heroRating: defaultHeroRating,
          heroReviewCount: defaultHeroReviewCount,
          assuranceCardText: defaultAssuranceCardText,
          packages: defaultPackages,
          qualityCompare: defaultQualityCompare,
          howItWorks: defaultHowItWorks,
          faqs: defaultFAQs,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [platform, serviceType, defaultHeroTitle, defaultHeroSubtitle, defaultHeroRating, defaultHeroReviewCount, defaultAssuranceCardText, defaultPackages, defaultQualityCompare, defaultHowItWorks, defaultFAQs]);

  if (loading || !content) {
    return <>{children}</>; // Render children with defaults while loading
  }

  return (
    <ServiceContentContext.Provider value={content}>
      {children}
    </ServiceContentContext.Provider>
  );
}

// Individual section components
export function DynamicServiceHero() {
  const content = useServiceContent();
  if (!content) return null;
  
  return (
    <ServiceHero
      title={content.heroTitle}
      subtitle={content.heroSubtitle}
      rating={content.heroRating}
      basedon="based on"
      reviewss={content.heroReviewCount}
    />
  );
}

export function DynamicPackagesSelector() {
  const content = useServiceContent();
  const pathname = usePathname();
  
  if (!content || !content.packages) return null;
  
  // Determine metricLabel from pathname
  let metricLabel = "Likes"; // default
  if (pathname) {
    if (pathname.includes("/followers")) {
      metricLabel = "Followers";
    } else if (pathname.includes("/views")) {
      metricLabel = "Views";
    } else if (pathname.includes("/subscribers")) {
      metricLabel = "Subscribers";
    } else if (pathname.includes("/likes")) {
      metricLabel = "Likes";
    }
  }
  
  return <PackagesSelector tabsConfig={content.packages} metricLabel={metricLabel} />;
}

export function DynamicQualityCompare() {
  const content = useServiceContent();
  const pathname = usePathname();
  
  if (!content || !content.qualityCompare) return null;
  
  // Determine service type from pathname for dynamic title
  let serviceType = "Like"; // default
  if (pathname) {
    if (pathname.includes("/followers")) {
      serviceType = "Follower";
    } else if (pathname.includes("/views")) {
      serviceType = "View";
    } else if (pathname.includes("/subscribers")) {
      serviceType = "Subscriber";
    } else if (pathname.includes("/likes")) {
      serviceType = "Like";
    }
  }
  
  // Use title from content or generate dynamic title
  const title = content.qualityCompare.title || `Compare ${serviceType} Quality`;
  
  return (
    <QualityCompare
      title={title}
      columns={content.qualityCompare.columns}
    />
  );
}

export function DynamicHowItWorks() {
  const content = useServiceContent();
  if (!content || !content.howItWorks) return null;
  
  return (
    <HowItWorksSection
      title={content.howItWorks.title}
      subtitle={content.howItWorks.subtitle}
      steps={content.howItWorks.steps}
    />
  );
}

export function DynamicFAQSection() {
  const content = useServiceContent();
  if (!content || !content.faqs || content.faqs.length === 0) return null;
  
  return <FAQSection faqs={content.faqs} />;
}

export function DynamicAssuranceCard() {
  const content = useServiceContent();
  if (!content) return null;
  
  return <AssuranceCard text={content.assuranceCardText} />;
}

// Lightweight fetcher for pages that are not wrapped in ServicePageContentProvider
// to pull only the assurance card text dynamically.
export function RemoteAssuranceCard({
  platform,
  serviceType,
  defaultText,
}: {
  platform: string;
  serviceType: string;
  defaultText?: string;
}) {
  const [text, setText] = useState<string | undefined>(defaultText);

  useEffect(() => {
    const fetchAssurance = async () => {
      try {
        const res = await fetch(`/api/cms/service-pages/${platform}/${serviceType}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.assuranceCardText) {
            setText(data.assuranceCardText);
          }
        }
      } catch (e) {
        console.error("Error fetching assurance card text:", e);
      }
    };
    fetchAssurance();
  }, [platform, serviceType]);

  return <AssuranceCard text={text} />;
}

