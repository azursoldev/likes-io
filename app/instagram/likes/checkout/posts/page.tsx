"use client";

import { useState, Suspense } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faLink,
  faHeart,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";

function PostsSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [postLink, setPostLink] = useState("");
  
  const username = searchParams.get("username") || "";
  const qty = searchParams.get("qty") || "500";
  const priceValue = parseFloat(searchParams.get("price") || "17.99");
  const packageType = searchParams.get("type") || "High-Quality";
  const serviceId = searchParams.get("serviceId") || "";

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (postLink.trim()) {
      // Navigate to final checkout step, include serviceId if available
      const params = new URLSearchParams({
        username: username,
        qty: qty,
        price: String(priceValue),
        type: packageType,
        postLink: postLink,
      });
      if (serviceId) {
        params.append("serviceId", serviceId);
      }
      router.push(`/instagram/likes/checkout/final?${params.toString()}`);
    }
  };

  return (
    <>
      <Header />
      <main className="posts-selection-page">
        <div className="posts-selection-container">
          {/* Progress Indicator */}
          <div className="checkout-progress">
            <div className="progress-step completed">
              <div className="progress-step-icon">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <span className="progress-step-label">Details</span>
            </div>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step active">
              <div className="progress-step-icon">
                <span>2</span>
              </div>
              <span className="progress-step-label">Posts</span>
            </div>
            <div className="progress-arrow">
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
            <div className="progress-step">
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
                    <label className="checkout-label">Instagram Post/Reel Link</label>
                    <div className="posts-input-wrapper">
                      <FontAwesomeIcon icon={faLink} className="posts-input-icon" />
                      <input
                        type="text"
                        className="posts-input"
                        value={postLink}
                        onChange={(e) => setPostLink(e.target.value)}
                        placeholder="https://www.instagram.com/p/C..."
                      />
                    </div>
                    <p className="posts-helper-text">
                      Ensure your account is public. Paste the full URL of the post or Reel you want to boost.
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
                        <img src="/instagram-11.png" alt="Instagram" width={20} height={20} />
                      </div>
                      <span className="order-summary-text">@{username || "username"}</span>
                    </div>
                    <button type="button" className="order-change-btn">Change</button>
                  </div>

                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <FontAwesomeIcon icon={faHeart} />
                      </div>
                      <div className="order-summary-details">
                        <span className="order-summary-text">{qty} Instagram Likes</span>
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
                    disabled={!postLink.trim()}
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
