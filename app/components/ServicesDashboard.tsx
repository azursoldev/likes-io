"use client";
import { useState, useEffect, useRef } from "react";
import "../admin/dashboard.css";
import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import { getServiceMapping } from "@/lib/service-utils";
import { getDefaultMoreServicesButtons } from "../utils/serviceDefaults";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faTiktok,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import {
  faTimes,
  faPencil,
  faTrash,
  faCheckCircle,
  faChevronDown,
  faInfoCircle,
  faLink,
  faPlus,
  faSearch,
  faBell,
  faSave,
} from "@fortawesome/free-solid-svg-icons";

type Service = {
  id: number;
  name: string;
  platform: "instagram" | "tiktok" | "youtube";
  packages: number;
  active: boolean;
};

const services: Service[] = [
  { id: 1, name: "Instagram Likes", platform: "instagram", packages: 9, active: true },
  { id: 2, name: "Instagram Followers", platform: "instagram", packages: 7, active: true },
  { id: 3, name: "Instagram Views", platform: "instagram", packages: 9, active: true },
  { id: 4, name: "TikTok Likes", platform: "tiktok", packages: 7, active: true },
  { id: 5, name: "TikTok Followers", platform: "tiktok", packages: 7, active: true },
  { id: 6, name: "TikTok Views", platform: "tiktok", packages: 8, active: true },
  { id: 7, name: "YouTube Views", platform: "youtube", packages: 9, active: true },
  { id: 8, name: "YouTube Subscribers", platform: "youtube", packages: 9, active: true },
  { id: 9, name: "YouTube Likes", platform: "youtube", packages: 9, active: true },
];

const getPlatformIcon = (platform: string) => {
  if (platform === "instagram") return faInstagram;
  if (platform === "tiktok") return faTiktok;
  if (platform === "youtube") return faYoutube;
  return faInstagram;
};

const BENEFIT_ICONS = [
  { value: "/fast-delivery.svg", label: "Fast Delivery" },
  { value: "/premium-quality.svg", label: "Premium Quality" },
  { value: "/shield.svg", label: "Secure (Shield)" },
  { value: "/24-hour-service.svg", label: "24/7 Support" },
  { value: "/secure-2.svg", label: "Secure (Lock)" },
  { value: "/padlock.svg", label: "Padlock" },
  { value: "/heart-3.svg", label: "Heart / Likes" },
  { value: "/eye-2.svg", label: "Eye / Views" },
  { value: "/alarm-2.svg", label: "Alarm / Speed" },
];

const CTA_ICONS = [
  { value: "user", label: "User" },
  { value: "eye", label: "Eye" },
  { value: "heart", label: "Heart" },
  { value: "star", label: "Star" },
  { value: "comment", label: "Comment" },
  { value: "share", label: "Share" },
  { value: "play", label: "Play" },
  { value: "image", label: "Image" },
  { value: "hashtag", label: "Hashtag" },
  { value: "bolt", label: "Bolt" },
];

export default function ServicesDashboard() {
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeSection, setActiveSection] = useState("configuration");
  const [showBenefitsForm, setShowBenefitsForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [heroTitle, setHeroTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroRating, setHeroRating] = useState("");
  const [heroReviewCount, setHeroReviewCount] = useState("");
  const [assuranceCardText, setAssuranceCardText] = useState("");
  const [learnMoreText, setLearnMoreText] = useState("");
  const [learnMoreModalContent, setLearnMoreModalContent] = useState("");
  const [howItWorksTitle, setHowItWorksTitle] = useState("");
  const [howItWorksSubtitle, setHowItWorksSubtitle] = useState("");
  
  // Benefits Section State
  const [benefitsTitle, setBenefitsTitle] = useState("");
  const [benefitsSubtitle, setBenefitsSubtitle] = useState("");
  const [benefitsItems, setBenefitsItems] = useState<Array<{ id: number; title: string; desc: string; icon: string }>>([]);

  const [serviceSlug, setServiceSlug] = useState("");
  
  const [steps, setSteps] = useState<Array<{ id: number; title: string; description: string; icon: string }>>([]);
  const [faqItems, setFaqItems] = useState<Array<{ id: number; question: string; answer: string }>>([]);
  const [highQualityPriceOptions, setHighQualityPriceOptions] = useState<Array<{ id: number; name: string; item: string; price1: string; price2: string; disc: string; serviceId: string }>>([]);
  const [premiumPriceOptions, setPremiumPriceOptions] = useState<Array<{ id: number; name: string; item: string; price1: string; price2: string; disc: string; serviceId: string }>>([]);
  const [highQualityFeatures, setHighQualityFeatures] = useState<Array<{ id: number; name: string }>>([]);
  const [premiumFeatures, setPremiumFeatures] = useState<Array<{ id: number; name: string }>>([]);
  const [qualityCompareColumns, setQualityCompareColumns] = useState<Array<{ id: number; title: string; subtitle: string; bullets: string[]; highlight?: boolean; badge?: string }>>([]);
  
  // More Services Section State
  const [moreServicesTitle, setMoreServicesTitle] = useState("");
  const [moreServicesHighlight, setMoreServicesHighlight] = useState("");
  const [moreServicesBody, setMoreServicesBody] = useState("");
  const [moreServicesButtons, setMoreServicesButtons] = useState<Array<{ platform?: string; serviceType?: string; label: string; iconName?: string; href?: string }>>([]);

  // Custom Quantity Settings State
  const [customEnabled, setCustomEnabled] = useState(false);
  const [customMinQuantity, setCustomMinQuantity] = useState("");
  const [customMaxQuantity, setCustomMaxQuantity] = useState("");
  const [customStep, setCustomStep] = useState("");
  const [customRoundToStep, setCustomRoundToStep] = useState(false);

  const sectionRefs = {
    configuration: useRef<HTMLDivElement>(null),
    meta: useRef<HTMLDivElement>(null),
    assurance: useRef<HTMLDivElement>(null),
    benefits: useRef<HTMLDivElement>(null),
    pricing: useRef<HTMLDivElement>(null),
    qualitycompare: useRef<HTMLDivElement>(null),
    howitworks: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
    moreservices: useRef<HTMLDivElement>(null),
  };
  const contentRef = useRef<HTMLDivElement>(null);
  const editContentRef = useRef<HTMLDivElement>(null);
  
  const editSectionRefs = {
    configuration: useRef<HTMLDivElement>(null),
    meta: useRef<HTMLDivElement>(null),
    assurance: useRef<HTMLDivElement>(null),
    benefits: useRef<HTMLDivElement>(null),
    pricing: useRef<HTMLDivElement>(null),
    qualitycompare: useRef<HTMLDivElement>(null),
    howitworks: useRef<HTMLDivElement>(null),
    faq: useRef<HTMLDivElement>(null),
    moreservices: useRef<HTMLDivElement>(null),
  };

  const handleAddServiceClick = () => {
    // Reset and populate with defaults for new service
    setHeroTitle("");
    setMetaTitle("");
    setMetaDescription("");
    setHeroSubtitle("");
    setHeroRating("4.9/5");
    setHeroReviewCount("1,250+ reviews");
    setAssuranceCardText("Join over a million satisfied customers, including artists, companies, and top influencers. Our services are 100% discreet, secure, and delivered naturally to ensure your account is always safe.");
    setLearnMoreText("");
    setLearnMoreModalContent("");
    setHowItWorksTitle("How It Works");
    setHowItWorksSubtitle("Simple steps to get started.");
    
    setSteps([
      { id: 1, title: "Select Package", description: "Choose the package that fits your needs.", icon: "CheckCircle" },
      { id: 2, title: "Enter Details", description: "Provide your username or link. No password required.", icon: "User" },
      { id: 3, title: "See Results", description: "Watch your engagement grow instantly.", icon: "Star" }
    ]);
    
    setBenefitsTitle("The Likes.io Advantage");
    setBenefitsSubtitle("We combine premium quality with industry-leading features to deliver growth you can trust.");
    setBenefitsItems([
      { id: 1, title: "Instant Delivery", desc: "Your order begins the moment you check out, with tangible results in minutes.", icon: "/fast-delivery.svg" },
      { id: 2, title: "Premium Quality", desc: "Enhance your social proof with engagement from high-quality, real-looking profiles.", icon: "/premium-quality.svg" },
      { id: 3, title: "100% Safe & Secure", desc: "Your account's safety is our priority. We never ask for your password.", icon: "/shield.svg" },
      { id: 4, title: "24/7 Customer Support", desc: "Our dedicated global support team is always available to help you.", icon: "/24-hour-service.svg" }
    ]);

    // Default High-Quality Packages
    setHighQualityPriceOptions([
      { id: 1, name: "5% OFF", item: "50", price1: "2.99", price2: "", disc: "", serviceId: "" },
      { id: 2, name: "8% OFF", item: "100", price1: "8.99", price2: "", disc: "", serviceId: "" },
      { id: 3, name: "12% OFF", item: "250", price1: "22.49", price2: "", disc: "", serviceId: "" },
      { id: 4, name: "10% OFF", item: "500", price1: "17.99", price2: "27.99", disc: "You Save $10.00", serviceId: "" },
      { id: 5, name: "25% OFF", item: "1K", price1: "19.99", price2: "", disc: "", serviceId: "" }
    ]);

    // Default Premium Packages
    setPremiumPriceOptions([
      { id: 101, name: "5% OFF", item: "50", price1: "3.49", price2: "", disc: "", serviceId: "" },
      { id: 102, name: "8% OFF", item: "100", price1: "9.99", price2: "", disc: "", serviceId: "" },
      { id: 103, name: "12% OFF", item: "250", price1: "29.99", price2: "", disc: "", serviceId: "" },
      { id: 104, name: "10% OFF", item: "500", price1: "24.99", price2: "34.99", disc: "You Save $10.00", serviceId: "" },
      { id: 105, name: "25% OFF", item: "1K", price1: "29.99", price2: "", disc: "", serviceId: "" }
    ]);

    setHighQualityFeatures([
      { id: 1, name: "Real & High Quality" },
      { id: 2, name: "Fast Delivery" },
      { id: 3, name: "Guaranteed" },
      { id: 4, name: "No Password Needed" },
      { id: 5, name: "24/7 Support" }
    ]);

    setPremiumFeatures([
      { id: 101, name: "Premium Real Users" },
      { id: 102, name: "Instant Delivery" },
      { id: 103, name: "Lifetime Guarantee" },
      { id: 104, name: "No Password Needed" },
      { id: 105, name: "Priority Support" }
    ]);
    
    // Sync to Quality Compare
    setQualityCompareColumns([
      {
        id: 0,
        title: "High-Quality",
        subtitle: "Great for giving your posts a quick and affordable boost.",
        bullets: ["Real & High Quality", "Fast Delivery", "Guaranteed", "No Password Needed", "24/7 Support"],
        highlight: false,
        badge: ""
      },
      {
        id: 1,
        title: "Premium",
        subtitle: "Our best offering for maximum impact and organic growth.",
        bullets: ["Premium Real Users", "Instant Delivery", "Lifetime Guarantee", "No Password Needed", "Priority Support"],
        highlight: true,
        badge: "RECOMMENDED"
      }
    ]);

    setFaqItems([]);
    setMoreServicesTitle("More Growth Services from Likes.io");
    setMoreServicesHighlight("Services");
    setMoreServicesBody("Boost your presence with our other premium services.");
    setMoreServicesButtons([]);
    
    setCustomEnabled(false);
    setCustomMinQuantity("");
    setCustomMaxQuantity("");
    setCustomStep("");
    setCustomRoundToStep(false);

    setShowAddServiceModal(true);
  };

  const handleEditClick = async (service: Service) => {
    setSelectedService(service);
    setShowEditModal(true);
    setActiveSection("configuration");
    setLoading(true);
    setError(null);
    
    // Reset all form state to prevent data from previous service persisting
    setHeroTitle("");
    setMetaTitle("");
    setMetaDescription("");
    setHeroSubtitle("");
    setHeroRating("");
    setHeroReviewCount("");
    setAssuranceCardText("");
    setLearnMoreModalContent("");
    setHowItWorksTitle("");
    setHowItWorksSubtitle("");
    setBenefitsTitle("");
    setBenefitsSubtitle("");
    setBenefitsItems([]);
    setSteps([]);
    setHighQualityPriceOptions([]);
    setPremiumPriceOptions([]);
    setHighQualityFeatures([]);
    setPremiumFeatures([]);
    setQualityCompareColumns([]);
    setFaqItems([]);
    setMoreServicesTitle("");
    setMoreServicesHighlight("");
    setMoreServicesBody("");
    setMoreServicesButtons([]);
    setCustomEnabled(false);
    setCustomMinQuantity("");
    setCustomMaxQuantity("");
    setCustomStep("");
    setCustomRoundToStep(false);
    
    const mapping = getServiceMapping(service.name);
    if (!mapping) {
      setError("Could not determine platform/service type for this service");
      setLoading(false);
      return;
    }
    
    console.log(`Loading service content for: ${service.name}`, {
      platform: mapping.platform,
      serviceType: mapping.serviceType
    });
    
    try {
      const response = await fetch(`/api/cms/service-pages/${mapping.platform}/${mapping.serviceType}`);
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Failed to fetch service content: ${response.status} ${errText}`);
      }
      const data = await response.json();
      
      console.log(`Loaded data for ${mapping.platform}/${mapping.serviceType}:`, {
        hasPackages: !!(data.packages && Array.isArray(data.packages) && data.packages.length > 0),
        packagesCount: data.packages?.length || 0
      });
      
      // Populate form with fetched data or defaults
      setHeroTitle(data.heroTitle || "");
      setMetaTitle(data.metaTitle || "");
      setMetaDescription(data.metaDescription || "");
      setHeroSubtitle(data.heroSubtitle || "");
      setHeroRating(data.heroRating || "");
      setHeroReviewCount(data.heroReviewCount || "");
      setAssuranceCardText(data.assuranceCardText || "Join over a million satisfied customers, including artists, companies, and top influencers. Our services are 100% discreet, secure, and delivered naturally to ensure your account is always safe.");
      setLearnMoreText(data.learnMoreText || "");
      setLearnMoreModalContent(data.learnMoreModalContent || "");
      setServiceSlug(data.slug || service.name.toLowerCase().replace(/\s+/g, '-'));
      setCustomEnabled(data.customEnabled || false);
      setCustomMinQuantity(data.customMinQuantity !== undefined && data.customMinQuantity !== null ? String(data.customMinQuantity) : "");
      setCustomMaxQuantity(data.customMaxQuantity !== undefined && data.customMaxQuantity !== null ? String(data.customMaxQuantity) : "");
      setCustomStep(data.customStep !== undefined && data.customStep !== null ? String(data.customStep) : "");
      setCustomRoundToStep(data.customRoundToStep || false);
      
      if (data.howItWorks) {
        setHowItWorksTitle(data.howItWorks.title || "");
        setHowItWorksSubtitle(data.howItWorks.subtitle || "");
        if (data.howItWorks.steps && Array.isArray(data.howItWorks.steps)) {
          setSteps(data.howItWorks.steps.map((step: any, idx: number) => ({
            id: idx,
            title: step.title || "",
            description: step.description || "",
            icon: step.icon || "CheckCircle"
          })));
        } else {
          setSteps([]);
        }
      } else {
        setSteps([]);
      }

      if (data.benefits) {
        setBenefitsTitle(data.benefits.title || "The Likes.io Advantage");
        setBenefitsSubtitle(data.benefits.subtitle || "We combine premium quality with industry-leading features to deliver growth you can trust.");
        if (data.benefits.items && Array.isArray(data.benefits.items)) {
          setBenefitsItems(data.benefits.items.map((item: any, idx: number) => ({
            id: idx,
            title: item.title || "",
            desc: item.desc || "",
            icon: item.icon || "/premium-quality.svg"
          })));
        } else {
            setBenefitsItems([
                { id: 0, title: "Instant Delivery", desc: "Your order begins the moment you check out, with tangible results in minutes.", icon: "/fast-delivery.svg" },
                { id: 1, title: "Premium Quality", desc: "Enhance your social proof with engagement from high-quality, real-looking profiles.", icon: "/premium-quality.svg" },
                { id: 2, title: "100% Safe & Secure", desc: "Your account's safety is our priority. We never ask for your password.", icon: "/shield.svg" },
                { id: 3, title: "24/7 Customer Support", desc: "Our dedicated global support team is always available to help you.", icon: "/24-hour-service.svg" }
            ]);
        }
      } else {
        setBenefitsTitle("The Likes.io Advantage");
        setBenefitsSubtitle("We combine premium quality with industry-leading features to deliver growth you can trust.");
        setBenefitsItems([
            { id: 0, title: "Instant Delivery", desc: "Your order begins the moment you check out, with tangible results in minutes.", icon: "/fast-delivery.svg" },
            { id: 1, title: "Premium Quality", desc: "Enhance your social proof with engagement from high-quality, real-looking profiles.", icon: "/premium-quality.svg" },
            { id: 2, title: "100% Safe & Secure", desc: "Your account's safety is our priority. We never ask for your password.", icon: "/shield.svg" },
            { id: 3, title: "24/7 Customer Support", desc: "Our dedicated global support team is always available to help you.", icon: "/24-hour-service.svg" }
        ]);
      }
      
      // Reset packages first, then populate if data exists
      setHighQualityPriceOptions([]);
      setPremiumPriceOptions([]);
      
      if (data.packages && Array.isArray(data.packages) && data.packages.length > 0) {
        // Parse packages into price options
        const highQualityTab = data.packages.find((tab: any) => tab.id === "high" || tab.label?.toLowerCase().includes("high"));
        const premiumTab = data.packages.find((tab: any) => tab.id === "premium" || tab.label?.toLowerCase().includes("premium"));
        
        if (highQualityTab && highQualityTab.packages && Array.isArray(highQualityTab.packages) && highQualityTab.packages.length > 0) {
          setHighQualityPriceOptions(highQualityTab.packages.map((pkg: any, idx: number) => ({
            id: Date.now() + idx,
            name: pkg.offText || "",
            item: typeof pkg.qty === "string" ? pkg.qty : String(pkg.qty),
            price1: pkg.price || "",
            price2: pkg.strike || "",
            disc: pkg.save || "",
            serviceId: pkg.serviceId || "" // Load Service ID from saved data
          })));
        }
        
        if (premiumTab && premiumTab.packages && Array.isArray(premiumTab.packages) && premiumTab.packages.length > 0) {
          setPremiumPriceOptions(premiumTab.packages.map((pkg: any, idx: number) => ({
            id: Date.now() + idx + 1000,
            name: pkg.offText || "",
            item: typeof pkg.qty === "string" ? pkg.qty : String(pkg.qty),
            price1: pkg.price || "",
            price2: pkg.strike || "",
            disc: pkg.save || "",
            serviceId: pkg.serviceId || "" // Load Service ID from saved data
          })));
        }
      }
      
      // Reset quality compare columns first
      setQualityCompareColumns([]);
      setHighQualityFeatures([]);
      setPremiumFeatures([]);
      
      if (data.qualityCompare && data.qualityCompare.columns && Array.isArray(data.qualityCompare.columns) && data.qualityCompare.columns.length > 0) {
        setQualityCompareColumns(data.qualityCompare.columns.map((col: any, idx: number) => ({
          id: idx,
          title: col.title || "",
          subtitle: col.subtitle || "",
          bullets: col.bullets || [],
          // Premium column (index 1) should default to highlighted with RECOMMENDED badge
          highlight: idx === 1 ? (col.highlight !== undefined ? col.highlight : true) : (col.highlight || false),
          badge: idx === 1 ? (col.badge || "RECOMMENDED") : (col.badge || "")
        })));
        
        // Extract features from quality compare columns
        // Convert HTML back to markdown format for editing (so user can edit **text** syntax)
        const htmlToMarkdown = (html: string): string => {
          // Convert <strong>text</strong> back to **text**
          let markdown = html.replace(/<strong>(.+?)<\/strong>/gi, '**$1**');
          // Also handle case-insensitive and any remaining HTML tags
          markdown = markdown.replace(/<strong[^>]*>(.+?)<\/strong>/gi, '**$1**');
          return markdown;
        };
        
        // Smartly identify columns instead of relying on index
        const columns = data.qualityCompare.columns;
        let highQualityCol = null;
        let premiumCol = null;
        
        // Try to identify Premium column first
        // It usually has "Premium" in title, or is highlighted, or has badge
        const premiumIdx = columns.findIndex((col: any) => 
          (col.title && col.title.toLowerCase().includes("premium")) || 
          col.highlight === true || 
          (col.badge && col.badge.length > 0)
        );
        
        if (premiumIdx >= 0) {
          premiumCol = columns[premiumIdx];
          // HighQuality is the other one, or if not found, maybe the one with "High" or index 0 (if not premium)
          const highQualityIdx = columns.findIndex((col: any, idx: number) => 
            idx !== premiumIdx && (
              (col.title && col.title.toLowerCase().includes("high")) || 
              !col.highlight
            )
          );
          
          if (highQualityIdx >= 0) {
            highQualityCol = columns[highQualityIdx];
          } else if (columns.length > 1) {
            // If we have 2 columns and one is Premium, the other must be HQ
            highQualityCol = columns.find((_: any, idx: number) => idx !== premiumIdx);
          }
        } else {
          // Fallback: If no explicit Premium found, assume index 0 is HQ, index 1 is Premium (legacy behavior)
          if (columns.length > 0) highQualityCol = columns[0];
          if (columns.length > 1) premiumCol = columns[1];
        }

        if (highQualityCol && highQualityCol.bullets && Array.isArray(highQualityCol.bullets)) {
          setHighQualityFeatures(highQualityCol.bullets.map((bullet: string, idx: number) => ({
            id: Date.now() + idx,
            name: htmlToMarkdown(bullet) // Convert HTML <strong> back to **markdown** for editing
          })));
        }
        
        if (premiumCol && premiumCol.bullets && Array.isArray(premiumCol.bullets)) {
          setPremiumFeatures(premiumCol.bullets.map((bullet: string, idx: number) => ({
            id: Date.now() + idx + 1000,
            name: htmlToMarkdown(bullet) // Convert HTML <strong> back to **markdown** for editing
          })));
        }
      }
      
      // Reset FAQs first
      setFaqItems([]);
      
      // Load FAQs
      if (data.faqs && Array.isArray(data.faqs) && data.faqs.length > 0) {
        setFaqItems(data.faqs.map((faq: any, idx: number) => ({
          id: Date.now() + idx,
          question: faq.q || faq.question || "",
          answer: faq.a || faq.answer || ""
        })));
      }

      // Load More Services
      setMoreServicesTitle(data.moreServicesTitle || "More Growth Services from Likes.io");
      setMoreServicesHighlight(data.moreServicesHighlight || "Services");
      setMoreServicesBody(data.moreServicesBody || "Instagram likes are powerful tools, but they're not the only engagements available from Likes.io. We offer more growth services that can rapidly boost your Instagram fan base or engagement rates even more. Please give them a try to see how quickly you can become popular and important on the app!");
      
      if (data.moreServicesButtons && Array.isArray(data.moreServicesButtons) && data.moreServicesButtons.length > 0) {
        setMoreServicesButtons(data.moreServicesButtons);
      } else {
        setMoreServicesButtons(getDefaultMoreServicesButtons(mapping.platform));
      }
    } catch (err: any) {
      console.error("Error fetching service content:", err);
      setError(err.message || "Failed to load service content");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowAddServiceModal(false);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedService(null);
  };

  const handleSaveChanges = () => {
    // Handle save logic here
    console.log("Saving new service...");
    setShowAddServiceModal(false);
  };

  const handleSaveEditChanges = async () => {
    if (!selectedService) return;
    
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    const mapping = getServiceMapping(selectedService.name);
    if (!mapping) {
      setError("Could not determine platform/service type for this service");
      setSaving(false);
      return;
    }
    
    try {
      // Helper function to parse quantity (handles "1K", "10,000+", etc.)
      const parseQty = (qtyStr: string): number | string => {
        const cleaned = qtyStr.trim();
        // If it contains "K" or "+", return as string
        if (cleaned.includes("K") || cleaned.includes("+")) {
          return cleaned;
        }
        // Try to parse as number
        const num = Number(cleaned.replace(/[^0-9.]/g, ""));
        return isNaN(num) ? cleaned : num;
      };

      // Helper function to calculate per-unit price
      const calculatePerLike = (priceStr: string, qty: number | string, unit: string): string => {
        const price = parseFloat(priceStr.replace(/[^0-9.]/g, "") || "0");
        if (price === 0) return `$0.0000 / ${unit}`;
        
        // If qty is a string (like "1K", "10,000+"), try to parse it
        let qtyNum: number;
        if (typeof qty === "string") {
          if (qty.includes("K")) {
            qtyNum = parseFloat(qty.replace(/[^0-9.]/g, "")) * 1000;
          } else if (qty.includes("+")) {
            // For custom quantities, use a default (e.g., 10000)
            qtyNum = parseFloat(qty.replace(/[^0-9.]/g, "")) || 10000;
          } else {
            qtyNum = parseFloat(qty.replace(/[^0-9.]/g, "")) || 1;
          }
        } else {
          qtyNum = qty || 1;
        }
        
        const perUnit = price / qtyNum;
        return `$${perUnit.toFixed(4)} / ${unit}`;
      };

      const unit = mapping.serviceType === "likes" ? "like" : mapping.serviceType === "followers" ? "follower" : mapping.serviceType === "views" ? "view" : "subscriber";
      
      // Transform form data to API format
      // Always include both high-quality and premium packages, even if empty, so both tabs show on frontend
      const packages = [];
      
      // Always add high-quality packages (even if empty)
      packages.push({
        id: "high",
        label: "High-Quality " + (mapping.serviceType === "likes" ? "Likes" : mapping.serviceType === "followers" ? "Followers" : mapping.serviceType === "views" ? "Views" : "Subscribers"),
        packages: highQualityPriceOptions.length > 0 ? highQualityPriceOptions.map(opt => {
          const qty = parseQty(opt.item);
          return {
            qty,
            perLike: calculatePerLike(opt.price1, qty, unit),
            price: opt.price1,
            strike: opt.price2 || undefined,
            save: opt.disc || undefined,
            offText: opt.name || undefined,
            serviceId: opt.serviceId || undefined // Include Service ID for SMM Panel integration
          };
        }) : []
      });
      
      // Always add premium packages (even if empty)
      packages.push({
        id: "premium",
        label: "Premium " + (mapping.serviceType === "likes" ? "Likes" : mapping.serviceType === "followers" ? "Followers" : mapping.serviceType === "views" ? "Views" : "Subscribers"),
        packages: premiumPriceOptions.length > 0 ? premiumPriceOptions.map(opt => {
          const qty = parseQty(opt.item);
          return {
            qty,
            perLike: calculatePerLike(opt.price1, qty, unit),
            price: opt.price1,
            strike: opt.price2 || undefined,
            save: opt.disc || undefined,
            offText: opt.name || undefined,
            serviceId: opt.serviceId || undefined // Include Service ID for SMM Panel integration
          };
        }) : []
      });
      
      // Build qualityCompare from columns, but sync features from Pricing Tiers if they exist
      let qualityCompareColumnsToSave = [...qualityCompareColumns];
      
      // Helper function to convert markdown-style bold (**text**) to HTML (<strong>text</strong>)
      const convertMarkdownToHTML = (text: string): string => {
        return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      };
      
      // Always sync features from Pricing Tiers to Quality Compare columns
      // This ensures features are always up-to-date
      console.log("DEBUG: Saving - highQualityFeatures:", highQualityFeatures);
      console.log("DEBUG: Saving - premiumFeatures:", premiumFeatures);
      console.log("DEBUG: Saving - Initial columns:", qualityCompareColumnsToSave);
      
      // Sync High-Quality features
      if (highQualityFeatures.length > 0) {
        // Find High-Quality column (contains "High" or NOT Premium)
        // Note: Removed ID check to avoid issues where columns are out of order
        const hqColumnIndex = qualityCompareColumnsToSave.findIndex(
          col => (col.title && col.title.toLowerCase().includes("high")) || 
          (!col.highlight && (!col.title || !col.title.toLowerCase().includes("premium")))
        );

        if (hqColumnIndex >= 0) {
          // Update existing High-Quality column
          qualityCompareColumnsToSave[hqColumnIndex] = {
            ...qualityCompareColumnsToSave[hqColumnIndex],
            id: 0, // Ensure ID is 0
            bullets: highQualityFeatures.map(f => convertMarkdownToHTML(f.name))
          };
        } else {
          // Create High-Quality column if it doesn't exist
          qualityCompareColumnsToSave.push({
            id: 0,
            title: "High-Quality " + (mapping.serviceType === "likes" ? "Likes" : mapping.serviceType === "followers" ? "Followers" : mapping.serviceType === "views" ? "Views" : "Subscribers"),
            subtitle: "Great for giving your posts a quick and affordable boost.",
            bullets: highQualityFeatures.map(f => convertMarkdownToHTML(f.name)),
            highlight: false,
            badge: ""
          });
        }
      }
      
      // Always ensure Premium column exists if we have premium features
      if (premiumFeatures.length > 0) {
        // Find Premium column by title or highlight/badge
        // Note: Removed ID check to avoid issues where columns are out of order
        const premiumColumnIndex = qualityCompareColumnsToSave.findIndex(
          col => (col.title && col.title.toLowerCase().includes("premium")) ||
          col.highlight === true ||
          (col.badge && col.badge.length > 0)
        );
        
        if (premiumColumnIndex >= 0) {
          // Update existing Premium column bullets from features, preserving highlight and badge
          qualityCompareColumnsToSave[premiumColumnIndex] = {
            ...qualityCompareColumnsToSave[premiumColumnIndex],
            id: 1, // Ensure ID is 1
            bullets: premiumFeatures.map(f => convertMarkdownToHTML(f.name)),
            highlight: qualityCompareColumnsToSave[premiumColumnIndex].highlight !== undefined 
              ? qualityCompareColumnsToSave[premiumColumnIndex].highlight 
              : true,
            badge: qualityCompareColumnsToSave[premiumColumnIndex].badge || "RECOMMENDED"
          };
        } else {
          // Create Premium column if it doesn't exist
          qualityCompareColumnsToSave.push({
            id: 1, // Force ID 1 for Premium
            title: "Premium " + (mapping.serviceType === "likes" ? "Likes" : mapping.serviceType === "followers" ? "Followers" : mapping.serviceType === "views" ? "Views" : "Subscribers"),
            subtitle: "Our best offering for maximum impact and organic growth.",
            bullets: premiumFeatures.map(f => convertMarkdownToHTML(f.name)),
            highlight: true,
            badge: "RECOMMENDED"
          });
        }
      }
      
      // Sort columns to ensure High-Quality is first, Premium is second
      const sortedColumns = [...qualityCompareColumnsToSave].sort((a, b) => {
        const aIsPremium = a.id === 1 || (a.title && a.title.toLowerCase().includes("premium"));
        const bIsPremium = b.id === 1 || (b.title && b.title.toLowerCase().includes("premium"));
        
        if (aIsPremium && !bIsPremium) return 1;
        if (!aIsPremium && bIsPremium) return -1;
        return (a.id || 0) - (b.id || 0);
      });
      
      const qualityCompare = sortedColumns.length > 0 ? {
        title: `Compare ${mapping.serviceType === "likes" ? "Like" : mapping.serviceType === "followers" ? "Follower" : mapping.serviceType === "views" ? "View" : "Subscriber"} Quality`,
        columns: sortedColumns.map((col, idx) => {
          const isPremium = col.id === 1 || col.title?.toLowerCase().includes("premium");
          return {
            title: col.title,
            subtitle: col.subtitle,
            bullets: col.bullets && Array.isArray(col.bullets) ? col.bullets : [],
            // Ensure Premium column always has highlight and badge
            highlight: isPremium ? (col.highlight !== undefined ? col.highlight : true) : (col.highlight || false),
            badge: isPremium ? (col.badge || "RECOMMENDED") : (col.badge || "")
          };
        })
      } : null;
      
      console.log("DEBUG: Saving - Final qualityCompare:", JSON.stringify(qualityCompare, null, 2));

      const howItWorks = {
        title: howItWorksTitle || "How It Works",
        subtitle: howItWorksSubtitle || "",
        steps: steps.map(step => ({
          title: step.title,
          description: step.description,
          icon: step.icon
        }))
      };

      const benefits = {
        title: benefitsTitle,
        subtitle: benefitsSubtitle,
        items: benefitsItems.map(item => ({
          title: item.title,
          desc: item.desc,
          icon: item.icon
        }))
      };
      
      const faqs = faqItems.map(item => ({
        q: item.question,
        a: item.answer
      }));
      
      // Log for debugging - verify correct platform/serviceType is being used
      console.log(`Saving service content for: ${selectedService.name}`, {
        platform: mapping.platform,
        serviceType: mapping.serviceType,
        packagesCount: packages.length,
        highQualityPackages: packages[0]?.packages?.length || 0,
        premiumPackages: packages[1]?.packages?.length || 0
      });
      
      const response = await fetch(`/api/cms/service-pages/${mapping.platform}/${mapping.serviceType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: serviceSlug,
          heroTitle,
          metaTitle,
          metaDescription,
          heroSubtitle,
          heroRating,
          heroReviewCount,
          assuranceCardText,
          learnMoreText,
          learnMoreModalContent,
          packages,
          qualityCompare,
          howItWorks,
          benefits,
          faqs,
          moreServicesTitle,
          moreServicesHighlight,
          moreServicesBody,
          moreServicesButtons,
          customEnabled,
          customMinQuantity: customMinQuantity ? parseInt(customMinQuantity) : null,
          customMaxQuantity: customMaxQuantity ? parseInt(customMaxQuantity) : null,
          customStep: customStep ? parseInt(customStep) : null,
          customRoundToStep,
          isActive: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save service content");
      }
      
      const responseData = await response.json();
      
      // Check if there's a warning about assuranceCardText
      if (responseData.warning) {
        setError(responseData.warning);
        // Still show success for other fields
        setSuccess(true);
      } else {
        setSuccess(true);
        setError(null);
      }
      setTimeout(() => {
    setShowEditModal(false);
    setSelectedService(null);
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error("Error saving service content:", err);
      setError(err.message || "Failed to save service content");
    } finally {
      setSaving(false);
    }
  };

  const handleNavClick = (sectionId: string) => {
    const refs = showEditModal ? editSectionRefs : sectionRefs;
    const section = refs[sectionId as keyof typeof refs]?.current;
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  const handleAddStep = () => {
    setSteps([...steps, { id: Date.now(), title: "", description: "", icon: "CheckCircle" }]);
  };

  const handleRemoveStep = (id: number) => {
    setSteps(steps.filter(step => step.id !== id));
  };

  const handleStepChange = (id: number, field: string, value: string) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleAddBenefitItem = () => {
    setBenefitsItems([...benefitsItems, { id: Date.now(), title: "", desc: "", icon: "/premium-quality.svg" }]);
  };

  const handleRemoveBenefitItem = (id: number) => {
    setBenefitsItems(benefitsItems.filter(item => item.id !== id));
  };

  const handleBenefitItemChange = (id: number, field: string, value: string) => {
    setBenefitsItems(benefitsItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleAddFaqItem = () => {
    setFaqItems([...faqItems, { id: Date.now(), question: "", answer: "" }]);
  };

  const handleRemoveFaqItem = (id: number) => {
    setFaqItems(faqItems.filter(item => item.id !== id));
  };

  const handleFaqChange = (id: number, field: string, value: string) => {
    setFaqItems(faqItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // More Services Helper Functions
  const handleAddMoreServiceButton = () => {
    setMoreServicesButtons([...moreServicesButtons, { label: "New Button", iconName: "user", href: "" }]);
  };

  const handleRemoveMoreServiceButton = (index: number) => {
    setMoreServicesButtons(moreServicesButtons.filter((_, i) => i !== index));
  };

  const handleMoreServiceButtonChange = (index: number, field: string, value: string) => {
    setMoreServicesButtons(moreServicesButtons.map((btn, i) => 
      i === index ? { ...btn, [field]: value } : btn
    ));
  };

  const handleAddPriceOption = (type: "highQuality" | "premium") => {
    const newOption = { id: Date.now(), name: "New", item: "", price1: "0", price2: "0", disc: "", serviceId: "" };
    if (type === "highQuality") {
      setHighQualityPriceOptions([...highQualityPriceOptions, newOption]);
    } else {
      setPremiumPriceOptions([...premiumPriceOptions, newOption]);
    }
  };

  const handleRemovePriceOption = (type: "highQuality" | "premium", id: number) => {
    if (type === "highQuality") {
      setHighQualityPriceOptions(highQualityPriceOptions.filter(opt => opt.id !== id));
    } else {
      setPremiumPriceOptions(premiumPriceOptions.filter(opt => opt.id !== id));
    }
  };

  const handlePriceOptionChange = (type: "highQuality" | "premium", id: number, field: string, value: string) => {
    if (type === "highQuality") {
      setHighQualityPriceOptions(highQualityPriceOptions.map(opt => 
        opt.id === id ? { ...opt, [field]: value } : opt
      ));
    } else {
      setPremiumPriceOptions(premiumPriceOptions.map(opt => 
        opt.id === id ? { ...opt, [field]: value } : opt
      ));
    }
  };

  const handleAddFeature = (type: "highQuality" | "premium") => {
    const newFeature = { id: Date.now(), name: "" };
    if (type === "highQuality") {
      const updatedFeatures = [...highQualityFeatures, newFeature];
      setHighQualityFeatures(updatedFeatures);
      // Sync to qualityCompareColumns
      setQualityCompareColumns(prev => {
        const newCols = [...prev];
        // Find High-Quality column (contains "High" or NOT Premium)
        // Note: Removed ID check to avoid issues where columns are out of order
        let hqIndex = newCols.findIndex(col => 
          (col.title && col.title.toLowerCase().includes("high")) || 
          (!col.highlight && (!col.title || !col.title.toLowerCase().includes("premium")))
        );

        if (hqIndex >= 0) {
          newCols[hqIndex] = {
            ...newCols[hqIndex],
            bullets: updatedFeatures.map(f => f.name)
          };
        } else {
          // Create new High-Quality column if it doesn't exist
          // Insert at beginning
          newCols.unshift({
            id: 0,
            title: "High-Quality",
            subtitle: "Great for giving your posts a quick and affordable boost.",
            bullets: updatedFeatures.map(f => f.name),
            highlight: false,
            badge: ""
          });
        }
        return newCols;
      });
    } else {
      const updatedFeatures = [...premiumFeatures, newFeature];
      setPremiumFeatures(updatedFeatures);
      // Sync to qualityCompareColumns
      setQualityCompareColumns(prev => {
        const newCols = [...prev];
        // Find Premium column
        let premiumIndex = newCols.findIndex(col => 
          (col.title && col.title.toLowerCase().includes("premium")) || 
          col.highlight === true || 
          (col.badge && col.badge.length > 0)
        );

        if (premiumIndex >= 0) {
          newCols[premiumIndex] = {
            ...newCols[premiumIndex],
            bullets: updatedFeatures.map(f => f.name)
          };
        } else {
          // Create new Premium column
          newCols.push({
            id: 1,
            title: "Premium",
            subtitle: "Our best offering for maximum impact and organic growth.",
            bullets: updatedFeatures.map(f => f.name),
            highlight: true,
            badge: "RECOMMENDED"
          });
        }
        return newCols;
      });
    }
  };

  const handleRemoveFeature = (type: "highQuality" | "premium", id: number) => {
    if (type === "highQuality") {
      const updatedFeatures = highQualityFeatures.filter(feat => feat.id !== id);
      setHighQualityFeatures(updatedFeatures);
      // Sync to qualityCompareColumns
      setQualityCompareColumns(prev => {
        const newCols = [...prev];
        // Find High-Quality column
        let hqIndex = newCols.findIndex(col => 
          (col.title && col.title.toLowerCase().includes("high")) || 
          (!col.highlight && (!col.title || !col.title.toLowerCase().includes("premium")))
        );

        if (hqIndex >= 0) {
          newCols[hqIndex] = {
            ...newCols[hqIndex],
            bullets: updatedFeatures.map(f => f.name)
          };
        }
        return newCols;
      });
    } else {
      const updatedFeatures = premiumFeatures.filter(feat => feat.id !== id);
      setPremiumFeatures(updatedFeatures);
      // Sync to qualityCompareColumns
      setQualityCompareColumns(prev => {
        const newCols = [...prev];
        // Find Premium column
        let premiumIndex = newCols.findIndex(col => 
          (col.title && col.title.toLowerCase().includes("premium")) || 
          col.highlight === true || 
          (col.badge && col.badge.length > 0)
        );

        if (premiumIndex >= 0) {
          newCols[premiumIndex] = {
            ...newCols[premiumIndex],
            bullets: updatedFeatures.map(f => f.name)
          };
        }
        return newCols;
      });
    }
  };

  const handleFeatureChange = (type: "highQuality" | "premium", id: number, value: string) => {
    if (type === "highQuality") {
      setHighQualityFeatures(highQualityFeatures.map(feat => 
        feat.id === id ? { ...feat, name: value } : feat
      ));
      // Also update qualityCompareColumns bullets
      const updatedFeatures = highQualityFeatures.map(feat => 
        feat.id === id ? { ...feat, name: value } : feat
      );
      setQualityCompareColumns(prev => {
        const newCols = [...prev];
        // Find High-Quality column
        let hqIndex = newCols.findIndex(col => 
          (col.title && col.title.toLowerCase().includes("high")) || 
          (!col.highlight && (!col.title || !col.title.toLowerCase().includes("premium")))
        );

        if (hqIndex >= 0) {
          newCols[hqIndex] = {
            ...newCols[hqIndex],
            bullets: updatedFeatures.map(f => f.name)
          };
        }
        return newCols;
      });
    } else {
      setPremiumFeatures(premiumFeatures.map(feat => 
        feat.id === id ? { ...feat, name: value } : feat
      ));
      // Also update qualityCompareColumns bullets
      const updatedFeatures = premiumFeatures.map(feat => 
        feat.id === id ? { ...feat, name: value } : feat
      );
      setQualityCompareColumns(prev => {
        const newCols = [...prev];
        // Find Premium column
        let premiumIndex = newCols.findIndex(col => 
          (col.title && col.title.toLowerCase().includes("premium")) || 
          col.highlight === true || 
          (col.badge && col.badge.length > 0)
        );

        if (premiumIndex >= 0) {
          newCols[premiumIndex] = {
            ...newCols[premiumIndex],
            bullets: updatedFeatures.map(f => f.name)
          };
        }
        return newCols;
      });
    }
  };

  const handleQualityCompareColumnChange = (index: number, field: string, value: string | boolean) => {
    setQualityCompareColumns(prev => {
      const newCols = [...prev];
      if (newCols[index]) {
        newCols[index] = {
          ...newCols[index],
          [field]: value
        };
      }
      return newCols;
    });
  };

  useEffect(() => {
    if (!showAddServiceModal || !contentRef.current) return;

    const handleScroll = () => {
      const scrollPosition = contentRef.current!.scrollTop + 100;

      for (const [sectionId, ref] of Object.entries(sectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const contentElement = contentRef.current;
    contentElement.addEventListener("scroll", handleScroll);
    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, [showAddServiceModal]);

  useEffect(() => {
    if (!showEditModal || !editContentRef.current) return;

    const handleScroll = () => {
      const scrollPosition = editContentRef.current!.scrollTop + 100;

      for (const [sectionId, ref] of Object.entries(editSectionRefs)) {
        if (ref.current) {
          const { offsetTop, offsetHeight } = ref.current;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const contentElement = editContentRef.current;
    contentElement.addEventListener("scroll", handleScroll);
    return () => contentElement.removeEventListener("scroll", handleScroll);
  }, [showEditModal]);

  const navSections = [
    { id: "configuration", label: "Configuration" },
    { id: "meta", label: "Meta & Hero" },
    { id: "assurance", label: "Assurance Card" },
    { id: "benefits", label: "Benefits Section" },
    { id: "pricing", label: "Pricing Tiers" },
    { id: "qualitycompare", label: "Compare Quality" },
    { id: "howitworks", label: "How It Works" },
    { id: "faq", label: "FAQ" },
    { id: "moreservices", label: "More Services" },
  ];

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="services" />

        <main className="admin-main">
          <div className="admin-toolbar-wrapper">
            <div className="admin-toolbar-container">
              <div className="admin-toolbar">
                <div className="admin-toolbar-left">
                  <h1>Services & Pricing</h1>
                </div>
                <div className="admin-toolbar-right">
                  <div className="admin-search-pill">
                    <span className="search-icon">🔍</span>
                    <input placeholder="Search..." aria-label="Search" />
                  </div>
                  <button className="admin-icon-btn" aria-label="Notifications">
                    <FontAwesomeIcon icon={faBell} />
                  </button>
                  <div className="admin-user-chip">
                    <div className="chip-avatar">AU</div>
                    <div className="chip-meta">
                      <span className="chip-name">Admin User</span>
                      <span className="chip-role">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
         <div className="admin-content">
          <div className="services-hero">
            <div className="services-hero-left">
              <h1>Services & Pricing</h1>
              <p>Manage all products, packages, and their page content.</p>
            </div>
          </div>

          <div className="services-info-box">
            <FontAwesomeIcon icon={faInfoCircle} className="services-info-icon" />
            <div className="services-info-content">
              <h3 className="services-info-heading">How to Automate Orders</h3>
              <p>
                To automate order fulfillment, first configure your provider on the{" "}
                <a href="#" className="services-link">SMM Panel</a> page. Then, edit a service below and link each price package to its corresponding SMM Service ID.
              </p>
            </div>
          </div>
          <div className="services-header-actions">
            <button className="services-add-btn" onClick={handleAddServiceClick}>
              <FontAwesomeIcon icon={faPlus} />
              <span>Add New Service</span>
            </button>
          </div>

       
          <div className="services-list">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-card-left">
                  <div className="service-icon-wrapper">
                    <FontAwesomeIcon icon={getPlatformIcon(service.platform)} className="service-platform-icon" />
                  </div>
                  <div className="service-info">
                    <h3 className="service-name">{service.name}</h3>
                    <p className="service-packages">
                      {service.packages} {service.packages === 1 ? "package" : "packages"} available
                    </p>
                  </div>
                </div>
                <div className="service-card-right">
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked={service.active} />
                    <span className="toggle-slider" />
                  </label>
                  <button className="service-edit-btn" onClick={() => handleEditClick(service)}>Edit Page Content</button>
                </div>
              </div>
            ))}
          </div>
          </div>
        </main>
      </div>

      {showAddServiceModal && (
        <div className="add-service-modal-overlay" onClick={handleCloseModal}>
          <div className="add-service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-service-modal-header">
              <h2>Add New Service</h2>
              <button className="add-service-modal-close" onClick={handleCloseModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="add-service-modal-body">
              <div className="add-service-sidebar">
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    className={`add-service-nav-item ${activeSection === section.id ? "active" : ""}`}
                    onClick={() => handleNavClick(section.id)}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              <div className="add-service-content" ref={contentRef}>
                <div className="add-service-section" ref={sectionRefs.configuration}>
                  <h3 className="add-service-section-title">Service Configuration</h3>
                  <div className="add-service-form-group">
                    <label htmlFor="service-key">Service URL / Key (e.g., 'instagram-followers')</label>
                    <input
                      type="text"
                      id="service-key"
                      className="add-service-input"
                      placeholder="a-unique-service-key"
                    />
                    <p className="add-service-helper">This will be used in the URL. Must be unique, lowercase, with no spaces.</p>
                  </div>
                  
                  <div className="add-service-form-group" style={{ marginTop: "24px", borderTop: "1px solid #eee", paddingTop: "16px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "#333" }}>Custom Quantity Settings</h4>
                    
                    <div className="add-service-form-group">
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", cursor: "pointer" }}>
                        <div className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={customEnabled} 
                            onChange={(e) => setCustomEnabled(e.target.checked)} 
                          />
                          <span className="toggle-slider" />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 500 }}>Enable Custom Quantity Input</span>
                      </label>
                    </div>

                    {customEnabled && (
                      <div className="add-service-two-columns">
                        <div className="add-service-form-group">
                          <label htmlFor="custom-min-qty">Min Quantity</label>
                          <input
                            type="number"
                            id="custom-min-qty"
                            className="add-service-input"
                            placeholder="e.g. 100"
                            value={customMinQuantity}
                            onChange={(e) => setCustomMinQuantity(e.target.value)}
                          />
                        </div>
                        <div className="add-service-form-group">
                          <label htmlFor="custom-max-qty">Max Quantity</label>
                          <input
                            type="number"
                            id="custom-max-qty"
                            className="add-service-input"
                            placeholder="e.g. 10000"
                            value={customMaxQuantity}
                            onChange={(e) => setCustomMaxQuantity(e.target.value)}
                          />
                        </div>
                        <div className="add-service-form-group">
                          <label htmlFor="custom-step">Step (Increment)</label>
                          <input
                            type="number"
                            id="custom-step"
                            className="add-service-input"
                            placeholder="e.g. 100"
                            value={customStep}
                            onChange={(e) => setCustomStep(e.target.value)}
                          />
                        </div>
                        <div className="add-service-form-group" style={{ display: "flex", alignItems: "flex-end", paddingBottom: "10px" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                            <div className="toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={customRoundToStep} 
                                onChange={(e) => setCustomRoundToStep(e.target.checked)} 
                              />
                              <span className="toggle-slider" />
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: 500 }}>Round to nearest step</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="add-service-section" ref={sectionRefs.meta}>
                  <h3 className="add-service-section-title">Meta & Hero</h3>
                  <div className="add-service-two-columns">
                    <div className="add-service-form-group">
                      <label htmlFor="meta-title">Meta Title</label>
                      <input
                        type="text"
                        id="meta-title"
                        className="add-service-input"
                        placeholder="New service page"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="meta-description">Meta Description</label>
                      <input
                        type="text"
                        id="meta-description"
                        className="add-service-input"
                        placeholder="Description for new service"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="hero-title">Hero Title</label>
                      <input
                        type="text"
                        id="hero-title"
                        className="add-service-input"
                        placeholder="New service title"
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="hero-subtitle">Hero Subtitle</label>
                      <div className="add-service-input-wrapper">
                        <input
                          type="text"
                          id="hero-subtitle"
                          className="add-service-input"
                          placeholder="New service subtitle"
                        />
                        <FontAwesomeIcon icon={faPencil} className="add-service-input-icon" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={sectionRefs.benefits}>
                  <h3 className="add-service-section-title">Benefits Section</h3>
                  {!showBenefitsForm ? (
                    <button className="add-service-add-btn" onClick={() => setShowBenefitsForm(true)}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Benefits Section</span>
                    </button>
                  ) : (
                    <div className="benefits-form-card">
                      <div className="add-service-two-columns">
                        <div className="add-service-form-group">
                          <label htmlFor="benefits-title">Section Title</label>
                          <input
                            type="text"
                            id="benefits-title"
                            className="add-service-input"
                            placeholder="Why Buying [Service] Is a Game-Changer"
                          />
                        </div>
                        <div className="add-service-form-group">
                          <label htmlFor="benefits-subtitle">Section Subtitle</label>
                          <textarea
                            id="benefits-subtitle"
                            className="add-service-textarea"
                            placeholder="A subtitle explaining the benefits."
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="add-service-form-group">
                        <label htmlFor="benefits-list">Benefits</label>
                        <button className="add-service-add-btn">
                          <FontAwesomeIcon icon={faPlus} />
                          <span>Add Benefit</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="add-service-section" ref={sectionRefs.pricing}>
                  <h3 className="add-service-section-title">Pricing Tiers</h3>
                  <div className="add-service-pricing-cards">
                    <div className="add-service-pricing-card">
                      <h4 className="pricing-card-title">High-Quality Likes Packages</h4>
                      
                      <div className="price-options-list">
                        {highQualityPriceOptions.map((option) => (
                          <div key={option.id} className="price-option-form">
                            <div className="price-option-row">
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.item}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "item", e.target.value)}
                                placeholder="Qty"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.name}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "name", e.target.value)}
                                placeholder="Unit"
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="add-service-input price-option-field"
                                value={option.price1}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "price1", e.target.value)}
                                placeholder="Price"
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="add-service-input price-option-field"
                                value={option.price2}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "price2", e.target.value)}
                                placeholder="Orig. $"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.disc}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "disc", e.target.value)}
                                placeholder="Discount"
                              />
                            </div>
                            <div className="smm-integration-row">
                              <FontAwesomeIcon icon={faLink} className="smm-link-icon" />
                              <span className="smm-integration-text">SMM Panel Integration</span>
                            </div>
                            <div className="service-id-row">
                              <input
                                type="text"
                                className="add-service-input service-id-input"
                                value={option.serviceId}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "serviceId", e.target.value)}
                                placeholder="Service ID"
                              />
                              <FontAwesomeIcon icon={faInfoCircle} className="service-id-info" />
                              <button
                                className="service-id-delete"
                                onClick={() => handleRemovePriceOption("highQuality", option.id)}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddPriceOption("highQuality")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Price Option</span>
                      </button>
                      
                      <h5 className="pricing-card-subtitle">Features</h5>
                      
                      <div className="features-list">
                        {highQualityFeatures.map((feature) => (
                          <div key={feature.id} className="feature-input-row">
                            <input
                              type="text"
                              className="add-service-input feature-input"
                              value={feature.name}
                              onChange={(e) => handleFeatureChange("highQuality", feature.id, e.target.value)}
                              placeholder="New Feature"
                            />
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleRemoveFeature("highQuality", feature.id)}
                              type="button"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddFeature("highQuality")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature</span>
                      </button>
                    </div>
                    
                    <div className="add-service-pricing-card">
                      <h4 className="pricing-card-title">Premium Packages</h4>
                      
                      <div className="price-options-list">
                        {premiumPriceOptions.map((option) => (
                          <div key={option.id} className="price-option-form">
                            <div className="price-option-row">
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.item}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "item", e.target.value)}
                                placeholder="Qty"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.name}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "name", e.target.value)}
                                placeholder="Unit"
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="add-service-input price-option-field"
                                value={option.price1}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "price1", e.target.value)}
                                placeholder="Price"
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="add-service-input price-option-field"
                                value={option.price2}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "price2", e.target.value)}
                                placeholder="Orig. $"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.disc}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "disc", e.target.value)}
                                placeholder="Discount"
                              />
                            </div>
                            <div className="smm-integration-row">
                              <FontAwesomeIcon icon={faLink} className="smm-link-icon" />
                              <span className="smm-integration-text">SMM Panel Integration</span>
                            </div>
                            <div className="service-id-row">
                              <input
                                type="text"
                                className="add-service-input service-id-input"
                                value={option.serviceId}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "serviceId", e.target.value)}
                                placeholder="Service ID"
                              />
                              <FontAwesomeIcon icon={faInfoCircle} className="service-id-info" />
                              <button
                                className="service-id-delete"
                                onClick={() => handleRemovePriceOption("premium", option.id)}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddPriceOption("premium")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Price Option</span>
                      </button>
                      
                      <h5 className="pricing-card-subtitle">Features</h5>
                      
                      <div className="features-list">
                        {premiumFeatures.map((feature) => (
                          <div key={feature.id} className="feature-input-row">
                            <input
                              type="text"
                              className="add-service-input feature-input"
                              value={feature.name}
                              onChange={(e) => handleFeatureChange("premium", feature.id, e.target.value)}
                              placeholder="New Feature"
                            />
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleRemoveFeature("premium", feature.id)}
                              type="button"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddFeature("premium")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={sectionRefs.howitworks}>
                  <h3 className="add-service-section-title">How It Works Section</h3>
                  <div className="howitworks-form-card">
                    <div className="add-service-two-columns">
                      <div className="add-service-form-group">
                        <label htmlFor="howitworks-title">Section Title</label>
                        <input
                          type="text"
                          id="howitworks-title"
                          className="add-service-input"
                          placeholder="Section Title"
                          defaultValue="How It Works"
                        />
                      </div>
                      <div className="add-service-form-group">
                        <label htmlFor="howitworks-subtitle">Section Subtitle</label>
                        <input
                          type="text"
                          id="howitworks-subtitle"
                          className="add-service-input"
                          placeholder="Section Subtitle"
                          defaultValue="A simple process."
                        />
                      </div>
                    </div>
                    <div className="steps-list">
                      {steps.map((step) => (
                        <div key={step.id} className="step-row">
                          <div className="step-input-group">
                            <input
                              type="text"
                              className="add-service-input step-input"
                              placeholder="Step Title"
                              value={step.title}
                              onChange={(e) => handleStepChange(step.id, "title", e.target.value)}
                            />
                          </div>
                          <div className="step-input-group">
                            <input
                              type="text"
                              className="add-service-input step-input"
                              placeholder="Step Description"
                              value={step.description}
                              onChange={(e) => handleStepChange(step.id, "description", e.target.value)}
                            />
                          </div>
                          <div className="step-icon-select-wrapper">
                            <select
                              className="add-service-input step-icon-select"
                              value={step.icon}
                              onChange={(e) => handleStepChange(step.id, "icon", e.target.value)}
                            >
                              <option value="CheckCircle">CheckCircle</option>
                              <option value="User">User</option>
                              <option value="Star">Star</option>
                              <option value="Heart">Heart</option>
                            </select>
                            <FontAwesomeIcon icon={faChevronDown} className="step-select-arrow" />
                          </div>
                          <button
                            className="step-delete-btn"
                            onClick={() => handleRemoveStep(step.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-service-add-btn" onClick={handleAddStep}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Step</span>
                    </button>
                  </div>
                </div>

                <div className="add-service-section" ref={sectionRefs.faq}>
                  <h3 className="add-service-section-title">FAQ Section</h3>
                  <div className="faq-form-card">
                    <div className="faq-items-list">
                      {faqItems.map((item) => (
                        <div key={item.id} className="faq-item-row">
                          <div className="faq-input-group">
                            <input
                              type="text"
                              className="add-service-input faq-input"
                              placeholder="Question"
                              value={item.question}
                              onChange={(e) => handleFaqChange(item.id, "question", e.target.value)}
                            />
                          </div>
                          <div className="faq-input-group">
                            <textarea
                              className="add-service-textarea faq-textarea"
                              placeholder="Answer"
                              rows={3}
                              value={item.answer}
                              onChange={(e) => handleFaqChange(item.id, "answer", e.target.value)}
                            />
                          </div>
                          <button
                            className="faq-delete-btn"
                            onClick={() => handleRemoveFaqItem(item.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-service-add-btn" onClick={handleAddFaqItem}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add FAQ Item</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="add-service-modal-footer">
              <button className="add-service-btn cancel" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="add-service-btn save" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedService && (
        <div className="add-service-modal-overlay" onClick={handleCloseEditModal}>
          <div className="add-service-modal" onClick={(e) => e.stopPropagation()}>
            <div className="add-service-modal-header">
              <h2>Editing: {selectedService.name}</h2>
              <button className="add-service-modal-close" onClick={handleCloseEditModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div className="add-service-modal-body">
              <div className="add-service-sidebar">
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    className={`add-service-nav-item ${activeSection === section.id ? "active" : ""}`}
                    onClick={() => handleNavClick(section.id)}
                  >
                    {section.label}
                  </button>
                ))}
              </div>

              <div className="add-service-content" ref={editContentRef}>
                <div className="add-service-section" ref={editSectionRefs.configuration}>
                  <h3 className="add-service-section-title">Service Configuration</h3>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-service-key">Service URL / Key (e.g., '{selectedService.name.toLowerCase().replace(/\s+/g, '-')}')</label>
                    <input
                      type="text"
                      id="edit-service-key"
                      className="add-service-input"
                      placeholder="a-unique-service-key"
                      value={serviceSlug}
                      onChange={(e) => setServiceSlug(e.target.value)}
                    />
                    <p className="add-service-helper">This will be used in the URL. Must be unique, lowercase, with no spaces.</p>
                  </div>

                  <div className="add-service-form-group" style={{ marginTop: "24px", borderTop: "1px solid #eee", paddingTop: "16px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", color: "#333" }}>Custom Quantity Settings</h4>
                    
                    <div className="add-service-form-group">
                      <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", cursor: "pointer" }}>
                        <div className="toggle-switch">
                          <input 
                            type="checkbox" 
                            checked={customEnabled} 
                            onChange={(e) => setCustomEnabled(e.target.checked)} 
                          />
                          <span className="toggle-slider" />
                        </div>
                        <span style={{ fontSize: "14px", fontWeight: 500 }}>Enable Custom Quantity Input</span>
                      </label>
                    </div>

                    {customEnabled && (
                      <div className="add-service-two-columns">
                        <div className="add-service-form-group">
                          <label htmlFor="edit-custom-min-qty">Min Quantity</label>
                          <input
                            type="number"
                            id="edit-custom-min-qty"
                            className="add-service-input"
                            placeholder="e.g. 100"
                            value={customMinQuantity}
                            onChange={(e) => setCustomMinQuantity(e.target.value)}
                          />
                        </div>
                        <div className="add-service-form-group">
                          <label htmlFor="edit-custom-max-qty">Max Quantity</label>
                          <input
                            type="number"
                            id="edit-custom-max-qty"
                            className="add-service-input"
                            placeholder="e.g. 10000"
                            value={customMaxQuantity}
                            onChange={(e) => setCustomMaxQuantity(e.target.value)}
                          />
                        </div>
                        <div className="add-service-form-group">
                          <label htmlFor="edit-custom-step">Step (Increment)</label>
                          <input
                            type="number"
                            id="edit-custom-step"
                            className="add-service-input"
                            placeholder="e.g. 100"
                            value={customStep}
                            onChange={(e) => setCustomStep(e.target.value)}
                          />
                        </div>
                        <div className="add-service-form-group" style={{ display: "flex", alignItems: "flex-end", paddingBottom: "10px" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                            <div className="toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={customRoundToStep} 
                                onChange={(e) => setCustomRoundToStep(e.target.checked)} 
                              />
                              <span className="toggle-slider" />
                            </div>
                            <span style={{ fontSize: "14px", fontWeight: 500 }}>Round to nearest step</span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.meta}>
                  <h3 className="add-service-section-title">Meta & Hero</h3>
                  <div className="add-service-two-columns">
                    <div className="add-service-form-group">
                      <label htmlFor="edit-meta-title">Meta Title</label>
                      <input
                        type="text"
                        id="edit-meta-title"
                        className="add-service-input"
                        placeholder="New service page"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="edit-meta-description">Meta Description</label>
                      <input
                        type="text"
                        id="edit-meta-description"
                        className="add-service-input"
                        placeholder="Description for new service"
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="edit-hero-title">Hero Title</label>
                      <input
                        type="text"
                        id="edit-hero-title"
                        className="add-service-input"
                        placeholder="New service title"
                        value={heroTitle}
                        onChange={(e) => setHeroTitle(e.target.value)}
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="edit-hero-subtitle">Hero Subtitle</label>
                      <div className="add-service-input-wrapper">
                        <input
                          type="text"
                          id="edit-hero-subtitle"
                          className="add-service-input"
                          placeholder="New service subtitle"
                          value={heroSubtitle}
                          onChange={(e) => setHeroSubtitle(e.target.value)}
                        />
                        <FontAwesomeIcon icon={faPencil} className="add-service-input-icon" />
                      </div>
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="edit-hero-rating">Hero Rating</label>
                      <input
                        type="text"
                        id="edit-hero-rating"
                        className="add-service-input"
                        placeholder="4.9/5"
                        value={heroRating}
                        onChange={(e) => setHeroRating(e.target.value)}
                      />
                    </div>
                    <div className="add-service-form-group">
                      <label htmlFor="edit-hero-review-count">Hero Review Count</label>
                      <input
                        type="text"
                        id="edit-hero-review-count"
                        className="add-service-input"
                        placeholder="1,352+ reviews"
                        value={heroReviewCount}
                        onChange={(e) => setHeroReviewCount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.assurance}>
                  <h3 className="add-service-section-title">Assurance Card</h3>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-assurance-text">Assurance Card Text</label>
                    <textarea
                      id="edit-assurance-text"
                      className="add-service-textarea"
                      placeholder="Join over a million satisfied customers, including artists, companies, and top influencers. Our services are 100% discreet, secure, and delivered naturally to ensure your account is always safe."
                      rows={4}
                      value={assuranceCardText}
                      onChange={(e) => setAssuranceCardText(e.target.value)}
                    />
                    <p className="add-service-helper">This text appears in the assurance card section below the hero section.</p>
                  </div>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-learn-more-text">Learn More Section Text (Dynamic)</label>
                    <textarea
                      id="edit-learn-more-text"
                      className="add-service-textarea"
                      placeholder="e.g. Learn More About Instagram Followers"
                      rows={4}
                      value={learnMoreText}
                      onChange={(e) => setLearnMoreText(e.target.value)}
                    />
                    <small style={{ color: '#888', marginTop: '5px', display: 'block' }}>
                      Leave empty to hide this section on the frontend.
                    </small>
                  </div>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-learn-more-content">Learn More Modal Content</label>
                    <textarea
                      id="edit-learn-more-content"
                      className="add-service-textarea"
                      placeholder="Content for the modal popup (HTML supported)"
                      rows={8}
                      value={learnMoreModalContent}
                      onChange={(e) => setLearnMoreModalContent(e.target.value)}
                    />
                    <small style={{ color: '#888', marginTop: '5px', display: 'block' }}>
                      HTML tags are supported (e.g. &lt;h3&gt;, &lt;p&gt;).
                    </small>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.benefits}>
                  <h3 className="add-service-section-title">Benefits Section</h3>
                  <div className="benefits-form-card">
                    <div className="add-service-two-columns">
                      <div className="add-service-form-group">
                        <label htmlFor="edit-benefits-title">Section Title</label>
                        <input
                          type="text"
                          id="edit-benefits-title"
                          className="add-service-input"
                          placeholder="The Likes.io Advantage"
                          value={benefitsTitle}
                          onChange={(e) => setBenefitsTitle(e.target.value)}
                        />
                      </div>
                      <div className="add-service-form-group">
                        <label htmlFor="edit-benefits-subtitle">Section Subtitle</label>
                        <textarea
                          id="edit-benefits-subtitle"
                          className="add-service-textarea"
                          placeholder="We combine premium quality with..."
                          rows={3}
                          value={benefitsSubtitle}
                          onChange={(e) => setBenefitsSubtitle(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="add-service-form-group">
                      <label>Benefit Items</label>
                      <div className="features-list">
                          {benefitsItems.map((item) => (
                              <div key={item.id} className="feature-input-row" style={{marginBottom: '10px', flexDirection: 'column', alignItems: 'flex-start', border: '1px solid #eee', padding: '10px', borderRadius: '8px'}}>
                                  <div style={{display: 'flex', width: '100%', marginBottom: '5px', gap: '10px'}}>
                                      <div style={{flex: 1, display: 'flex', alignItems: 'center', gap: '8px'}}>
                                        <select
                                            className="add-service-input"
                                            value={item.icon}
                                            onChange={(e) => handleBenefitItemChange(item.id, 'icon', e.target.value)}
                                            style={{flex: 1}}
                                        >
                                          <option value="">Select Icon</option>
                                          {BENEFIT_ICONS.map((icon) => (
                                            <option key={icon.value} value={icon.value}>
                                              {icon.label}
                                            </option>
                                          ))}
                                        </select>
                                        {item.icon && (
                                          <div style={{width: '32px', height: '32px', background: '#f0f2f5', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px'}}>
                                            <img src={item.icon} alt="" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                          </div>
                                        )}
                                      </div>
                                      <input
                                          type="text"
                                          className="add-service-input"
                                          placeholder="Title"
                                          value={item.title}
                                          onChange={(e) => handleBenefitItemChange(item.id, 'title', e.target.value)}
                                          style={{flex: 2}}
                                      />
                                      <button
                                          className="feature-delete-btn"
                                          onClick={() => handleRemoveBenefitItem(item.id)}
                                          type="button"
                                      >
                                          Del
                                      </button>
                                  </div>
                                  <textarea
                                      className="add-service-textarea"
                                      placeholder="Description"
                                      rows={2}
                                      value={item.desc}
                                      onChange={(e) => handleBenefitItemChange(item.id, 'desc', e.target.value)}
                                      style={{width: '100%'}}
                                  />
                              </div>
                          ))}
                      </div>

                      <button className="add-service-add-btn" onClick={handleAddBenefitItem} type="button">
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Benefit Item</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.pricing}>
                  <h3 className="add-service-section-title">Pricing Tiers</h3>
                  <div className="add-service-pricing-cards">
                    <div className="add-service-pricing-card">
                      <h4 className="pricing-card-title">High-Quality Likes Packages</h4>
                      
                      <div className="price-options-list">
                        {highQualityPriceOptions.map((option) => (
                          <div key={option.id} className="price-option-form">
                            <div className="price-option-row">
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.item}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "item", e.target.value)}
                                placeholder="Qty"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.name}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "name", e.target.value)}
                                placeholder="Unit"
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="add-service-input price-option-field"
                                value={option.price1}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "price1", e.target.value)}
                                placeholder="Price"
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="add-service-input price-option-field"
                                value={option.price2}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "price2", e.target.value)}
                                placeholder="Orig. $"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.disc}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "disc", e.target.value)}
                                placeholder="Discount"
                              />
                            </div>
                            <div className="smm-integration-row">
                              <FontAwesomeIcon icon={faLink} className="smm-link-icon" />
                              <span className="smm-integration-text">SMM Panel Integration</span>
                            </div>
                            <div className="service-id-row">
                              <input
                                type="text"
                                className="add-service-input service-id-input"
                                value={option.serviceId}
                                onChange={(e) => handlePriceOptionChange("highQuality", option.id, "serviceId", e.target.value)}
                                placeholder="Service ID"
                              />
                              <FontAwesomeIcon icon={faInfoCircle} className="service-id-info" />
                              <button
                                className="service-id-delete"
                                onClick={() => handleRemovePriceOption("highQuality", option.id)}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddPriceOption("highQuality")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Price Option</span>
                      </button>
                      
                      <h5 className="pricing-card-subtitle">Features</h5>
                      
                      <div className="features-list">
                        {highQualityFeatures.map((feature) => (
                          <div key={feature.id} className="feature-input-row">
                            <input
                              type="text"
                              className="add-service-input feature-input"
                              value={feature.name}
                              onChange={(e) => handleFeatureChange("highQuality", feature.id, e.target.value)}
                              placeholder="New Feature"
                            />
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleRemoveFeature("highQuality", feature.id)}
                              type="button"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddFeature("highQuality")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature</span>
                      </button>
                    </div>
                    
                    <div className="add-service-pricing-card">
                      <h4 className="pricing-card-title">Premium Packages</h4>
                      
                      <div className="price-options-list">
                        {premiumPriceOptions.map((option) => (
                          <div key={option.id} className="price-option-form">
                            <div className="price-option-row">
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.item}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "item", e.target.value)}
                                placeholder="Qty"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.name}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "name", e.target.value)}
                                placeholder="Unit"
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="add-service-input price-option-field"
                                value={option.price1}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "price1", e.target.value)}
                                placeholder="Price"
                              />
                              <input
                                type="number"
                                step="0.01"
                                className="add-service-input price-option-field"
                                value={option.price2}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "price2", e.target.value)}
                                placeholder="Orig. $"
                              />
                              <input
                                type="text"
                                className="add-service-input price-option-field"
                                value={option.disc}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "disc", e.target.value)}
                                placeholder="Discount"
                              />
                            </div>
                            <div className="smm-integration-row">
                              <FontAwesomeIcon icon={faLink} className="smm-link-icon" />
                              <span className="smm-integration-text">SMM Panel Integration</span>
                            </div>
                            <div className="service-id-row">
                              <input
                                type="text"
                                className="add-service-input service-id-input"
                                value={option.serviceId}
                                onChange={(e) => handlePriceOptionChange("premium", option.id, "serviceId", e.target.value)}
                                placeholder="Service ID"
                              />
                              <FontAwesomeIcon icon={faInfoCircle} className="service-id-info" />
                              <button
                                className="service-id-delete"
                                onClick={() => handleRemovePriceOption("premium", option.id)}
                                type="button"
                              >
                                <FontAwesomeIcon icon={faTimes} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddPriceOption("premium")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Price Option</span>
                      </button>
                      
                      <h5 className="pricing-card-subtitle">Features</h5>
                      
                      <div className="features-list">
                        {premiumFeatures.map((feature) => (
                          <div key={feature.id} className="feature-input-row">
                            <input
                              type="text"
                              className="add-service-input feature-input"
                              value={feature.name}
                              onChange={(e) => handleFeatureChange("premium", feature.id, e.target.value)}
                              placeholder="New Feature"
                            />
                            <button
                              className="feature-delete-btn"
                              onClick={() => handleRemoveFeature("premium", feature.id)}
                              type="button"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <button className="add-service-add-btn" onClick={() => handleAddFeature("premium")}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.qualitycompare}>
                  <h3 className="add-service-section-title">Compare Quality Section</h3>
                  <div className="add-service-form-group">
                    <label>Section Title</label>
                    <input
                      type="text"
                      className="add-service-input"
                      placeholder="Compare Like Quality"
                      value={qualityCompareColumns.length > 0 ? `Compare ${selectedService?.name.split(' ')[1] || 'Like'} Quality` : ''}
                      readOnly
                    />
                    <p className="add-service-helper">Title is automatically generated based on service type.</p>
                  </div>
                  
                  {qualityCompareColumns.length > 0 && (
                    <div className="add-service-pricing-cards">
                      {qualityCompareColumns.map((col, idx) => (
                        <div key={col.id} className="add-service-pricing-card">
                          <h4 className="pricing-card-title">{col.title || (idx === 0 ? "High-Quality" : "Premium")}</h4>
                          
                          <div className="add-service-form-group">
                            <label>Column Title</label>
                            <input
                              type="text"
                              className="add-service-input"
                              value={col.title}
                              onChange={(e) => handleQualityCompareColumnChange(idx, "title", e.target.value)}
                              placeholder="High-Quality Likes"
                            />
                          </div>
                          
                          <div className="add-service-form-group">
                            <label>Subtitle</label>
                            <textarea
                              className="add-service-textarea"
                              value={col.subtitle}
                              onChange={(e) => handleQualityCompareColumnChange(idx, "subtitle", e.target.value)}
                              placeholder="Great for giving your posts a quick and affordable boost."
                              rows={2}
                            />
                          </div>
                          
                          <h5 className="pricing-card-subtitle">Features</h5>
                          <p className="add-service-helper">Features are synced from the Pricing Tiers section above. Edit them there.</p>
                          
                          <div className="features-list">
                            {(idx === 0 ? highQualityFeatures : premiumFeatures).map((feature) => (
                              <div key={feature.id} className="feature-input-row">
                                <input
                                  type="text"
                                  className="add-service-input feature-input"
                                  value={feature.name}
                                  onChange={(e) => handleFeatureChange(idx === 0 ? "highQuality" : "premium", feature.id, e.target.value)}
                                  placeholder="Feature description"
                                />
                                <button
                                  className="feature-delete-btn"
                                  onClick={() => handleRemoveFeature(idx === 0 ? "highQuality" : "premium", feature.id)}
                                  type="button"
                                >
                                  Del
                                </button>
                              </div>
                            ))}
                          </div>
                          
                          <button className="add-service-add-btn" onClick={() => handleAddFeature(idx === 0 ? "highQuality" : "premium")}>
                            <FontAwesomeIcon icon={faPlus} />
                            <span>Add Feature</span>
                          </button>
                          
                          {idx === 1 && (
                            <>
                              <div className="add-service-form-group" style={{ marginTop: "16px" }}>
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={col.highlight || false}
                                    onChange={(e) => handleQualityCompareColumnChange(idx, "highlight", e.target.checked)}
                                  />
                                  <span style={{ marginLeft: "8px" }}>Highlight (Premium badge)</span>
                                </label>
                              </div>
                              
                              <div className="add-service-form-group">
                                <label>Badge Text</label>
                                <input
                                  type="text"
                                  className="add-service-input"
                                  value={col.badge || ""}
                                  onChange={(e) => handleQualityCompareColumnChange(idx, "badge", e.target.value)}
                                  placeholder="RECOMMENDED"
                                />
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {qualityCompareColumns.length === 0 && (
                    <div className="add-service-info-box">
                      <p>Quality Compare section will be created automatically when you add features in the Pricing Tiers section above.</p>
                    </div>
                  )}
                </div>

                <div className="add-service-section" ref={editSectionRefs.howitworks}>
                  <h3 className="add-service-section-title">How It Works</h3>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-howitworks-title">Section Title</label>
                    <input
                      type="text"
                      id="edit-howitworks-title"
                      className="add-service-input"
                      placeholder="Section Title"
                      value={howItWorksTitle}
                      onChange={(e) => setHowItWorksTitle(e.target.value)}
                    />
                  </div>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-howitworks-subtitle">Section Subtitle</label>
                    <input
                      type="text"
                      id="edit-howitworks-subtitle"
                      className="add-service-input"
                      placeholder="Section Subtitle"
                      value={howItWorksSubtitle}
                      onChange={(e) => setHowItWorksSubtitle(e.target.value)}
                    />
                  </div>
                  <div className="add-service-form-group">
                    <label>Steps</label>
                    {steps.map((step) => (
                      <div key={step.id} className="add-service-step-card">
                        <div className="add-service-step-row">
                          <input
                            type="text"
                            className="add-service-input"
                            placeholder="Step Title"
                            value={step.title}
                            onChange={(e) => handleStepChange(step.id, "title", e.target.value)}
                          />
                          <textarea
                            className="add-service-textarea"
                            placeholder="Step Description"
                            rows={2}
                            value={step.description}
                            onChange={(e) => handleStepChange(step.id, "description", e.target.value)}
                          />
                          <select
                            className="add-service-step-icon-dropdown"
                            value={step.icon}
                            onChange={(e) => handleStepChange(step.id, "icon", e.target.value)}
                          >
                            <option value="CheckCircle">Check Circle</option>
                            <option value="User">User</option>
                            <option value="Star">Star</option>
                          </select>
                          <button
                            className="step-delete-btn"
                            onClick={() => handleRemoveStep(step.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="add-service-add-btn" onClick={handleAddStep}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Step</span>
                    </button>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.faq}>
                  <h3 className="add-service-section-title">FAQ Section</h3>
                  <div className="faq-form-card">
                    <div className="faq-items-list">
                      {faqItems.map((item) => (
                        <div key={item.id} className="faq-item-row">
                          <div className="faq-input-group">
                            <input
                              type="text"
                              className="add-service-input faq-input"
                              placeholder="Question"
                              value={item.question}
                              onChange={(e) => handleFaqChange(item.id, "question", e.target.value)}
                            />
                          </div>
                          <div className="faq-input-group">
                            <textarea
                              className="add-service-textarea faq-textarea"
                              placeholder="Answer"
                              rows={3}
                              value={item.answer}
                              onChange={(e) => handleFaqChange(item.id, "answer", e.target.value)}
                            />
                          </div>
                          <button
                            className="faq-delete-btn"
                            onClick={() => handleRemoveFaqItem(item.id)}
                            type="button"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-service-add-btn" onClick={handleAddFaqItem}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add FAQ Item</span>
                    </button>
                  </div>
                </div>

                <div className="add-service-section" ref={editSectionRefs.moreservices}>
                  <h3 className="add-service-section-title">More Services Section</h3>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-moreservices-title">Section Title</label>
                    <input
                      type="text"
                      id="edit-moreservices-title"
                      className="add-service-input"
                      placeholder="e.g. More Growth Services from Likes.io"
                      value={moreServicesTitle}
                      onChange={(e) => setMoreServicesTitle(e.target.value)}
                    />
                  </div>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-moreservices-highlight">Highlight Word</label>
                    <input
                      type="text"
                      id="edit-moreservices-highlight"
                      className="add-service-input"
                      placeholder="e.g. Services"
                      value={moreServicesHighlight}
                      onChange={(e) => setMoreServicesHighlight(e.target.value)}
                    />
                  </div>
                  <div className="add-service-form-group">
                    <label htmlFor="edit-moreservices-body">Description Body</label>
                    <textarea
                      id="edit-moreservices-body"
                      className="add-service-textarea"
                      placeholder="Description text..."
                      rows={4}
                      value={moreServicesBody}
                      onChange={(e) => setMoreServicesBody(e.target.value)}
                    />
                  </div>
                  
                  <h4 className="pricing-card-subtitle" style={{marginTop: '20px'}}>Service Buttons</h4>
                  <div className="faq-form-card">
                    <div className="faq-items-list">
                      {moreServicesButtons.map((btn, idx) => (
                        <div key={idx} className="faq-item-row" style={{display: 'flex', alignItems: 'flex-end', flexDirection: 'row', gap: '10px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                           <div className="faq-input-group" style={{flex: 1, minWidth: 0}}>
                            <label style={{fontSize: '12px', marginBottom: '4px', display: 'block', color: '#666'}}>Button Label</label>
                            <input
                              type="text"
                              className="add-service-input"
                              placeholder="Button Label"
                              value={btn.label}
                              onChange={(e) => handleMoreServiceButtonChange(idx, "label", e.target.value)}
                              style={{width: '100%'}}
                            />
                          </div>
                          
                          <div className="faq-input-group" style={{width: '120px', flexShrink: 0}}>
                            <label style={{fontSize: '12px', marginBottom: '4px', display: 'block', color: '#666'}}>Icon</label>
                            <div style={{position: 'relative', width: '100%'}}>
                              <select
                                className="add-service-input"
                                value={btn.iconName || "user"}
                                onChange={(e) => handleMoreServiceButtonChange(idx, "iconName", e.target.value)}
                                style={{paddingRight: '30px', width: '100%'}}
                              >
                                {CTA_ICONS.map((icon) => (
                                  <option key={icon.value} value={icon.value}>{icon.label}</option>
                                ))}
                              </select>
                              <FontAwesomeIcon icon={faChevronDown} style={{position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999', pointerEvents: 'none'}} />
                            </div>
                          </div>

                          <div className="faq-input-group" style={{flex: 1.5, minWidth: 0}}>
                            <label style={{fontSize: '12px', marginBottom: '4px', display: 'block', color: '#666'}}>Link URL</label>
                            <div style={{position: 'relative', width: '100%'}}>
                              <input
                                type="text"
                                className="add-service-input"
                                placeholder="https://... or /path"
                                value={btn.href || ""}
                                onChange={(e) => handleMoreServiceButtonChange(idx, "href", e.target.value)}
                                style={{paddingLeft: '30px', width: '100%'}}
                              />
                              <FontAwesomeIcon icon={faLink} style={{position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999'}} />
                            </div>
                          </div>
                          
                          <button
                            className="faq-delete-btn"
                            onClick={() => handleRemoveMoreServiceButton(idx)}
                            type="button"
                            style={{marginBottom: '2px', height: '42px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button className="add-service-add-btn" onClick={handleAddMoreServiceButton}>
                      <FontAwesomeIcon icon={faPlus} />
                      <span>Add Service Button</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="add-service-modal-footer">
              {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
              {success && <div style={{ color: 'green', marginBottom: '1rem' }}>Content saved successfully!</div>}
              <button className="add-service-btn cancel" onClick={handleCloseEditModal} disabled={saving}>
                Cancel
              </button>
              <button className="add-service-btn save" onClick={handleSaveEditChanges} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
