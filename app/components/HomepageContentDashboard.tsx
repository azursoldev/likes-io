"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faXmark, 
  faImage, 
  faSave, 
  faBars,
  faChevronDown,
  faChevronRight,
  faChevronUp,
  faHeart,
  faUser,
  faComment,
  faEye,
  faEyeSlash,
  faCircleInfo,
  faStar,
  faBookOpen,
  faBell,
  faCheckCircle,
  faFire,
  faShield,
  faAward,
  faLifeRing,
  faQuestionCircle,
  faCheck,
  faClock,
  faPaperPlane,
  faArrowLeft,
  faArrowRight,
  faArrowUp,
  faMinus,
  faSearch,
  faShare,
  faEnvelope,
  faLink,
  faSun,
  faMoon,
  faHome,
  faPlayCircle,
  faHeadphones,
  faThumbsUp,
  faRotate,
  faLock,
  faCreditCard,
  faBitcoinSign,
  faGauge,
  faList,
  faGear,
  faArrowRightFromBracket,
  faFilter,
  faUserCircle,
  faTag,
  faClipboardList,
  faCube,
  faChartBar,
  faDollarSign,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

import { iconMap } from "./IconMap";

type Benefit = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

const initialBenefits: Benefit[] = [];

// Default values matching the current Hero component
const DEFAULT_HERO_TITLE = "";
const DEFAULT_HERO_SUBTITLE = "";
const DEFAULT_BUTTON1_TEXT = "";
const DEFAULT_BUTTON1_LINK = "";
const DEFAULT_BUTTON2_TEXT = "";
const DEFAULT_BUTTON2_LINK = "";
const DEFAULT_REVIEW_COUNT = "";
const DEFAULT_RATING = "";

type PlatformCard = {
  key: string;
  name: string;
  desc: string;
  tags: string[];
  cta: string;
  serviceType: string;
  rating?: string;
  reviews?: string;
  icon?: string;
  iconFile?: File; // For upload only
};

type InfluenceSubpoint = {
  title: string;
  text: string;
};

type InfluenceStep = {
  id: number;
  title: string;
  description: string;
  subpoints?: InfluenceSubpoint[];
};

type QuickStartButton = {
  id: number;
  label: string;
  link: string;
  gradientClass: string;
  icon: string;
};

const initialInfluenceSteps: InfluenceStep[] = [
  {
    id: 1,
    title: "Select Your Package",
    description: "Choose from our variety of high-quality services designed to meet your specific needs."
  },
  {
    id: 2,
    title: "Enter Your Details",
    description: "Provide your username or link. We never ask for your password or sensitive data."
  },
  {
    id: 3,
    title: "Watch Your Growth",
    description: "Sit back and relax while we deliver your order instantly and securely."
  }
];

const initialQuickStartButtons: QuickStartButton[] = [];

const initialPlatformCards: PlatformCard[] = [];

type AvailableIcon = {
  id: string;
  name: string;
  url?: string;
  category?: string;
  alt?: string;
};

export default function HomepageContentDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Icon Selector State
  const [availableIcons, setAvailableIcons] = useState<AvailableIcon[]>([]);
  const [isIconSelectorOpen, setIsIconSelectorOpen] = useState(false);
  const [currentIconSelectorIndex, setCurrentIconSelectorIndex] = useState<number | null>(null);
  
  const [heroTitle, setHeroTitle] = useState(DEFAULT_HERO_TITLE);
  const [heroSubtitle, setHeroSubtitle] = useState(DEFAULT_HERO_SUBTITLE);
  const [button1Text, setButton1Text] = useState(DEFAULT_BUTTON1_TEXT);
  const [button1Link, setButton1Link] = useState(DEFAULT_BUTTON1_LINK);
  const [button2Text, setButton2Text] = useState(DEFAULT_BUTTON2_TEXT);
  const [button2Link, setButton2Link] = useState(DEFAULT_BUTTON2_LINK);
  const [reviewCountText, setReviewCountText] = useState(DEFAULT_REVIEW_COUNT);
  const [rating, setRating] = useState(DEFAULT_RATING);
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImageName, setHeroImageName] = useState("");
  const [heroProfileImage, setHeroProfileImage] = useState("");
  const [heroProfileHandle, setHeroProfileHandle] = useState("");
  const [heroProfileRole, setHeroProfileRole] = useState("");
  const [heroProfileLikes, setHeroProfileLikes] = useState("");
  const [heroProfileFollowers, setHeroProfileFollowers] = useState("");
  const [heroProfileEngagement, setHeroProfileEngagement] = useState("");
  
  const [platformTitle, setPlatformTitle] = useState("");
  const [platformSubtitle, setPlatformSubtitle] = useState("");
  const [platformCards, setPlatformCards] = useState<PlatformCard[]>(initialPlatformCards);
  
  const [whyChooseTitle, setWhyChooseTitle] = useState("");
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState("");
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);

  const [influenceTitle, setInfluenceTitle] = useState("");
  const [influenceSubtitle, setInfluenceSubtitle] = useState("");
  const [influenceSteps, setInfluenceSteps] = useState<InfluenceStep[]>(initialInfluenceSteps);
  const [influenceImageFile, setInfluenceImageFile] = useState<File | null>(null);
  const [influenceImageName, setInfluenceImageName] = useState("");
  const [influenceImage, setInfluenceImage] = useState("");
  
  const [quickStartTitle, setQuickStartTitle] = useState("");
  const [quickStartDescription1, setQuickStartDescription1] = useState("");
  const [quickStartDescription2, setQuickStartDescription2] = useState("");
  const [quickStartButtons, setQuickStartButtons] = useState<QuickStartButton[]>(initialQuickStartButtons);

  const [getStartedMainHeading, setGetStartedMainHeading] = useState("Get Started Instantly");

  // Get Started Instantly State
  const [gsPlatform, setGsPlatform] = useState("instagram");
  const [gsService, setGsService] = useState("likes");
  const [gsQuality, setGsQuality] = useState("premium");
  const [gsFeatures, setGsFeatures] = useState<string[]>([]);
  const [gsExplanation, setGsExplanation] = useState("");
  const [gsHeading, setGsHeading] = useState("");
  const [gsExplanationTitle, setGsExplanationTitle] = useState("");
  const [gsLoading, setGsLoading] = useState(false);
  const [gsSaving, setGsSaving] = useState(false);
  const [gsMessage, setGsMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Service Icons State
  const [serviceIcons, setServiceIcons] = useState<Record<string, { icon: string, label: string }>>({
    likes: { icon: '', label: 'Likes' },
    followers: { icon: '', label: 'Followers' },
    views: { icon: '', label: 'Views' },
    subscribers: { icon: '', label: 'Subscribers' }
  });
  // Platform Icons State
  const [getStartedPlatformIcons, setGetStartedPlatformIcons] = useState<Record<string, { icon: string, label: string }>>({
    instagram: { icon: '', label: 'Instagram' },
    tiktok: { icon: '', label: 'TikTok' },
    youtube: { icon: '', label: 'YouTube' }
  });
  const [currentIconSelectorContext, setCurrentIconSelectorContext] = useState<'platformCard' | 'serviceIcon' | 'gsPlatformIcon' | 'quickStartButton' | 'benefit'>('platformCard');
  const [currentServiceIconKey, setCurrentServiceIconKey] = useState<string | null>(null);
  const [currentGsPlatformIconKey, setCurrentGsPlatformIconKey] = useState<string | null>(null);
  const [currentQuickStartButtonId, setCurrentQuickStartButtonId] = useState<number | null>(null);
  const [currentBenefitId, setCurrentBenefitId] = useState<number | null>(null);

  // Fetch homepage content on mount
  useEffect(() => {
    fetchHomepageContent();
    fetchIcons();
  }, []);

  // Fetch icons for selector
  const fetchIcons = async () => {
    try {
      const res = await fetch("/api/cms/icons");
      if (res.ok) {
        const data = await res.json();
        setAvailableIcons(data.icons || []);
      }
    } catch (err) {
      console.error("Failed to fetch icons:", err);
    }
  };

  // Fetch Get Started content when selection changes
  useEffect(() => {
    fetchGetStartedContent();
  }, [gsPlatform, gsService, gsQuality]);

  const fetchGetStartedContent = async () => {
    try {
      setGsLoading(true);
      const res = await fetch(`/api/cms/get-started?platform=${gsPlatform}&serviceType=${gsService}&quality=${gsQuality}`);
      if (res.ok) {
        const data = await res.json();
        setGsFeatures(Array.isArray(data.features) ? data.features : []);
        setGsExplanation(data.explanation || "");
        setGsHeading(data.heading || "");
        setGsExplanationTitle(data.explanationTitle || "");
      }
    } catch (error) {
      console.error("Failed to fetch Get Started content", error);
    } finally {
      setGsLoading(false);
    }
  };

  const handleSaveGetStarted = async () => {
    try {
      setGsSaving(true);
      setGsMessage(null);
      const res = await fetch('/api/cms/get-started', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: gsPlatform,
          serviceType: gsService,
          quality: gsQuality,
          features: gsFeatures,
          explanation: gsExplanation,
          heading: gsHeading,
          explanationTitle: gsExplanationTitle
        })
      });

      if (res.ok) {
        setGsMessage({ type: 'success', text: 'Content saved successfully!' });
        setTimeout(() => setGsMessage(null), 3000);
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      setGsMessage({ type: 'error', text: 'Failed to save content' });
    } finally {
      setGsSaving(false);
    }
  };

  const handleAddFeature = () => {
    setGsFeatures([...gsFeatures, "New Feature"]);
  };

  const handleUpdateFeature = (index: number, value: string) => {
    const newFeatures = [...gsFeatures];
    newFeatures[index] = value;
    setGsFeatures(newFeatures);
  };

  const handleRemoveFeature = (index: number) => {
    setGsFeatures(gsFeatures.filter((_, i) => i !== index));
  };

  const updateStateFromData = (content: any) => {
    if (!content) return;

    setHeroTitle(content.heroTitle || "");
    setHeroSubtitle(content.heroSubtitle || "");
    setRating(content.heroRating || "");
    setReviewCountText(content.heroReviewCount || "");
    
    // Hero Profile Card
    setHeroProfileHandle(content.heroProfileHandle || "");
    setHeroProfileRole(content.heroProfileRole || "");
    setHeroProfileLikes(content.heroProfileLikes || "");
    setHeroProfileFollowers(content.heroProfileFollowers || "");
    setHeroProfileEngagement(content.heroProfileEngagement || "");
    setHeroProfileImage(content.heroProfileImage || "");
    if (content.heroProfileImage) {
      const fileName = content.heroProfileImage.split('/').pop();
      setHeroImageName(fileName || "Existing Image");
    }
    
    // Platform Section
    setPlatformTitle(content.platformTitle || "");
    setPlatformSubtitle(content.platformSubtitle || "");
    if (content.platformCards) {
      setPlatformCards(content.platformCards);
    }
    
    // Why Choose Us
    setWhyChooseTitle(content.whyChooseTitle || "");
    setWhyChooseSubtitle(content.whyChooseSubtitle || "");
    
    // Influence Section
    setInfluenceTitle(content.influenceTitle || "");
    setInfluenceSubtitle(content.influenceSubtitle || "");
    if (content.influenceSteps && content.influenceSteps.length > 0) {
      setInfluenceSteps(content.influenceSteps);
    } else {
      setInfluenceSteps(initialInfluenceSteps);
    }
    setInfluenceImage(content.influenceImage || "");
    if (content.influenceImage) {
      const fileName = content.influenceImage.split('/').pop();
      setInfluenceImageName(fileName || "Existing Image");
    }
    
    // Quick Start Section
    setQuickStartTitle(content.quickStartTitle || "");
    setQuickStartDescription1(content.quickStartDescription1 || "");
    setQuickStartDescription2(content.quickStartDescription2 || "");
    if (content.quickStartButtons) {
      setQuickStartButtons(content.quickStartButtons);
    }
    
    setGetStartedMainHeading(content.getStartedMainHeading || "Get Started Instantly");

    if (content.serviceIcons) {
      // Ensure all keys exist even if partial data is returned
      setServiceIcons(prev => ({ ...prev, ...content.serviceIcons }));
    }

    if (content.getStartedPlatformIcons) {
      setGetStartedPlatformIcons(prev => ({ ...prev, ...content.getStartedPlatformIcons }));
    }
    
    if (content.benefits) {
      setBenefits(content.benefits);
    }

    // Parse CTA buttons if they exist
    if (content.heroCtaButtons && Array.isArray(content.heroCtaButtons)) {
      if (content.heroCtaButtons[0]) {
        setButton1Text(content.heroCtaButtons[0].text || "");
        setButton1Link(content.heroCtaButtons[0].link || "");
      }
      if (content.heroCtaButtons[1]) {
        setButton2Text(content.heroCtaButtons[1].text || "");
        setButton2Link(content.heroCtaButtons[1].link || "");
      }
    }
  };

  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/cms/homepage?t=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch homepage content');
      }
      
      const data = await response.json();
      console.log('Admin Dashboard: Fetched homepage content:', data);
      
      if (data.content) {
        updateStateFromData(data.content);
      }
    } catch (err: any) {
      console.error('Error fetching homepage content:', err);
      // Use defaults on error
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const heroCtaButtons = [
        { text: button1Text, link: button1Link },
        { text: button2Text, link: button2Link },
      ];

      let imageUrl = heroProfileImage;
      
      console.log('Admin Dashboard: Starting Save. Initial heroProfileImage state:', heroProfileImage);
      console.log('Admin Dashboard: HeroImage file selected:', heroImage ? heroImage.name : 'None');

      if (heroImage) {
        const formData = new FormData();
        formData.append('file', heroImage);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload hero image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url || uploadData.publicUrl;
        console.log('Admin Dashboard: Upload successful. New imageUrl:', imageUrl);
        setHeroProfileImage(imageUrl);
      } else {
        console.log('Admin Dashboard: No new file uploaded. Using existing URL:', imageUrl);
      }

      let influenceImageUrl = influenceImage;

      if (influenceImageFile) {
        const formData = new FormData();
        formData.append('file', influenceImageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload influence image');
        }

        const uploadData = await uploadResponse.json();
        influenceImageUrl = uploadData.url || uploadData.publicUrl;
        setInfluenceImage(influenceImageUrl);
      }

      // Handle Platform Card Icon Uploads
      const updatedPlatformCards = await Promise.all(platformCards.map(async (card) => {
        if (card.iconFile) {
          const formData = new FormData();
          formData.append('file', card.iconFile);
          
          try {
            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              body: formData,
            });
            
            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json();
              // Return new object with updated icon URL and without iconFile
              const { iconFile, ...rest } = card;
              return {
                ...rest,
                icon: uploadData.url || uploadData.publicUrl
              };
            }
          } catch (error) {
            console.error('Failed to upload platform icon:', error);
          }
        }
        // Remove iconFile if it exists but wasn't uploaded (or if it was already undefined)
        const { iconFile, ...rest } = card;
        return rest;
      }));

      const payload = {
          heroTitle,
          heroSubtitle,
          heroRating: rating,
          heroReviewCount: reviewCountText,
          heroCtaButtons,
          heroProfileHandle,
          heroProfileRole,
          heroProfileLikes,
          heroProfileFollowers,
          heroProfileEngagement,
          heroProfileImage: imageUrl,
          platformTitle,
          platformSubtitle,
          platformCards: updatedPlatformCards,
          whyChooseTitle,
          whyChooseSubtitle,
          benefits,
          influenceTitle,
          influenceSubtitle,
          influenceSteps,
          influenceImage: influenceImageUrl,
          quickStartTitle,
          quickStartDescription1,
          quickStartDescription2,
          quickStartButtons,
          getStartedMainHeading,
          serviceIcons,
          getStartedPlatformIcons,
          isActive: true,
      };
      
      console.log('Admin Dashboard: Sending PATCH request with payload:', payload);

      const response = await fetch('/api/cms/homepage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to save (${response.status})`);
      }

      const responseData = await response.json();
      if (responseData.content) {
          console.log('Admin Dashboard: Update successful. Syncing state with server response.');
          updateStateFromData(responseData.content);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Clear file inputs after successful save
      setHeroImage(null);
      setInfluenceImageFile(null);
      
      // Removed immediate refetch to avoid race conditions with cache
      // fetchHomepageContent();
    } catch (err: any) {
      setError(err.message || 'Failed to save homepage content');
      console.error('Error saving homepage content:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBenefit = () => {
    const newBenefit: Benefit = {
      id: Date.now(),
      icon: "RocketLaunchIcon",
      title: "",
      description: "",
    };
    setBenefits((prev) => [...prev, newBenefit]);
  };

  const handleRemoveBenefit = (id: number) => {
    setBenefits((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateBenefit = (id: number, field: keyof Benefit, value: string) => {
    setBenefits((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleAddPlatformCard = () => {
    const newCard: PlatformCard = {
      key: "instagram",
      name: "New Platform",
      desc: "Description for the new platform.",
      tags: ["Tag1", "Tag2"],
      cta: "View Services",
      serviceType: "likes",
    };
    setPlatformCards((prev) => [...prev, newCard]);
  };

  const handleRemovePlatformCard = (index: number) => {
    setPlatformCards((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImage(file);
      setHeroImageName(file.name);
    }
  };

  const handlePlatformIconUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newCards = [...platformCards];
      newCards[index] = {
        ...newCards[index],
        iconFile: file,
        icon: URL.createObjectURL(file)
      };
      setPlatformCards(newCards);
    }
  };

  const openIconSelector = (index: number) => {
    setCurrentIconSelectorContext('platformCard');
    setCurrentIconSelectorIndex(index);
    setIsIconSelectorOpen(true);
  };
  
  const openServiceIconSelector = (key: string) => {
    setCurrentIconSelectorContext('serviceIcon');
    setCurrentServiceIconKey(key);
    setIsIconSelectorOpen(true);
  };

  const openGsPlatformIconSelector = (key: string) => {
    setCurrentIconSelectorContext('gsPlatformIcon');
    setCurrentGsPlatformIconKey(key);
    setIsIconSelectorOpen(true);
  };

  const openQuickStartIconSelector = (id: number) => {
    setCurrentIconSelectorContext('quickStartButton');
    setCurrentQuickStartButtonId(id);
    setIsIconSelectorOpen(true);
  };

  const openBenefitIconSelector = (id: number) => {
    setCurrentIconSelectorContext('benefit');
    setCurrentBenefitId(id);
    setIsIconSelectorOpen(true);
  };

  const handleSelectIcon = (icon: AvailableIcon) => {
    const iconValue = icon.url || icon.name;

    if (currentIconSelectorContext === 'platformCard' && currentIconSelectorIndex !== null) {
      const newCards = [...platformCards];
      newCards[currentIconSelectorIndex] = {
        ...newCards[currentIconSelectorIndex],
        icon: iconValue,
        iconFile: undefined
      };
      
      setPlatformCards(newCards);
      setIsIconSelectorOpen(false);
      setCurrentIconSelectorIndex(null);
    } else if (currentIconSelectorContext === 'serviceIcon' && currentServiceIconKey) {
        setServiceIcons(prev => ({
            ...prev,
            [currentServiceIconKey]: { ...prev[currentServiceIconKey], icon: iconValue }
        }));
        setIsIconSelectorOpen(false);
        setCurrentServiceIconKey(null);
    } else if (currentIconSelectorContext === 'gsPlatformIcon' && currentGsPlatformIconKey) {
        setGetStartedPlatformIcons(prev => ({
            ...prev,
            [currentGsPlatformIconKey]: { ...prev[currentGsPlatformIconKey], icon: iconValue }
        }));
        setIsIconSelectorOpen(false);
        setCurrentGsPlatformIconKey(null);
    } else if (currentIconSelectorContext === 'quickStartButton' && currentQuickStartButtonId) {
        setQuickStartButtons(prev => prev.map(btn => 
            btn.id === currentQuickStartButtonId ? { ...btn, icon: iconValue } : btn
        ));
        setIsIconSelectorOpen(false);
        setCurrentQuickStartButtonId(null);
    } else if (currentIconSelectorContext === 'benefit' && currentBenefitId) {
        setBenefits(prev => prev.map(b => 
            b.id === currentBenefitId ? { ...b, icon: iconValue } : b
        ));
        setIsIconSelectorOpen(false);
        setCurrentBenefitId(null);
    }
  };

  const handleInfluenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setInfluenceImageFile(file);
      setInfluenceImageName(file.name);
    }
  };

  const handleUpdateInfluenceStep = (index: number, field: keyof InfluenceStep, value: any) => {
    const newSteps = [...influenceSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setInfluenceSteps(newSteps);
  };
  
  const handleUpdateInfluenceSubpoint = (stepIndex: number, subpointIndex: number, field: keyof InfluenceSubpoint, value: string) => {
      const newSteps = [...influenceSteps];
      const step = { ...newSteps[stepIndex] };
      if (step.subpoints) {
          const newSubpoints = [...step.subpoints];
          newSubpoints[subpointIndex] = { ...newSubpoints[subpointIndex], [field]: value };
          step.subpoints = newSubpoints;
          newSteps[stepIndex] = step;
          setInfluenceSteps(newSteps);
      }
  };

  const handleAddInfluenceStep = () => {
    const newStep: InfluenceStep = {
      id: Date.now(),
      title: "New Step",
      description: "Step description goes here.",
      subpoints: []
    };
    setInfluenceSteps([...influenceSteps, newStep]);
  };

  const handleRemoveInfluenceStep = (index: number) => {
    setInfluenceSteps(influenceSteps.filter((_, i) => i !== index));
  };

  const handleAddInfluenceSubpoint = (stepIndex: number) => {
    const newSteps = [...influenceSteps];
    const step = { ...newSteps[stepIndex] };
    const newSubpoints = step.subpoints ? [...step.subpoints] : [];
    newSubpoints.push({ title: "New Subpoint", text: "Subpoint details" });
    step.subpoints = newSubpoints;
    newSteps[stepIndex] = step;
    setInfluenceSteps(newSteps);
  };

  const handleRemoveInfluenceSubpoint = (stepIndex: number, subpointIndex: number) => {
    const newSteps = [...influenceSteps];
    const step = { ...newSteps[stepIndex] };
    if (step.subpoints) {
      step.subpoints = step.subpoints.filter((_, i) => i !== subpointIndex);
      newSteps[stepIndex] = step;
      setInfluenceSteps(newSteps);
    }
  };

  const handleUpdateQuickStartButton = (index: number, field: keyof QuickStartButton, value: string) => {
    const newButtons = [...quickStartButtons];
    newButtons[index] = { ...newButtons[index], [field]: value };
    setQuickStartButtons(newButtons);
  };
  
  const handleAddQuickStartButton = () => {
      const newButton: QuickStartButton = {
          id: Date.now(),
          label: "NEW BUTTON",
          link: "#",
          gradientClass: "grad-orange",
          icon: "instagram"
      };
      setQuickStartButtons([...quickStartButtons, newButton]);
  };
  
  const handleRemoveQuickStartButton = (index: number) => {
      setQuickStartButtons(quickStartButtons.filter((_, i) => i !== index));
  };

  return (
    <div className="admin-wrapper">
      <PromoBar />
      <div className="admin-body">
        <AdminSidebar activePage="homepageContent" />
        <main className="admin-main">
          <AdminToolbar title="Homepage Content" />
          <div className="homepage-content-page">
            <div className="homepage-header">
              <h1>Homepage Content</h1>
              <p>Manage content for various sections of the homepage.</p>
            </div>

            {/* Hero Section */}
            <div className="homepage-section-card">
              <div className="homepage-section-header">
                <h2 className="section-title">Hero Section</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                >
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              {error && (
                <div style={{ 
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 1000,
                  padding: '1rem', 
                  backgroundColor: '#fee', 
                  color: '#c33', 
                  borderRadius: '4px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span>{error}</span>
                  <button 
                    onClick={() => setError(null)} 
                    style={{
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      lineHeight: 1,
                      color: '#c33'
                    }}
                  >
                    ×
                  </button>
                </div>
              )}
              
              {success && (
                <div style={{ 
                  position: 'fixed',
                  bottom: '20px',
                  right: '20px',
                  zIndex: 1000,
                  padding: '1rem', 
                  backgroundColor: '#efe', 
                  color: '#065f46', 
                  borderRadius: '4px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  fontWeight: 500
                }}>
                  Homepage content saved successfully!
                </div>
              )}
              
              {loading && (
                <div style={{ padding: '1rem', textAlign: 'center' }}>
                  Loading...
                </div>
              )}
              <div className="homepage-form-grid">
                <label className="homepage-label">
                  Title (HTML allowed)
                  <textarea
                    className="homepage-textarea"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    rows={3}
                  />
                </label>
                <label className="homepage-label">
                  Subtitle
                  <textarea
                    className="homepage-textarea"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    rows={3}
                  />
                </label>
                <div className="homepage-two-col">
                  <label className="homepage-label">
                    Button 1 Text
                    <input
                      type="text"
                      className="homepage-input"
                      value={button1Text}
                      onChange={(e) => setButton1Text(e.target.value)}
                    />
                  </label>
                  <label className="homepage-label">
                    Button 1 Link/Action
                    <input
                      type="text"
                      className="homepage-input"
                      value={button1Link}
                      onChange={(e) => setButton1Link(e.target.value)}
                    />
                  </label>
                </div>
                <div className="homepage-two-col">
                  <label className="homepage-label">
                    Button 2 Text
                    <input
                      type="text"
                      className="homepage-input"
                      value={button2Text}
                      onChange={(e) => setButton2Text(e.target.value)}
                    />
                  </label>
                  <label className="homepage-label">
                    Button 2 Link/Action
                    <input
                      type="text"
                      className="homepage-input"
                      value={button2Link}
                      onChange={(e) => setButton2Link(e.target.value)}
                    />
                  </label>
                </div>
                <div className="homepage-two-col">
                  <label className="homepage-label">
                    Rating
                    <input
                      type="text"
                      className="homepage-input"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      placeholder="5.0"
                    />
                  </label>
                  <label className="homepage-label">
                    Review Count Text
                    <input
                      type="text"
                      className="homepage-input"
                      value={reviewCountText}
                      onChange={(e) => setReviewCountText(e.target.value)}
                      placeholder="1,442+ Reviews"
                    />
                  </label>
                </div>
              </div>

              <div className="homepage-section-divider"></div>

              <h2 className="section-title">Hero Profile Card</h2>
              <div className="homepage-form-grid">
                <div className="homepage-two-col">
                  <label className="homepage-label">
                    Handle
                    <input
                      type="text"
                      className="homepage-input"
                      value={heroProfileHandle}
                      onChange={(e) => setHeroProfileHandle(e.target.value)}
                      placeholder="@yourprofile"
                    />
                  </label>
                  <label className="homepage-label">
                    Role
                    <input
                      type="text"
                      className="homepage-input"
                      value={heroProfileRole}
                      onChange={(e) => setHeroProfileRole(e.target.value)}
                      placeholder="Lifestyle Creator"
                    />
                  </label>
                </div>
                <div className="homepage-three-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <label className="homepage-label">
                    Likes
                    <input
                      type="text"
                      className="homepage-input"
                      value={heroProfileLikes}
                      onChange={(e) => setHeroProfileLikes(e.target.value)}
                      placeholder="1,258"
                    />
                  </label>
                  <label className="homepage-label">
                    Followers
                    <input
                      type="text"
                      className="homepage-input"
                      value={heroProfileFollowers}
                      onChange={(e) => setHeroProfileFollowers(e.target.value)}
                      placeholder="15.2k"
                    />
                  </label>
                  <label className="homepage-label">
                    Engagement
                    <input
                      type="text"
                      className="homepage-input"
                      value={heroProfileEngagement}
                      onChange={(e) => setHeroProfileEngagement(e.target.value)}
                      placeholder="3.4%"
                    />
                  </label>
                </div>
              </div>

              <div className="homepage-section-divider"></div>

              <h2 className="section-title">Hero Illustration Post Image</h2>
              <div className="homepage-image-upload">
                <div className="homepage-image-frame">
                  {heroImage || heroImageName ? (
                    <div className="homepage-image-preview">
                      <div className="homepage-image-container" style={{ width: '100%', height: '200px', backgroundColor: '#f3f4f6', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px' }}>
                         {(heroImage || heroProfileImage) && (
                           <img 
                             src={heroImage ? URL.createObjectURL(heroImage) : heroProfileImage} 
                             alt="Preview" 
                             style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                           />
                         )}
                      </div>
                      <span>Image: {heroImageName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroImage(null);
                          setHeroImageName("");
                          setHeroProfileImage("");
                        }}
                        className="homepage-remove-image"
                      >
                        <FontAwesomeIcon icon={faXmark} />
                      </button>
                    </div>
                  ) : (
                    <div className="homepage-image-placeholder">
                      <div className="homepage-post-frame">
                        <div className="homepage-post-image-area">
                          <div style={{ fontSize: "12px", color: "#9ca3af" }}>No Image Uploaded</div>
                        </div>
                        <div className="homepage-post-lines">
                          <div className="homepage-post-line"></div>
                          <div className="homepage-post-line short"></div>
                          <div className="homepage-post-line"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="homepage-image-upload-info">
                  <p className="homepage-upload-text">Upload an image to display inside the social media post frame in the hero illustration.</p>
                  <label htmlFor="hero-image-upload" className="homepage-upload-btn">
                    Upload New Image
                  </label>
                  <input
                    id="hero-image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>

            {/* Platform Section */}
            <div className="homepage-section-card">
              <div className="homepage-section-header">
                <h2 className="section-title">Platform Section</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                >
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div className="homepage-form-grid">
                <label className="homepage-label">
                  Title
                  <input
                    type="text"
                    className="homepage-input"
                    value={platformTitle}
                    onChange={(e) => setPlatformTitle(e.target.value)}
                  />
                </label>
                <label className="homepage-label">
                  Subtitle
                  <input
                    type="text"
                    className="homepage-input"
                    value={platformSubtitle}
                    onChange={(e) => setPlatformSubtitle(e.target.value)}
                  />
                </label>
              </div>
              
              <div className="homepage-section-divider"></div>
              
              <h3 className="section-subtitle">Platform Cards</h3>
              <div className="homepage-benefits-grid">
                {platformCards.map((card, index) => (
                  <div key={index} className="homepage-benefit-card">
                    <div className="homepage-benefit-header">
                      <span className="homepage-benefit-icon-preview">
                        {card.icon ? (
                           card.icon.startsWith('/') || card.icon.startsWith('http') ? (
                               <img src={card.icon} alt={card.name} width={24} height={24} style={{ borderRadius: '4px' }} />
                           ) : (
                               <FontAwesomeIcon icon={iconMap[card.icon] || faImage} style={{ width: '24px', height: '24px', color: '#6b7280' }} />
                           )
                        ) : (
                          <>
                            {card.key === 'instagram' && <img src="/instagram.svg" alt="Instagram" width={24} height={24} />}
                            {card.key === 'tiktok' && <img src="/tiktok-10.svg" alt="TikTok" width={24} height={24} />}
                            {card.key === 'youtube' && <img src="/youtube-9.svg" alt="YouTube" width={24} height={24} />}
                          </>
                        )}
                      </span>
                      <span className="homepage-benefit-title">{card.name}</span>
                    </div>
                    <div className="homepage-form-grid">
                      <label className="homepage-label">
                        Icon
                        <div style={{ marginTop: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => openIconSelector(index)}
                              className="homepage-upload-btn"
                              style={{ width: '100%', marginBottom: '0.5rem', textAlign: 'center', justifyContent: 'center' }}
                            >
                              <FontAwesomeIcon icon={faImage} style={{ marginRight: '8px' }} />
                              Select from Library
                            </button>
                            
                            {card.icon && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '40px', height: '40px', border: '1px solid #ddd', padding: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f9fafb' }}>
                                        {card.icon.startsWith('/') || card.icon.startsWith('http') ? (
                                            <img src={card.icon} alt="Icon Preview" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                        ) : (
                                            <FontAwesomeIcon icon={iconMap[card.icon] || faImage} style={{ maxWidth: '100%', maxHeight: '100%', color: '#6b7280' }} />
                                        )}
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            const newCards = [...platformCards];
                                            newCards[index] = {
                                              ...newCards[index],
                                              icon: undefined,
                                              iconFile: undefined
                                            };
                                            setPlatformCards(newCards);
                                        }}
                                        style={{ fontSize: '0.8rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Remove Icon
                                    </button>
                                </div>
                            )}
                        </div>
                      </label>
                      <div className="homepage-two-col">
                        <label className="homepage-label">
                          Platform Key (Icon)
                          <select
                            className="homepage-input"
                            value={card.key}
                            onChange={(e) => {
                              const newCards = [...platformCards];
                              newCards[index] = { ...newCards[index], key: e.target.value };
                              setPlatformCards(newCards);
                            }}
                          >
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="youtube">YouTube</option>
                          </select>
                        </label>
                        <label className="homepage-label">
                          Service Type
                          <input
                            type="text"
                            className="homepage-input"
                            value={card.serviceType}
                            onChange={(e) => {
                              const newCards = [...platformCards];
                              newCards[index] = { ...newCards[index], serviceType: e.target.value };
                              setPlatformCards(newCards);
                            }}
                          />
                        </label>
                      </div>
                      <div className="homepage-two-col">
                        <label className="homepage-label">
                          Rating
                          <input
                            type="text"
                            className="homepage-input"
                            value={card.rating || ""}
                            onChange={(e) => {
                              const newCards = [...platformCards];
                              newCards[index] = { ...newCards[index], rating: e.target.value };
                              setPlatformCards(newCards);
                            }}
                            placeholder="5.0"
                          />
                        </label>
                        <label className="homepage-label">
                          Reviews
                          <input
                            type="text"
                            className="homepage-input"
                            value={card.reviews || ""}
                            onChange={(e) => {
                              const newCards = [...platformCards];
                              newCards[index] = { ...newCards[index], reviews: e.target.value };
                              setPlatformCards(newCards);
                            }}
                            placeholder="4,500+"
                          />
                        </label>
                      </div>
                      <label className="homepage-label">
                        Name
                        <input
                          type="text"
                          className="homepage-input"
                          value={card.name}
                          onChange={(e) => {
                            const newCards = [...platformCards];
                            newCards[index] = { ...newCards[index], name: e.target.value };
                            setPlatformCards(newCards);
                          }}
                        />
                      </label>
                      <label className="homepage-label">
                        Description
                        <textarea
                          className="homepage-textarea"
                          value={card.desc}
                          onChange={(e) => {
                            const newCards = [...platformCards];
                            newCards[index] = { ...newCards[index], desc: e.target.value };
                            setPlatformCards(newCards);
                          }}
                          rows={2}
                        />
                      </label>
                      <label className="homepage-label">
                        Tags (comma separated)
                        <input
                          type="text"
                          className="homepage-input"
                          value={card.tags.join(", ")}
                          onChange={(e) => {
                            const newCards = [...platformCards];
                            newCards[index] = { ...newCards[index], tags: e.target.value.split(",").map(t => t.trim()) };
                            setPlatformCards(newCards);
                          }}
                        />
                      </label>
                      <label className="homepage-label">
                        CTA Text
                        <input
                          type="text"
                          className="homepage-input"
                          value={card.cta}
                          onChange={(e) => {
                            const newCards = [...platformCards];
                            newCards[index].cta = e.target.value;
                            setPlatformCards(newCards);
                          }}
                        />
                      </label>
                    </div>
                    <div className="homepage-benefit-actions">
                      <button
                        type="button"
                        onClick={() => handleRemovePlatformCard(index)}
                        className="homepage-benefit-delete"
                      >
                        Delete Card
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={handleAddPlatformCard} className="homepage-add-benefit-btn">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Platform Card</span>
                </button>
              </div>
            </div>

            {/* Why Choose Us Section */}
            <div className="homepage-section-card">
              <div className="homepage-section-header">
                <h2 className="section-title">Why Choose Us Section</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                >
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div className="homepage-form-grid">
                <label className="homepage-label">
                  Title
                  <input
                    type="text"
                    className="homepage-input"
                    value={whyChooseTitle}
                    onChange={(e) => setWhyChooseTitle(e.target.value)}
                  />
                </label>
                <label className="homepage-label">
                  Subtitle
                  <input
                    type="text"
                    className="homepage-input"
                    value={whyChooseSubtitle}
                    onChange={(e) => setWhyChooseSubtitle(e.target.value)}
                  />
                </label>
              </div>

              <div className="homepage-benefits-section">
                <h3 className="benefits-subtitle">Benefits</h3>
                {benefits.map((benefit) => (
                  <div key={benefit.id} className="homepage-benefit-row">
                    <div className="homepage-benefit-fields">
                      <label className="homepage-label-small">
                        Icon
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <div style={{ width: '40px', height: '40px', border: '1px solid #ddd', padding: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f9fafb' }}>
                                {benefit.icon ? (
                                    benefit.icon.startsWith('/') || benefit.icon.startsWith('http') ? (
                                        <img 
                                          src={benefit.icon} 
                                          alt={benefit.title} 
                                          style={{ maxWidth: '100%', maxHeight: '100%' }} 
                                        />
                                    ) : (
                                        iconMap[benefit.icon] ? (
                                            <FontAwesomeIcon icon={iconMap[benefit.icon]} style={{ maxWidth: '100%', maxHeight: '100%', color: '#6b7280' }} />
                                        ) : (
                                            <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{benefit.icon}</span>
                                        )
                                    )
                                ) : (
                                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Def</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => openBenefitIconSelector(benefit.id)}
                                className="homepage-upload-btn"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            >
                                <FontAwesomeIcon icon={faImage} /> Select
                            </button>
                        </div>
                      </label>
                      <label className="homepage-label-small">
                        Title
                        <input
                          type="text"
                          className="homepage-input-small"
                          value={benefit.title}
                          onChange={(e) => handleUpdateBenefit(benefit.id, "title", e.target.value)}
                        />
                      </label>
                      <label className="homepage-label-small">
                        Description
                        <input
                          type="text"
                          className="homepage-input-small"
                          value={benefit.description}
                          onChange={(e) => handleUpdateBenefit(benefit.id, "description", e.target.value)}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(benefit.id)}
                      className="homepage-remove-benefit"
                      aria-label="Remove benefit"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddBenefit} className="homepage-add-benefit-btn">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Benefit</span>
                </button>
              </div>
            </div>
          {/* How It Works Section (formerly Influence Section) */}
            <div className="homepage-section-card">
              <div className="homepage-section-header">
                <h2 className="section-title">How It Works Content</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                >
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div className="homepage-form-grid">
                <label className="homepage-label">
                  Section Heading (HTML allowed)
                  <input
                    type="text"
                    className="homepage-input"
                    value={influenceTitle}
                    onChange={(e) => setInfluenceTitle(e.target.value)}
                    placeholder="e.g. How It Works"
                  />
                </label>
                <label className="homepage-label">
                  Subtitle
                  <input
                    type="text"
                    className="homepage-input"
                    value={influenceSubtitle}
                    onChange={(e) => setInfluenceSubtitle(e.target.value)}
                  />
                </label>
              </div>
              
              <div className="homepage-section-divider"></div>
              
              <h3 className="section-subtitle">Side Image</h3>
              <div className="homepage-image-upload">
                <div className="homepage-image-frame">
                  {influenceImageFile || influenceImageName ? (
                    <div className="homepage-image-preview">
                      <div className="homepage-image-container" style={{ width: '100%', height: '200px', backgroundColor: '#f3f4f6', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '8px' }}>
                        {(influenceImageFile || influenceImage) && (
                          <img 
                            src={influenceImageFile ? URL.createObjectURL(influenceImageFile) : influenceImage} 
                            alt="Preview" 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                            onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = "/illustrations/influence-girl-star.svg";
                            }}
                          />
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="homepage-image-upload-info">
                  <p className="homepage-upload-text">Upload an image for the right side of the section.</p>
                  <label htmlFor="influence-image-upload" className="homepage-upload-btn">
                    Upload Image
                  </label>
                  <input
                    id="influence-image-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleInfluenceImageUpload}
                  />
                </div>
              </div>

              <div className="homepage-section-divider"></div>
              
              <h3 className="section-subtitle">Steps</h3>
              {influenceSteps.map((step, index) => (
                <div key={step.id} className="homepage-benefit-card" style={{ marginBottom: '1rem' }}>
                  <div className="homepage-form-grid">
                    <label className="homepage-label">
                      Step {index + 1} Title
                      <input
                        type="text"
                        className="homepage-input"
                        value={step.title}
                        onChange={(e) => handleUpdateInfluenceStep(index, 'title', e.target.value)}
                      />
                    </label>
                    <label className="homepage-label">
                      Description
                      <textarea
                        className="homepage-textarea"
                        rows={2}
                        value={step.description}
                        onChange={(e) => handleUpdateInfluenceStep(index, 'description', e.target.value)}
                      />
                    </label>
                    
                    <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #eee' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>Subpoints</h4>
                        <button 
                          type="button" 
                          onClick={() => handleAddInfluenceSubpoint(index)}
                          style={{ fontSize: '0.8rem', color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          + Add Subpoint
                        </button>
                      </div>
                      
                      {step.subpoints && step.subpoints.map((sub, subIndex) => (
                        <div key={subIndex} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                          <div className="homepage-two-col" style={{ flex: 1, marginBottom: 0 }}>
                            <input
                              type="text"
                              className="homepage-input"
                              placeholder="Subpoint Title"
                              value={sub.title}
                              onChange={(e) => handleUpdateInfluenceSubpoint(index, subIndex, 'title', e.target.value)}
                            />
                            <input
                              type="text"
                              className="homepage-input"
                              placeholder="Subpoint Text"
                              value={sub.text}
                              onChange={(e) => handleUpdateInfluenceSubpoint(index, subIndex, 'text', e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveInfluenceSubpoint(index, subIndex)}
                            style={{ color: '#ef4444', background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer' }}
                            title="Remove Subpoint"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="homepage-benefit-actions">
                      <button
                        type="button"
                        onClick={() => handleRemoveInfluenceStep(index)}
                        className="homepage-benefit-delete"
                      >
                        Delete
                      </button>
                    </div>
                </div>
              ))}
              <button type="button" onClick={handleAddInfluenceStep} className="homepage-add-benefit-btn">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Step</span>
              </button>
            </div>

            {/* Quick Start Section */}
            <div className="homepage-section-card">
              <div className="homepage-section-header">
                <h2 className="section-title">Quick Start Section</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                >
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              <div className="homepage-form-grid">
                <label className="homepage-label">
                  Title
                  <input
                    type="text"
                    className="homepage-input"
                    value={quickStartTitle}
                    onChange={(e) => setQuickStartTitle(e.target.value)}
                  />
                </label>
                <label className="homepage-label">
                  Description 1
                  <textarea
                    className="homepage-textarea"
                    value={quickStartDescription1}
                    onChange={(e) => setQuickStartDescription1(e.target.value)}
                    rows={2}
                  />
                </label>
                <label className="homepage-label">
                  Description 2
                  <textarea
                    className="homepage-textarea"
                    value={quickStartDescription2}
                    onChange={(e) => setQuickStartDescription2(e.target.value)}
                    rows={2}
                  />
                </label>
              </div>

              <div className="homepage-section-divider"></div>
              <h3 className="section-subtitle">Action Buttons</h3>
              <div className="homepage-benefits-grid">
                {quickStartButtons.map((btn, index) => (
                  <div key={btn.id} className="homepage-benefit-card">
                    <div className="homepage-form-grid">
                      <label className="homepage-label">
                        Label
                        <input
                          type="text"
                          className="homepage-input"
                          value={btn.label}
                          onChange={(e) => handleUpdateQuickStartButton(index, 'label', e.target.value)}
                        />
                      </label>
                      <label className="homepage-label">
                        Link
                        <input
                          type="text"
                          className="homepage-input"
                          value={btn.link}
                          onChange={(e) => handleUpdateQuickStartButton(index, 'link', e.target.value)}
                        />
                      </label>
                      <div className="homepage-two-col">
                        <label className="homepage-label">
                          Icon
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <div style={{ width: '40px', height: '40px', border: '1px solid #ddd', padding: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f9fafb' }}>
                                {btn.icon ? (
                                    btn.icon.startsWith('/') || btn.icon.startsWith('http') ? (
                                        <img 
                                          src={btn.icon} 
                                          alt={btn.label} 
                                          style={{ maxWidth: '100%', maxHeight: '100%' }} 
                                        />
                                    ) : (
                                        btn.icon === 'instagram' ? <img src="/instagram-11.png" alt="Instagram" style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                                        btn.icon === 'tiktok' ? <img src="/tiktok-9.png" alt="TikTok" style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                                        btn.icon === 'youtube' ? <img src="/youtube-7.png" alt="YouTube" style={{ maxWidth: '100%', maxHeight: '100%' }} /> :
                                        <FontAwesomeIcon icon={iconMap[btn.icon] || faImage} style={{ maxWidth: '100%', maxHeight: '100%', color: '#6b7280' }} />
                                    )
                                ) : (
                                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Def</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => openQuickStartIconSelector(btn.id)}
                                className="homepage-upload-btn"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            >
                                <FontAwesomeIcon icon={faImage} /> Select
                            </button>
                        </div>
                        </label>
                        <label className="homepage-label">
                          Gradient
                          <select
                            className="homepage-input"
                            value={btn.gradientClass}
                            onChange={(e) => handleUpdateQuickStartButton(index, 'gradientClass', e.target.value)}
                          >
                            <option value="grad-orange">Orange</option>
                            <option value="grad-red">Red</option>
                            <option value="grad-pink">Pink</option>
                            <option value="grad-purple">Purple</option>
                            <option value="grad-violet">Violet</option>
                            <option value="grad-magenta">Magenta</option>
                          </select>
                        </label>
                      </div>
                    </div>
                    <div className="homepage-benefit-actions">
                      <button
                        type="button"
                        onClick={() => handleRemoveQuickStartButton(index)}
                        className="homepage-benefit-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={handleAddQuickStartButton} className="homepage-add-benefit-btn">
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Button</span>
                </button>
              </div>
            </div>

            {/* Get Started Instantly Section */}
            <div className="homepage-section-card">
              <div className="homepage-section-header">
                <h2 className="section-title">Get Started Instantly Content</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                >
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Saving...' : 'Save Global Settings'}
                </button>
              </div>

              {/* Global Settings */}
              <div className="homepage-form-grid" style={{ marginBottom: '2rem', paddingBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                <label className="homepage-label">
                  Main Section Heading
                  <input
                    type="text"
                    className="homepage-input"
                    value={getStartedMainHeading}
                    onChange={(e) => setGetStartedMainHeading(e.target.value)}
                    placeholder="Get Started Instantly"
                  />
                  <span style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                    This is the main heading displayed above the section.
                  </span>
                </label>
              </div>

              <h3 className="section-subtitle" style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Platform Icons</h3>
              <div className="homepage-form-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {Object.keys(getStartedPlatformIcons).map((key) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="homepage-label" style={{ textTransform: 'capitalize' }}>{key}</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <div style={{ width: '40px', height: '40px', border: '1px solid #ddd', padding: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f9fafb' }}>
                                {getStartedPlatformIcons[key].icon ? (
                                    getStartedPlatformIcons[key].icon.startsWith('/') || getStartedPlatformIcons[key].icon.startsWith('http') ? (
                                        <img src={getStartedPlatformIcons[key].icon} alt={key} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                    ) : (
                                        <FontAwesomeIcon icon={iconMap[getStartedPlatformIcons[key].icon] || faImage} style={{ maxWidth: '100%', maxHeight: '100%', color: '#6b7280' }} />
                                    )
                                ) : (
                                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Def</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => openGsPlatformIconSelector(key)}
                                className="homepage-upload-btn"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            >
                                <FontAwesomeIcon icon={faImage} /> Select
                            </button>
                        </div>
                         <input
                            type="text"
                            className="homepage-input"
                            value={getStartedPlatformIcons[key].label}
                            onChange={(e) => setGetStartedPlatformIcons({...getStartedPlatformIcons, [key]: {...getStartedPlatformIcons[key], label: e.target.value}})}
                            placeholder="Label"
                            style={{ fontSize: '0.85rem', padding: '0.4rem' }}
                        />
                    </div>
                ))}
              </div>

              <h3 className="section-subtitle" style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Service Type Icons</h3>
              <div className="homepage-form-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {Object.keys(serviceIcons).map((key) => (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="homepage-label" style={{ textTransform: 'capitalize' }}>{key}</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                             <div style={{ width: '40px', height: '40px', border: '1px solid #ddd', padding: '5px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f9fafb' }}>
                                {serviceIcons[key].icon ? (
                                    serviceIcons[key].icon.startsWith('/') || serviceIcons[key].icon.startsWith('http') ? (
                                        <img src={serviceIcons[key].icon} alt={key} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                                    ) : (
                                        <FontAwesomeIcon icon={iconMap[serviceIcons[key].icon] || faImage} style={{ maxWidth: '100%', maxHeight: '100%', color: '#6b7280' }} />
                                    )
                                ) : (
                                    <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>Def</span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => openServiceIconSelector(key)}
                                className="homepage-upload-btn"
                                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                            >
                                <FontAwesomeIcon icon={faImage} /> Select
                            </button>
                        </div>
                         <input
                            type="text"
                            className="homepage-input"
                            value={serviceIcons[key].label}
                            onChange={(e) => setServiceIcons({...serviceIcons, [key]: {...serviceIcons[key], label: e.target.value}})}
                            placeholder="Label"
                            style={{ fontSize: '0.85rem', padding: '0.4rem' }}
                        />
                    </div>
                ))}
              </div>

              <h3 className="section-subtitle" style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Dynamic Content (Per Platform)</h3>
              <div className="homepage-form-grid" style={{ marginBottom: '1.5rem' }}>
                <div className="homepage-two-col">
                  <label className="homepage-label">
                    Platform
                    <select
                      className="homepage-input"
                      value={gsPlatform}
                      onChange={(e) => setGsPlatform(e.target.value)}
                    >
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                    </select>
                  </label>
                  <label className="homepage-label">
                    Service Type
                    <select
                      className="homepage-input"
                      value={gsService}
                      onChange={(e) => setGsService(e.target.value)}
                    >
                      <option value="likes">Likes</option>
                      <option value="followers">Followers</option>
                      <option value="views">Views</option>
                      <option value="subscribers">Subscribers</option>
                    </select>
                  </label>
                  <label className="homepage-label">
                    Quality
                    <select
                      className="homepage-input"
                      value={gsQuality}
                      onChange={(e) => setGsQuality(e.target.value)}
                    >
                      <option value="premium">Premium</option>
                      <option value="hq">High Quality</option>
                    </select>
                  </label>
                </div>
              </div>

              {gsLoading ? (
                <div style={{ padding: '1rem', textAlign: 'center' }}>Loading content...</div>
              ) : (
                <>
                  <div className="homepage-form-grid">
                    <label className="homepage-label">
                      Heading
                      <input
                        type="text"
                        className="homepage-input"
                        value={gsHeading}
                        onChange={(e) => setGsHeading(e.target.value)}
                        placeholder="e.g. Premium Likes Features"
                      />
                    </label>

                    <label className="homepage-label">
                      Explanation Title
                      <input
                        type="text"
                        className="homepage-input"
                        value={gsExplanationTitle}
                        onChange={(e) => setGsExplanationTitle(e.target.value)}
                        placeholder="e.g. Why Are Instagram Likes Important?"
                      />
                    </label>

                    <label className="homepage-label">
                      Explanation Text
                      <textarea
                        className="homepage-textarea"
                        value={gsExplanation}
                        onChange={(e) => setGsExplanation(e.target.value)}
                        rows={3}
                        placeholder="Enter explanation text for this combination..."
                      />
                    </label>
                    
                    <div className="homepage-label">
                      Features List
                      {gsFeatures.map((feature, index) => (
                        <div key={index} className="homepage-two-col" style={{ marginBottom: '0.5rem' }}>
                          <input
                            type="text"
                            className="homepage-input"
                            value={feature}
                            onChange={(e) => handleUpdateFeature(index, e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="homepage-benefit-delete"
                            style={{ width: 'auto', padding: '0 1rem' }}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddFeature} className="homepage-add-benefit-btn" style={{ marginTop: '0.5rem' }}>
                        <FontAwesomeIcon icon={faPlus} />
                        <span>Add Feature Point</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                      className="save-btn"
                      onClick={handleSaveGetStarted}
                      disabled={gsSaving}
                    >
                      {gsSaving ? 'Saving...' : 'Save Section Content'}
                    </button>
                    {gsMessage && (
                      <span style={{ 
                        color: gsMessage.type === 'success' ? '#10b981' : '#ef4444',
                        fontSize: '0.9rem'
                      }}>
                        {gsMessage.text}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

          </div>
        </main>
      </div>

      {isIconSelectorOpen && (
        <div className="icon-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="icon-modal-content" style={{ background: 'white', padding: '2rem', borderRadius: '8px', width: '80%', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Select Icon</h2>
              <button onClick={() => setIsIconSelectorOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', overflowY: 'auto', padding: '1rem' }}>
              {availableIcons.map((icon) => (
                <div 
                    key={icon.id} 
                    onClick={() => handleSelectIcon(icon)}
                    style={{ 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px', 
                        padding: '1rem', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        background: '#fff'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                >
                  <div style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {icon.url ? (
                        <img src={icon.url} alt={icon.alt || icon.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      ) : (
                         iconMap[icon.name] ? <FontAwesomeIcon icon={iconMap[icon.name]} style={{ fontSize: '24px' }} /> : <span>?</span>
                      )}
                  </div>
                  <span style={{ fontSize: '0.8rem', textAlign: 'center', wordBreak: 'break-word' }}>{icon.name}</span>
                </div>
              ))}
              
              {availableIcons.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                    No icons found. Please upload icons in the Icon Management page.
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setIsIconSelectorOpen(false)}
                style={{ padding: '0.5rem 1rem', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

