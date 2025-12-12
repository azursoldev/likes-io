"use client";

import { useState, Suspense } from "react";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheck,
  faUserPlus,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../../../../contexts/CurrencyContext";

function PostsSelectionContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  
  const username = searchParams.get("username") || "kyliejenner";
  const qty = searchParams.get("qty") || "1K";
  const priceValue = parseFloat(searchParams.get("price") || "79.99");
  const packageType = searchParams.get("type") || "High-Quality";

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to final checkout step
    router.push(`/tiktok/followers/checkout/final?username=${username}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`);
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
              <span className="progress-step-label">Account</span>
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
            {/* Left Column - Account Info */}
            <div className="posts-selection-left">
              <div className="checkout-card">
                <h2 className="posts-selection-title">Account Information</h2>
                
                <form className="posts-selection-form" onSubmit={handleContinue}>
                  <div className="posts-form-group">
                    <label className="checkout-label">TikTok Username</label>
                    <div className="posts-input-wrapper">
                      <input
                        type="text"
                        className="posts-input"
                        value={username}
                        readOnly
                        placeholder="Enter your TikTok username"
                      />
                    </div>
                    <p className="posts-helper-text">
                      Ensure your account is public. Followers will be delivered to your account.
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
                      <span className="order-summary-text">@{username || "username"}</span>
                    </div>
                    <button type="button" className="order-change-btn">Change</button>
                  </div>

                  <div className="order-summary-item">
                    <div className="order-summary-left">
                      <div className="order-summary-icon">
                        <FontAwesomeIcon icon={faUserPlus} />
                      </div>
                      <div className="order-summary-details">
                        <span className="order-summary-text">{qty} TikTok Followers</span>
                        <span className="order-summary-subtext">Delivered to your account.</span>
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

