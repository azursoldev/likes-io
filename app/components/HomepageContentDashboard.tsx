"use client";

import PromoBar from "./PromoBar";
import AdminSidebar from "./AdminSidebar";
import AdminToolbar from "./AdminToolbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark, faImage } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

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

export default function HomepageContentDashboard() {
  const [heroTitle, setHeroTitle] = useState(
    'Real Social Media Growth, <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Delivered Instantly!</span>'
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    "Get real, high-quality likes, followers, and views to boost your social presence, reach the Explore Page, and grow your brand organically."
  );
  const [button1Text, setButton1Text] = useState("View Packages");
  const [button1Link, setButton1Link] = useState("#services-overview");
  const [button2Text, setButton2Text] = useState("Free Likes Trial");
  const [button2Link, setButton2Link] = useState("free-instagram-likes");
  const [reviewCountText, setReviewCountText] = useState("1,442+ Reviews");
  const [heroImage, setHeroImage] = useState<File | null>(null);
  const [heroImageName, setHeroImageName] = useState("");
  const [whyChooseTitle, setWhyChooseTitle] = useState("Why Choose Us?");
  const [whyChooseSubtitle, setWhyChooseSubtitle] = useState("Why Buying Instagram Likes is a Game-Changer");
  const [benefits, setBenefits] = useState<Benefit[]>(initialBenefits);

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
              <h2 className="section-title">Hero Section</h2>
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
                <label className="homepage-label">
                  Review Count Text
                  <input
                    type="text"
                    className="homepage-input"
                    value={reviewCountText}
                    onChange={(e) => setReviewCountText(e.target.value)}
                  />
                </label>
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

