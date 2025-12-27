"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import ServiceHero from "./ServiceHero";
import AssuranceCard from "./AssuranceCard";
import LearnMoreSection from "./LearnMoreSection";
import PackagesSelector, { type PackageTabConfig } from "./PackagesSelector";
import QualityCompare from "./QualityCompare";
import HowItWorksSection from "./HowItWorksSection";
import FAQSection, { type FAQItem } from "./FAQSection";
import ReviewsSection, { type ReviewItem } from "./ReviewsSection";

export type ServicePageContentData = {
  heroTitle: string;
  metaTitle?: string;
  metaDescription?: string;
  heroSubtitle: string;
  heroRating: string;
  heroReviewCount: string;
  assuranceCardText?: string;
  learnMoreText?: string;
  learnMoreModalContent?: string;
  packages?: PackageTabConfig[];
  qualityCompare?: { title?: string; columns?: any[] };
  howItWorks?: { title?: string; subtitle?: string; steps?: any[] };
  faqs?: FAQItem[];
  testimonials?: ReviewItem[];
  platform?: string;
  serviceType?: string;
  slug?: string;
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
  defaultTestimonials?: ReviewItem[];
  initialData?: ServicePageContentData | null;
  children: React.ReactNode;
};

const getProcessedQualityCompare = (dbValue: any, defaultValue: any) => {
  // Debug log
  // console.log("getProcessedQualityCompare", { dbValue, defaultValue });

  // If no DB data, use default
  if (!dbValue) return defaultValue;
  
  // If DB data exists but has no columns or empty columns, use default
  if (!dbValue.columns || !Array.isArray(dbValue.columns) || dbValue.columns.length === 0) {
    console.log("getProcessedQualityCompare: DB data has no columns, using default");
    return defaultValue;
  }
  
  // If default has columns and DB has FEWER columns, assume data issue and use default
  // RELAXED CHECK: Only revert if we have drastically fewer columns (e.g. 0 vs 2) or if specific required columns are missing
  // For now, trust the DB data if it has at least 1 column, as the user might have intentionally removed one.
  // if (defaultValue?.columns?.length && dbValue.columns.length < defaultValue.columns.length) {
  //   return defaultValue;
  // }
  
  return dbValue;
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
  defaultTestimonials,
  initialData,
  children,
}: ServicePageContentProviderProps) {
  const [content, setContent] = useState<ServicePageContentData | null>(() => {
    if (!initialData) return null;
    return {
      ...initialData,
      heroTitle: initialData.heroTitle || defaultHeroTitle,
      heroSubtitle: initialData.heroSubtitle || defaultHeroSubtitle,
      heroRating: initialData.heroRating || defaultHeroRating,
      heroReviewCount: initialData.heroReviewCount || defaultHeroReviewCount,
      assuranceCardText: initialData.assuranceCardText || defaultAssuranceCardText,
      packages: initialData.packages || defaultPackages,
      qualityCompare: getProcessedQualityCompare(initialData.qualityCompare, defaultQualityCompare),
      howItWorks: initialData.howItWorks || defaultHowItWorks,
      faqs: (initialData.faqs && initialData.faqs.length > 0) ? initialData.faqs : defaultFAQs,
      testimonials: (initialData.testimonials && initialData.testimonials.length > 0) ? initialData.testimonials : defaultTestimonials,
    };
  });
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) {
        // Apply defensive fallbacks to initialData as well
        setContent({
            ...initialData,
            heroTitle: initialData.heroTitle || defaultHeroTitle,
            heroSubtitle: initialData.heroSubtitle || defaultHeroSubtitle,
            heroRating: initialData.heroRating || defaultHeroRating,
            heroReviewCount: initialData.heroReviewCount || defaultHeroReviewCount,
            assuranceCardText: initialData.assuranceCardText || defaultAssuranceCardText,
            packages: initialData.packages || defaultPackages,
            qualityCompare: getProcessedQualityCompare(initialData.qualityCompare, defaultQualityCompare),
            howItWorks: initialData.howItWorks || defaultHowItWorks,
            faqs: (initialData.faqs && initialData.faqs.length > 0) ? initialData.faqs : defaultFAQs,
            testimonials: (initialData.testimonials && initialData.testimonials.length > 0) ? initialData.testimonials : defaultTestimonials,
            slug: initialData.slug || slug,
        });
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
          console.log(`Received data from ${url}:`, {
            packagesCount: data.packages?.length || 0,
            hasQualityCompare: !!data.qualityCompare,
            qualityCompareColumns: data.qualityCompare?.columns?.length || 0,
            hasId: !!data.id
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
            learnMoreText: data.learnMoreText || undefined,
            learnMoreModalContent: data.learnMoreModalContent || undefined,
            // If it's a real CMS record, use CMS packages (even if empty)
            // If it's a default response (service not saved yet), use defaultPackages
            packages: isRealCMSRecord 
              ? (data.packages && Array.isArray(data.packages) ? data.packages : defaultPackages)
              : defaultPackages,
            qualityCompare: (() => {
              // If not a real record, use default
              if (!isRealCMSRecord) return defaultQualityCompare;
              return getProcessedQualityCompare(data.qualityCompare, defaultQualityCompare);
            })(),
            howItWorks: isRealCMSRecord ? (data.howItWorks || defaultHowItWorks) : defaultHowItWorks,
            faqs: (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) ? data.faqs : defaultFAQs,
            testimonials: (data.testimonials && Array.isArray(data.testimonials)) ? data.testimonials : defaultTestimonials,
            platform: data.platform || platform,
            serviceType: data.serviceType || serviceType,
            slug: slug || data.slug,
          });
        } else {
          // Use defaults if fetch fails
          setContent({
            heroTitle: defaultHeroTitle,
            heroSubtitle: defaultHeroSubtitle,
            heroRating: defaultHeroRating,
            heroReviewCount: defaultHeroReviewCount,
            learnMoreText: undefined,
            packages: defaultPackages,
            qualityCompare: defaultQualityCompare,
            howItWorks: defaultHowItWorks,
            faqs: defaultFAQs,
            testimonials: defaultTestimonials,
            platform,
            serviceType,
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
          testimonials: defaultTestimonials,
          platform,
          serviceType,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [platform, serviceType, defaultHeroTitle, defaultHeroSubtitle, defaultHeroRating, defaultHeroReviewCount, defaultAssuranceCardText, defaultPackages, defaultQualityCompare, defaultHowItWorks, defaultFAQs, defaultTestimonials]);

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
  if (content.serviceType) {
    // If serviceType is available from context, map it to metricLabel
    const type = content.serviceType.toLowerCase();
    if (type === "followers") metricLabel = "Followers";
    else if (type === "views") metricLabel = "Views";
    else if (type === "subscribers") metricLabel = "Subscribers";
    else if (type === "likes") metricLabel = "Likes";
  } else if (pathname) {
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
  
  return (
    <PackagesSelector 
      tabsConfig={content.packages} 
      metricLabel={metricLabel}
      platform={content.platform}
      serviceType={content.serviceType}
      slug={content.slug}
    />
  );
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

export function DynamicLearnMoreSection({ defaultText }: { defaultText?: string }) {
  const content = useServiceContent();
  
  // Logic: 
  // 1. If content is loading (content is null), show defaultText if provided?
  //    Actually, if loading, we probably want to show what was passed as default to the provider?
  //    But the provider renders children with defaults while loading IF defaults are passed.
  //    If content is present:
  //    - If learnMoreText is set (string), show it.
  //    - If learnMoreText is empty string "", return null (Hidden).
  //    - If learnMoreText is null/undefined, show defaultText.
  
  if (!content) {
    return defaultText ? <LearnMoreSection text={defaultText} /> : null;
  }

  // If explicitly empty string, hide it
  if (content.learnMoreText === "") {
    return null;
  }

  // If set, use it. If null/undefined, use defaultText.
  const textToShow = content.learnMoreText || defaultText;

  if (!textToShow) {
    return null;
  }
  
  return <LearnMoreSection text={textToShow} modalContent={content.learnMoreModalContent} />;
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
