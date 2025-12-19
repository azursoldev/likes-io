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
  const [whyChooseTitle, setWhyChooseTitle] = useState("Why Choose Us?");
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState("Why Buying Instagram Likes is a Game-Changer");
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);

  // Fetch homepage content on mount
  useEffect(() => {
    fetchHomepageContent();
  }, []);

  const fetchHomepageContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/cms/homepage');
      
      if (!response.ok) {
        throw new Error('Failed to fetch homepage content');
      }
      
      const data = await response.json();
      
      if (data.content) {
        // Parse the content from database
        setHeroTitle(data.content.heroTitle || DEFAULT_HERO_TITLE);
        setHeroSubtitle(data.content.heroSubtitle || DEFAULT_HERO_SUBTITLE);
        setRating(data.content.heroRating || DEFAULT_RATING);
        setReviewCountText(data.content.heroReviewCount || DEFAULT_REVIEW_COUNT);
        
        // Parse CTA buttons if they exist
        if (data.content.heroCtaButtons && Array.isArray(data.content.heroCtaButtons)) {
          if (data.content.heroCtaButtons[0]) {
            setButton1Text(data.content.heroCtaButtons[0].text || DEFAULT_BUTTON1_TEXT);
            setButton1Link(data.content.heroCtaButtons[0].link || DEFAULT_BUTTON1_LINK);
          }
          if (data.content.heroCtaButtons[1]) {
            setButton2Text(data.content.heroCtaButtons[1].text || DEFAULT_BUTTON2_TEXT);
            setButton2Link(data.content.heroCtaButtons[1].link || DEFAULT_BUTTON2_LINK);
          }
        }
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

      const response = await fetch('/api/cms/homepage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heroTitle,
          heroSubtitle,
          heroRating: rating,
          heroReviewCount: reviewCountText,
          heroCtaButtons,
          isActive: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to save (${response.status})`);
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImage(file);
      setHeroImageName(file.name);
    }
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
                <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#fee', color: '#c33', borderRadius: '4px' }}>
                  {error}
                </div>
              )}
              
              {success && (
                <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: '#efe', color: '#3c3', borderRadius: '4px' }}>
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

              <h2 className="section-title">Hero Illustration Post Image</h2>
              <div className="homepage-image-upload">
                <div className="homepage-image-frame">
                  {heroImage || heroImageName ? (
                    <div className="homepage-image-preview">
                      <span>Image: {heroImageName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroImage(null);
                          setHeroImageName("");
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
          </div>
        </main>
      </div>
    </div>
  );
}

