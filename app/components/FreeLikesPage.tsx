"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUser, faLock, faShield, faBolt, faEnvelope, faImage, faCheck } from "@fortawesome/free-solid-svg-icons";
import HowItWorksSection from "./HowItWorksSection";
import ReviewsSection from "./ReviewsSection";
import FAQSection from "./FAQSection";

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

const freeLikesReviews = [
  {
    handle: "@trial_user_1",
    role: "Verified Buyer",
    text: "Wow, it actually works! Got 50 likes in a minute. Great way to test the service.",
  },
  {
    handle: "@skeptic_sam",
    role: "Verified Buyer",
    text: "I was skeptical because it was free, but the likes came through instantly. Super impressed.",
  },
  {
    handle: "@new_post_boost",
    role: "Verified Buyer",
    text: "Perfect for giving my new post a little boost to get started. Thank you Likes.io!",
  },
];

const freeLikesFAQs = [
  {
    q: "Is the free Instagram likes trial really free?",
    a: "Yes, absolutely! Our free trial offers 50 Instagram likes completely free with no hidden charges, credit card required, or subscription fees. It's our way of letting you experience the quality of our service.",
  },
  {
    q: "Do I need to give you my Instagram password?",
    a: "No, never! We will never ask for your Instagram password. We only need your public Instagram username to deliver the likes. Your account security is our top priority.",
  },
  {
    q: "How many free likes can I get with the trial?",
    a: "The free trial includes 50 Instagram likes. This is a one-time offer per account to let you experience our service quality before making a purchase.",
  },
  {
    q: "Why do you offer Instagram likes for free?",
    a: "We believe in transparency and want you to see the quality of our service firsthand. The free trial lets you experience our high-quality likes, instant delivery, and reliable service without any commitment.",
  },
  {
    q: "How long does it take to receive the free likes?",
    a: "Free likes are delivered instantly! Once you complete the simple process and confirm your post selection, the likes will start appearing on your post within minutes.",
  },
  {
    q: "Can I use the free likes trial more than once?",
    a: "The free trial is a one-time offer per Instagram account. However, if you're satisfied with the trial, you can purchase additional likes packages at any time.",
  },
];

export default function FreeLikesPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

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
      <div className="container">
        {/* Hero Section */}
        <div className="free-likes-hero">
          <h1 className="free-likes-title">Get 50 Free Instagram Likes</h1>
          <p className="free-likes-description">
            Experience our high-quality service for free. No password required. See real results in minutes and understand why thousands trust us for their growth.
          </p>
          
          {/* Rating Display */}
          <div className="free-likes-rating">
            <div className="free-likes-stars">
              {[...Array(5)].map((_, i) => (
                <FontAwesomeIcon key={i} icon={faStar} className="star-icon" />
              ))}
            </div>
            <span className="free-likes-rating-text">4.9/5 based on 451+ reviews</span>
          </div>

          {/* Form Card */}
          <div className="free-likes-form-card">
            {/* Progress Indicator */}
            <div className="free-likes-progress">
              <div className={`progress-step ${currentStep >= 1 || isSuccess ? 'active' : ''} ${currentStep > 1 || isSuccess ? 'completed' : ''}`}>
                <div className="progress-step-circle">
                  {currentStep > 1 || isSuccess ? '✓' : '1'}
                </div>
                <span className="progress-step-label">Username</span>
              </div>
              <div className={`progress-line ${currentStep >= 2 || isSuccess ? 'active' : ''}`}></div>
              <div className={`progress-step ${currentStep >= 2 || isSuccess ? 'active' : ''} ${currentStep > 2 || isSuccess ? 'completed' : ''}`}>
                <div className="progress-step-circle">
                  {currentStep > 2 || isSuccess ? '✓' : '2'}
                </div>
                <span className="progress-step-label">Select Post</span>
              </div>
              <div className={`progress-line ${currentStep >= 3 || isSuccess ? 'active' : ''}`}></div>
              <div className={`progress-step ${currentStep >= 3 || isSuccess ? 'active' : ''} ${isSuccess ? 'completed' : ''}`}>
                <div className="progress-step-circle">
                  {isSuccess ? '✓' : '3'}
                </div>
                <span className="progress-step-label">Activate</span>
              </div>
            </div>

            {/* Step 1: Username Form */}
            {currentStep === 1 && (
              <form className="free-likes-form" onSubmit={handleSubmit}>
                <label htmlFor="username" className="free-likes-form-label">
                  Enter Your Instagram Username
                </label>
                <div className="free-likes-input-wrapper">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <input
                    type="text"
                    id="username"
                    className="free-likes-input"
                    placeholder="@yourusername"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="free-likes-continue-btn">
                  Continue →
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
                <span>No Password Required</span>
              </div>
              <div className="trust-badge">
                <FontAwesomeIcon icon={faShield} className="trust-icon" />
                <span>100% Free & Safe</span>
              </div>
              <div className="trust-badge">
                <FontAwesomeIcon icon={faBolt} className="trust-icon" />
                <span>Instant Delivery</span>
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

        {/* Reviews Section */}
        <ReviewsSection
          title="Loved by Creators Worldwide"
          subtitle="Real reviews from creators and brands who've seen incredible growth with our service."
          reviews={freeLikesReviews}
        />

        {/* FAQ Section */}
        <FAQSection
          title="Frequently Asked Questions"
          subtitle="Have questions? We've got answers. If you don't see your question here, feel free to contact us."
          faqs={freeLikesFAQs}
          pageSize={6}
        />
      </div>
    </section>
  );
}

