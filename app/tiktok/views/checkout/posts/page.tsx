"use client";

import { useState, Suspense } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faLink,
  faEye,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";

function PostsSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [postLink, setPostLink] = useState("");
  const [linkError, setLinkError] = useState("");
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "5K";
  const priceValue = parseFloat(searchParams.get("price") || "34.99");
  const packageType = searchParams.get("type") || "High-Quality";

  // Validate TikTok video URL
  const isValidTikTokUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    
    // TikTok URL pattern: /@username/video/...
    const tiktokPattern = /^https?:\/\/(www\.)?(vm\.)?tiktok\.com\/@[A-Za-z0-9_.]+\/video\/\d+\/?/i;
    return tiktokPattern.test(url.trim());
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPostLink(value);
    
    // Validate on change
    if (value.trim() && !isValidTikTokUrl(value)) {
      setLinkError("Please enter a valid TikTok video URL");
    } else {
      setLinkError("");
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidTikTokUrl(postLink)) {
      // Navigate to final checkout step
      router.push(`/tiktok/views/checkout/final?username=${username}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}&postLink=${encodeURIComponent(postLink)}`);
    } else {
      setLinkError("Please enter a valid TikTok video URL");
    }
  };

  const handleDetailsClick = () => {
    router.push(`/tiktok/views/checkout?username=${username}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`);
  };

  return (
    <>
      <Header />
      <main className="posts-selection-page">
        <div className="posts-selection-container">
          {/* Progress Indicator */}
          <div className="checkout-progress">
            <div 
              className="progress-step completed" 
              onClick={handleDetailsClick}
              style={{ cursor: "pointer" }}
            >
              <div className="progress-step-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="progress-step-label">Details</span>
            </div>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step active" style={{ cursor: "default" }}>
              <div className="progress-step-icon">
                <span>2</span>
              </div>
              <span className="progress-step-label">Posts</span>
            </div>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step" style={{ cursor: "default" }}>
              <div className="progress-step-icon">
                <span>3</span>
              </div>
              <span className="progress-step-label">Checkout</span>
            </div>
          </div>

          <div className="posts-selection-layout">
            {/* Left Column - Enter Post Link */}
            <div className="posts-selection-left">
              <div className="checkout-card">
                <h2 className="posts-selection-title">Enter Post Link</h2>
                
                <form className="posts-selection-form" onSubmit={handleContinue}>
                  <div className="posts-form-group">
                    <label className="checkout-label">TikTok Video Link</label>
                    <div className="posts-input-wrapper">
                      <FontAwesomeIcon icon={faLink} className="posts-input-icon" />
                      <input
                        type="text"
                        className={`posts-input ${linkError ? "posts-input-error" : ""}`}
                        value={postLink}
                        onChange={handleLinkChange}
                        placeholder="https://www.tiktok.com/@username/video/..."
                      />
                    </div>
                    {linkError && (
                      <p className="posts-error-text" style={{ color: "#e74c3c", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                        {linkError}
                      </p>
                    )}
                    <p className="posts-helper-text">
                      Ensure your account is public. Paste the full URL of the video you want to boost.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="posts-selection-right">
              <div className="checkout-card order-summary-card">
                <div className="order-summary-section">
                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <img src="/tiktok-9.png" alt="TikTok" width={20} height={20} />
                      </div>
                      <span className="order-summary-text order-summary-url">{postLink || `@${username || "username"}`}</span>
                    </div>
                    <button type="button" className="order-change-btn">Change</button>
                  </div>

                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <FontAwesomeIcon icon={faEye} />
                      </div>
                      <div className="order-summary-details">
                        <span className="order-summary-text">{qty} TikTok Views</span>
                        <span className="order-summary-subtext">Applying to 1 post.</span>
                      </div>
                    </div>
                    <button type="button" className="order-change-btn">Change</button>
                  </div>

                  <div className="order-summary-divider"></div>

                  <div className="order-summary-total">
                    <span className="order-summary-label">Subtotal</span>
                    <span className="order-summary-price">{formatPrice(priceValue)} {getCurrencySymbol() === "€" ? "EUR" : "USD"}</span>
                  </div>

                  <button 
                    type="button" 
                    className="order-continue-btn"
                    onClick={handleContinue}
                    disabled={!isValidTikTokUrl(postLink)}
                  >
                    Continue to checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PostsSelectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsSelectionContent />
    </Suspense>
  );
}

