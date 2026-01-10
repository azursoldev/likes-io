"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faImage, faSave } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

type Benefit = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

const initialBenefits: Benefit[] = [
  {
    id: 1,
    icon: "RocketLaunchIcon",
    title: "Instant Delivery",
    description: "Your order begins the moment you c",
  },
  {
    id: 2,
    icon: "AwardIcon",
    title: "Premium Quality Engagement",
    description: "Enhance your social proof with engr",
  },
  {
    id: 3,
    icon: "ShieldCheckIcon",
    title: "100% Safe & Secure",
    description: "Your account's safety is our top pric",
  },
  {
    id: 4,
    icon: "HeadsetIcon",
    title: "24/7 Customer Support",
    description: "Our dedicated global support team",
  },
];

// Default values matching the current Hero component
const DEFAULT_HERO_TITLE = `Real Social Media
Growth, <span class="accent">Delivered</span>
<span class="accent"> Instantly!</span>`;
const DEFAULT_HERO_SUBTITLE = "Get real, high-quality likes, followers, and views to boost your social presence, reach the Explore Page, and grow your brand organically.";
const DEFAULT_BUTTON1_TEXT = "View Packages";
const DEFAULT_BUTTON1_LINK = "#services-overview";
const DEFAULT_BUTTON2_TEXT = "Free Likes Trial";
const DEFAULT_BUTTON2_LINK = "#free-trial";
const DEFAULT_REVIEW_COUNT = "1,442+ Reviews";
const DEFAULT_RATING = "5.0";

type PlatformCard = {
  key: string;
  name: string;
  desc: string;
  tags: string[];
  cta: string;
  serviceType: string;
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
    title: "Build Instant Credibility & Trust",
    description: "A high follower count is the ultimate social proof. It tells new visitors your account is worth following, making them more likely to click \"Follow\" without hesitation.",
    subpoints: [
      { title: "Attract Organic Growth", text: "People naturally gravitate towards popular accounts. A strong follower base acts like a magnet for organic growth." },
      { title: "Increase Brand Trust", text: "For businesses, a large following establishes credibility and makes your brand appear more reputable to potential customers and partners." },
      { title: "Unlock Platform Features", text: "Reaching follower milestones on Instagram can unlock powerful features for driving traffic and engagement." }
    ]
  },
  {
    id: 2,
    title: "Amplify Your Reach & Influence",
    description: "A well-grown profile signals trust and authority, increasing audience confidence and brand appeal."
  },
  {
    id: 3,
    title: "Kickstart Your Growth",
    description: "Higher social proof improves reach and engagement, unlocking new growth loops over time."
  }
];

const initialQuickStartButtons: QuickStartButton[] = [
  { id: 1, label: "BUY INSTAGRAM FOLLOWERS", link: "instagram/followers", gradientClass: "grad-orange", icon: "instagram" },
  { id: 2, label: "BUY INSTAGRAM LIKES", link: "instagram/likes", gradientClass: "grad-red", icon: "instagram" },
  { id: 3, label: "BUY INSTAGRAM VIEWS", link: "instagram/views", gradientClass: "grad-pink", icon: "instagram" },
  { id: 4, label: "BUY TIKTOK LIKES", link: "tiktok/likes", gradientClass: "grad-purple", icon: "tiktok" },
  { id: 5, label: "BUY TIKTOK VIEWS", link: "tiktok/views", gradientClass: "grad-violet", icon: "tiktok" },
  { id: 6, label: "BUY TIKTOK FOLLOWERS", link: "tiktok/followers", gradientClass: "grad-magenta", icon: "tiktok" },
];

const initialPlatformCards: PlatformCard[] = [
  {
    key: "instagram",
    name: "Instagram",
    desc: "Boost your posts, gain credibility, and reach the Explore Page with our premium Instagram services.",
    tags: ["Likes", "Followers", "Views"],
    cta: "View Instagram Services",
    serviceType: "likes",
  },
  {
    key: "tiktok",
    name: "TikTok",
    desc: "Give your videos the viral push they need to land on the FYP and capture millions of views.",
    tags: ["Likes", "Followers", "Views"],
    cta: "View TikTok Services",
    serviceType: "likes",
  },
  {
    key: "youtube",
    name: "YouTube",
    desc: "Increase your video rankings, watch time, and channel authority to stand out on the world's largest video platform.",
    tags: ["Views", "Subscribers", "Likes"],
    cta: "View YouTube Services",
    serviceType: "views",
  },
];

export default function HomepageContentDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
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
  const [heroProfileHandle, setHeroProfileHandle] = useState("@yourprofile");
  const [heroProfileRole, setHeroProfileRole] = useState("Lifestyle Creator");
  const [heroProfileLikes, setHeroProfileLikes] = useState("1,258");
  const [heroProfileFollowers, setHeroProfileFollowers] = useState("15.2k");
  const [heroProfileEngagement, setHeroProfileEngagement] = useState("3.4%");
  
  const [platformTitle, setPlatformTitle] = useState("Choose Your Platform to Start Growing");
  const [platformSubtitle, setPlatformSubtitle] = useState("We support all major social media platforms");
  const [platformCards, setPlatformCards] = useState<PlatformCard[]>(initialPlatformCards);
  
  const [whyChooseTitle, setWhyChooseTitle] = useState("Why Choose Us?");
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState("Why Buying Instagram Likes is a Game-Changer");
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);

  const [influenceTitle, setInfluenceTitle] = useState("Build Your Empire of Influence");
  const [influenceSubtitle, setInfluenceSubtitle] = useState("Start your journey to becoming a social media influencer today");
  const [influenceSteps, setInfluenceSteps] = useState<InfluenceStep[]>(initialInfluenceSteps);
  const [influenceImageFile, setInfluenceImageFile] = useState<File | null>(null);
  const [influenceImageName, setInfluenceImageName] = useState("");
  const [influenceImage, setInfluenceImage] = useState("");
  
  const [quickStartTitle, setQuickStartTitle] = useState("Get Started Now");
  const [quickStartDescription1, setQuickStartDescription1] = useState("Select a package that fits your needs and watch your social media presence grow.");
  const [quickStartDescription2, setQuickStartDescription2] = useState("Our services are safe, secure, and delivered instantly.");
  const [quickStartButtons, setQuickStartButtons] = useState<QuickStartButton[]>(initialQuickStartButtons);

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

  // Fetch homepage content on mount
  useEffect(() => {
    fetchHomepageContent();
  }, []);

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

    setHeroTitle(content.heroTitle || DEFAULT_HERO_TITLE);
    setHeroSubtitle(content.heroSubtitle || DEFAULT_HERO_SUBTITLE);
    setRating(content.heroRating || DEFAULT_RATING);
    setReviewCountText(content.heroReviewCount || DEFAULT_REVIEW_COUNT);
    
    // Hero Profile Card
    setHeroProfileHandle(content.heroProfileHandle || "@yourprofile");
    setHeroProfileRole(content.heroProfileRole || "Lifestyle Creator");
    setHeroProfileLikes(content.heroProfileLikes || "1,258");
    setHeroProfileFollowers(content.heroProfileFollowers || "15.2k");
    setHeroProfileEngagement(content.heroProfileEngagement || "3.4%");
    setHeroProfileImage(content.heroProfileImage || "");
    if (content.heroProfileImage) {
      const fileName = content.heroProfileImage.split('/').pop();
      setHeroImageName(fileName || "Existing Image");
    }
    
    // Platform Section
    setPlatformTitle(content.platformTitle || "Choose Your Platform to Start Growing");
    setPlatformSubtitle(content.platformSubtitle || "We support all major social media platforms");
    if (content.platformCards) {
      setPlatformCards(content.platformCards);
    }
    
    // Why Choose Us
    setWhyChooseTitle(content.whyChooseTitle || "Why Choose Us?");
    setWhyChooseSubtitle(content.whyChooseSubtitle || "Why Buying Instagram Likes is a Game-Changer");
    
    // Influence Section
    setInfluenceTitle(content.influenceTitle || "Build Your Empire of Influence");
    setInfluenceSubtitle(content.influenceSubtitle || "Start your journey to becoming a social media influencer today");
    if (content.influenceSteps) {
      setInfluenceSteps(content.influenceSteps);
    }
    setInfluenceImage(content.influenceImage || "");
    if (content.influenceImage) {
      const fileName = content.influenceImage.split('/').pop();
      setInfluenceImageName(fileName || "Existing Image");
    }
    
    // Quick Start Section
    setQuickStartTitle(content.quickStartTitle || "Get Started Now");
    setQuickStartDescription1(content.quickStartDescription1 || "Select a package that fits your needs and watch your social media presence grow.");
    setQuickStartDescription2(content.quickStartDescription2 || "Our services are safe, secure, and delivered instantly.");
    if (content.quickStartButtons) {
      setQuickStartButtons(content.quickStartButtons);
    }
    
    if (content.benefits) {
      setBenefits(content.benefits);
    }

    // Parse CTA buttons if they exist
    if (content.heroCtaButtons && Array.isArray(content.heroCtaButtons)) {
      if (content.heroCtaButtons[0]) {
        setButton1Text(content.heroCtaButtons[0].text || DEFAULT_BUTTON1_TEXT);
        setButton1Link(content.heroCtaButtons[0].link || DEFAULT_BUTTON1_LINK);
      }
      if (content.heroCtaButtons[1]) {
        setButton2Text(content.heroCtaButtons[1].text || DEFAULT_BUTTON2_TEXT);
        setButton2Link(content.heroCtaButtons[1].link || DEFAULT_BUTTON2_LINK);
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
        influenceImageUrl = uploadData.publicUrl || uploadData.url;
        setInfluenceImage(influenceImageUrl);
      }

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
          platformCards,
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title">Hero Section</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: saving || loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: saving || loading ? 0.6 : 1,
                  }}
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
              <h2 className="section-title">Platform Section</h2>
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
                        {card.key === 'instagram' && <img src="/instagram.svg" alt="Instagram" width={24} height={24} />}
                        {card.key === 'tiktok' && <img src="/tiktok-10.svg" alt="TikTok" width={24} height={24} />}
                        {card.key === 'youtube' && <img src="/youtube-9.svg" alt="YouTube" width={24} height={24} />}
                      </span>
                      <span className="homepage-benefit-title">{card.name}</span>
                    </div>
                    <div className="homepage-form-grid">
                      <div className="homepage-two-col">
                        <label className="homepage-label">
                          Platform Key (Icon)
                          <select
                            className="homepage-input"
                            value={card.key}
                            onChange={(e) => {
                              const newCards = [...platformCards];
                              newCards[index].key = e.target.value;
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
                              newCards[index].serviceType = e.target.value;
                              setPlatformCards(newCards);
                            }}
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
                            newCards[index].name = e.target.value;
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
                            newCards[index].desc = e.target.value;
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
                            newCards[index].tags = e.target.value.split(",").map(t => t.trim());
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
              <h2 className="section-title">Why Choose Us Section</h2>
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
                        <select
                          className="homepage-input-small"
                          value={benefit.icon}
                          onChange={(e) => handleUpdateBenefit(benefit.id, "icon", e.target.value)}
                        >
                          <option>RocketLaunchIcon</option>
                          <option>AwardIcon</option>
                          <option>ShieldCheckIcon</option>
                          <option>HeadsetIcon</option>
                          <option>StarIcon</option>
                          <option>CheckCircleIcon</option>
                        </select>
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
          {/* Influence Section */}
            <div className="homepage-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title">Influence Section</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: saving || loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: saving || loading ? 0.6 : 1,
                  }}
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
                    value={influenceTitle}
                    onChange={(e) => setInfluenceTitle(e.target.value)}
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
              
              <h3 className="section-subtitle">Influence Image</h3>
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
                          />
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="homepage-image-upload-info">
                  <p className="homepage-upload-text">Upload an image for the right side of the Influence section.</p>
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
                    
                    {step.subpoints && (
                      <div style={{ marginTop: '1rem', paddingLeft: '1rem', borderLeft: '2px solid #eee' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: '#6b7280' }}>Subpoints</h4>
                        {step.subpoints.map((sub, subIndex) => (
                          <div key={subIndex} className="homepage-two-col" style={{ marginBottom: '0.5rem' }}>
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
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Start Section */}
            <div className="homepage-section-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2 className="section-title">Quick Start Section</h2>
                <button
                  onClick={handleSave}
                  disabled={saving || loading}
                  className="homepage-save-btn"
                  style={{
                    padding: '0.5rem 1.5rem',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: saving || loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    opacity: saving || loading ? 0.6 : 1,
                  }}
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
                          <select
                            className="homepage-input"
                            value={btn.icon}
                            onChange={(e) => handleUpdateQuickStartButton(index, 'icon', e.target.value)}
                          >
                            <option value="instagram">Instagram</option>
                            <option value="tiktok">TikTok</option>
                            <option value="youtube">YouTube</option>
                          </select>
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
              <h2 className="section-title">Get Started Instantly Content</h2>
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
    </div>
  );
};

