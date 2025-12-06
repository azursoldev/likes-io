"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUser, faLock, faShield, faBolt, faEnvelope, faCheck, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import HowItWorksSection from "./HowItWorksSection";
import ReviewsSection from "./ReviewsSection";
import FAQSection from "./FAQSection";

const freeFollowersSteps = [
  {
    title: "1. Enter Your Username",
    description: "Just type in your public Instagram username. We will never, ever ask for your password.",
  },
  {
    title: "2. Activate Your Trial",
    description: "Confirm your account and provide an email for verification. It's that easy.",
  },
  {
    title: "3. Receive Free Followers",
    description: "Watch as 25 new followers are added to your account instantly. No strings attached!",
  },
];

const freeFollowersReviews = [
  {
    handle: "@grow_getter",
    role: "Verified Buyer",
    text: "Got my 25 free followers in minutes! Such a great way to kickstart my account. Highly recommend trying it!",
  },
  {
    handle: "@insta_explorer",
    role: "Verified Buyer",
    text: "I was amazed by how quickly the followers came through. The service is legit and the followers look real. Thanks!",
  },
  {
    handle: "@milestone_hunter",
    role: "Verified Buyer",
    text: "Perfect for testing the waters. The free trial helped me decide to purchase more. Great experience overall!",
  },
];

const freeFollowersFAQs = [
  {
    q: "Is the free Instagram followers trial completely free?",
    a: "Yes, absolutely! Our free trial offers 25 Instagram followers completely free with no hidden charges, credit card required, or subscription fees. It's our way of letting you experience the quality of our service.",
  },
  {
    q: "Do I need to give you my Instagram password?",
    a: "No, never! We will never ask for your Instagram password. We only need your public Instagram username to deliver the followers. Your account security is our top priority.",
  },
  {
    q: "How many free followers can I get with the trial?",
    a: "The free trial includes 25 Instagram followers. This is a one-time offer per account to let you experience our service quality before making a purchase.",
  },
  {
    q: "Why do you offer Instagram followers for free?",
    a: "We believe in transparency and want you to see the quality of our service firsthand. The free trial lets you experience our high-quality followers, instant delivery, and reliable service without any commitment.",
  },
  {
    q: "How long does it take to receive the free followers?",
    a: "Free followers are delivered instantly! Once you complete the simple process and confirm your account, the followers will start appearing on your account within minutes.",
  },
  {
    q: "Can I use the free followers trial more than once?",
    a: "The free trial is a one-time offer per Instagram account. However, if you're satisfied with the trial, you can purchase additional followers packages at any time.",
  },
];

export default function FreeFollowersPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Move to next step (activate)
      setCurrentStep(2);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      // Handle final submission
      console.log("Final submission:", { username, email });
      // You can add API call here
      setIsSuccess(true);
    }
  };

  const handleStartOver = () => {
    setCurrentStep(1);
    setUsername("");
    setEmail("");
    setIsSuccess(false);
  };

  return (
    <section className="free-likes-page">
      {/* Hero Section */}
      <div className="free-likes-hero">
        <div className="container">
          <h1 className="free-likes-title">Get 25 Free Instagram Followers</h1>
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
            <span className="free-likes-rating-text">4.9/5 based on 512+ reviews</span>
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
                <span className="progress-step-label">Username</span>
              </div>
              <div className={`progress-line ${currentStep >= 2 || isSuccess ? 'active' : ''}`}></div>
              <div className={`progress-step ${currentStep >= 2 || isSuccess ? 'active' : ''} ${isSuccess ? 'completed' : ''}`}>
                <div className="progress-step-circle">
                  {isSuccess ? '✓' : '2'}
                </div>
                <span className="progress-step-label">Activate</span>
              </div>
              <div className={`progress-line ${isSuccess ? 'active' : ''}`}></div>
              <div className={`progress-step ${isSuccess ? 'active' : ''} ${isSuccess ? 'completed' : ''}`}>
                <div className="progress-step-circle">
                  {isSuccess ? '✓' : '3'}
                </div>
                <span className="progress-step-label">Receive</span>
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

            {/* Step 2: Activate */}
            {currentStep === 2 && !isSuccess && (
              <form className="free-likes-activate-form" onSubmit={handleFinalSubmit}>
                <h2 className="free-likes-activate-title">Almost there!</h2>
                
                {/* Account Info */}
                <div className="free-likes-selected-post-info">
                  <div className="free-likes-selected-post-icon">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                  <div className="free-likes-selected-post-details">
                    <div className="free-likes-selected-post-label">Account</div>
                    <div className="free-likes-boosting-for">
                      <span className="boosting-text">Activating trial for:</span>
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
                  Get Free Followers
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
                  Your 25 free followers are on their way. You should see them on your account within the next few minutes.
                </p>

                {/* Premium CTA */}
                <div className="free-likes-premium-cta">
                  <div className="premium-cta-title">Enjoyed the trial?</div>
                  <div className="premium-cta-text">
                    Get up to 10,000 more followers instantly. Check out our premium plans for serious growth!
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
                <FontAwesomeIcon icon={faCheckCircle} className="trust-icon" />
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
        steps={freeFollowersSteps}
      />

      {/* Reviews Section */}
      <ReviewsSection
        title="Loved by Creators Worldwide"
        subtitle="Real reviews from creators and brands who've seen incredible growth with our service."
        reviews={freeFollowersReviews}
      />

      {/* FAQ Section */}
      <FAQSection
        title="Frequently Asked Questions"
        subtitle="Have questions? We've got answers. If you don't see your question here, feel free to contact us."
        faqs={freeFollowersFAQs}
        pageSize={6}
      />
    </section>
  );
}

