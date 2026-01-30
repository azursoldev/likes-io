"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUser, faLock, faShield, faBolt, faEnvelope, faImage, faCheck } from "@fortawesome/free-solid-svg-icons";
import HowItWorksSection from "./HowItWorksSection";
import ReviewsSection from "./ReviewsSection";
import FAQSection from "./FAQSection";

import { freeLikesFAQs, freeLikesReviews } from "../lib/free-tool-defaults";

const freeLikesSteps = [
  {
    title: "1. Enter Your Username",
    description: "Just type in your public Instagram username. We will never, ever ask for your password.",
  },
  {
    title: "2. Select Your Post",
    description: "Choose the photo or video you want to boost. We'll show you your recent posts to make it easy.",
  },
  {
    title: "3. Receive Free Likes",
    description: "Confirm your selection and watch the likes arrive instantly. It's that simple!",
  },
];


type FAQ = {
  q: string;
  a: string;
};

type Review = {
  handle: string;
  role: string;
  text: string;
};

export default function FreeLikesPage({ content, testimonials }: { content?: { 
  heroTitle: string; 
  heroDescription: string; 
  rating: string; 
  reviewCount: string; 
  step1Title?: string | null;
  step1Description?: string | null;
  step2Title?: string | null;
  step2Description?: string | null;
  step3Title?: string | null;
  step3Description?: string | null;
  inputLabel?: string | null;
  inputPlaceholder?: string | null;
  buttonText?: string | null;
  assurance1?: string | null;
  assurance2?: string | null;
  assurance3?: string | null;
  faqs?: FAQ[] | null;
  reviews?: Review[] | null;
  reviewsTitle?: string | null;
  reviewsSubtitle?: string | null;
}, testimonials?: { handle: string; role: string | null; text: string; }[] }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const heroTitle = content?.heroTitle || "Get 50 Free Instagram Likes";
  const heroDescription = content?.heroDescription || "Experience our high-quality service for free. No password required. See real results in minutes and understand why thousands trust us for their growth.";
  const rating = content?.rating || "4.9/5";
  const reviewCount = content?.reviewCount || "451+";

  const step1Title = content?.step1Title || "1. Enter Your Username";
  const step1Description = content?.step1Description || "Just type in your public Instagram username. We will never, ever ask for your password.";
  const step2Title = content?.step2Title || "2. Select Your Post";
  const step2Description = content?.step2Description || "Choose the photo or video you want to boost. We'll show you your recent posts to make it easy.";
  const step3Title = content?.step3Title || "3. Receive Free Likes";
  const step3Description = content?.step3Description || "Confirm your selection and watch the likes arrive instantly. It's that simple!";
  
  const inputLabel = content?.inputLabel || "Enter Your Instagram Username";
  const inputPlaceholder = content?.inputPlaceholder || "@yourusername";
  const buttonText = content?.buttonText || "Continue →";
  
  const assurance1 = content?.assurance1 || "No Password Required";
  const assurance2 = content?.assurance2 || "Secure & Safe";
  const assurance3 = content?.assurance3 || "Instant Delivery";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Move to next step
      setCurrentStep(2);
    }
  };

  const handlePostSelect = (postNumber: number) => {
    setSelectedPost(postNumber);
  };

  const handleContinueStep2 = () => {
    if (selectedPost !== null) {
      setCurrentStep(3);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Handle final submission
      console.log("Final submission:", { username, selectedPost, email });
      // You can add API call here
      setIsSuccess(true);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setUsername("");
    setSelectedPost(null);
    setEmail("");
    setIsSuccess(false);
  };

  return (
    <section className="free-likes-page">
      {/* Hero Section */}
      <div className="free-likes-hero">
        <div className="container">
          <h1 className="free-likes-title">{heroTitle}</h1>
          <p className="free-likes-description">
            {heroDescription}
          </p>
          
          {/* Rating Display */}
          <div className="free-likes-rating">
            <div className="free-likes-stars">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
              ))}
            </div>
            <span className="free-likes-rating-text">{rating} based on {reviewCount} reviews</span>
          </div>

          
        </div>
      </div>
      {/* Form Card */}
      <div className="free-likes-form-card-wrapper">
      <div className="free-likes-form-card">
            {/* Progress Indicator */}
            <div className="free-likes-progress">
              <div className={`progress-step ${currentStep >= 1 || isSuccess ? 'active' : ''} ${currentStep > 1 || isSuccess ? 'completed' : ''}`}>
                <div className="progress-step-circle">
                  {currentStep > 1 || isSuccess ? '✓' : '1'}
                </div>
                <span className="progress-step-label">{step1Title.split('.')[1]?.trim() || "Username"}</span>
              </div>
              <div className={`progress-line ${currentStep >= 2 || isSuccess ? 'active' : ''}`}></div>
              <div className={`progress-step ${currentStep >= 2 || isSuccess ? 'active' : ''} ${currentStep > 2 || isSuccess ? 'completed' : ''}`}>
                <div className="progress-step-circle">
                  {currentStep > 2 || isSuccess ? '✓' : '2'}
                </div>
                <span className="progress-step-label">{step2Title.split('.')[1]?.trim() || "Select Post"}</span>
              </div>
              <div className={`progress-line ${currentStep >= 3 || isSuccess ? 'active' : ''}`}></div>
              <div className={`progress-step ${currentStep >= 3 || isSuccess ? 'active' : ''} ${isSuccess ? 'completed' : ''}`}>
                <div className="progress-step-circle">
                  {isSuccess ? '✓' : '3'}
                </div>
                <span className="progress-step-label">{step3Title.split('.')[1]?.trim() || "Activate"}</span>
              </div>
            </div>

            {/* Step 1: Username Form */}
            {currentStep === 1 && (
              <form className="free-likes-form" onSubmit={handleSubmit}>
                <label htmlFor="username" className="free-likes-form-label">
                  {inputLabel}
                </label>
                <div className="free-likes-input-wrapper">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    className="free-likes-input"
                    placeholder={inputPlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="free-likes-continue-btn">
                  {buttonText}
                </button>
              </form>
            )}

            {/* Step 2: Post Selection */}
            {currentStep === 2 && (
              <div className="free-likes-post-selection">
                <h2 className="free-likes-post-selection-title">Select a Post to Boost</h2>
                <div className="free-likes-posts-grid">
                  {Array.from({ length: 9 }).map((_, index) => {
                    const postNumber = index + 1;
                    return (
                      <button
                        key={postNumber}
                        type="button"
                        className={`free-likes-post-item ${selectedPost === postNumber ? 'selected' : ''}`}
                        onClick={() => handlePostSelect(postNumber)}
                      >
                        <div className="free-likes-post-placeholder">
                          <span className="free-likes-post-label">Post {postNumber}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="free-likes-continue-btn"
                  onClick={handleContinueStep2}
                  disabled={selectedPost === null}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 3: Activate */}
            {currentStep === 3 && !isSuccess && (
              <form className="free-likes-activate-form" onSubmit={handleFinalSubmit}>
                <h2 className="free-likes-activate-title">Almost there!</h2>
                
                {/* Selected Post Info */}
                <div className="free-likes-selected-post-info">
                  <div className="free-likes-selected-post-icon">
                    <FontAwesomeIcon icon={faImage} />
                  </div>
                  <div className="free-likes-selected-post-details">
                    <div className="free-likes-selected-post-label">Selected post</div>
                    <div className="free-likes-boosting-for">
                      <span className="boosting-text">Boosting post for:</span>
                      <span className="boosting-username">{username || '@username'}</span>
                    </div>
                  </div>
                </div>

                {/* Email Input */}
                <div className="free-likes-email-field">
                  <div className="free-likes-input-wrapper">
                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      className="free-likes-input"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="free-likes-get-likes-btn">
                  Get Free Likes
                </button>
              </form>
            )}

            {/* Success Screen */}
            {isSuccess && (
              <div className="free-likes-success">
                {/* Success Icon */}
                <div className="free-likes-success-icon">
                  <FontAwesomeIcon icon={faCheck} />
                </div>
                
                {/* Success Message */}
                <h2 className="free-likes-success-title">Success!</h2>
                <p className="free-likes-success-message">
                  Your 50 free likes are on their way. You should see them on your post within the next few minutes.
                </p>

                {/* Premium CTA */}
                <div className="free-likes-premium-cta">
                  <div className="premium-cta-title">Enjoyed the trial?</div>
                  <div className="premium-cta-text">
                    Get up to 10,000 more likes instantly. Check out our premium plans for serious growth!
                  </div>
                </div>

                {/* Start Over Link */}
                <button
                  type="button"
                  className="free-likes-start-over"
                  onClick={handleStartOver}
                >
                  Start Over
                </button>
              </div>
            )}

            {/* Trust Badges */}
            <div className="free-likes-trust-badges">
              <div className="trust-badge">
                <FontAwesomeIcon icon={faLock} className="trust-icon" />
                <span>{assurance1}</span>
              </div>
              <div className="trust-badge">
                <FontAwesomeIcon icon={faShield} className="trust-icon" />
                <span>{assurance2}</span>
              </div>
              <div className="trust-badge">
                <FontAwesomeIcon icon={faBolt} className="trust-icon" />
                <span>{assurance3}</span>
              </div>
            </div>
          </div>
          </div>  
      {/* How It Works Section */}
      <HowItWorksSection
        title="How It Works"
        subtitle="Our free trial process is simple, secure, and designed to show you the quality of our service in just a few clicks."
        steps={freeLikesSteps}
      />

      {/* ReviewsSection */}
      <ReviewsSection
        title={content?.reviewsTitle || "Loved by Creators Worldwide"}
        subtitle={content?.reviewsSubtitle || "Real reviews from creators and brands who've seen incredible growth with our service."}
        reviews={testimonials && testimonials.length > 0 
          ? testimonials.map(t => ({ ...t, role: t.role || "Verified Buyer" }))
          : (content?.reviews || freeLikesReviews)}
      />

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Have questions? We've got answers. If you don't see your question here, feel free to contact us."
        faqs={content?.faqs || freeLikesFAQs}
        pageSize={6}
      />
    </section>
  );
}

