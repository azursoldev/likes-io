"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faThumbsUp, 
  faCoffee, 
  faClock, 
  faShieldCheck,
  faShieldHalved,
  faLock,
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import { useSearchParams, useRouter } from "next/navigation";
import { useCurrency } from "../../../contexts/CurrencyContext";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { formatPrice, getCurrencySymbol } = useCurrency();
  const [username, setUsername] = useState("");
  const [isPackageOpen, setIsPackageOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get package info from URL params if available
  const qty = searchParams.get("qty") || "5K";
  const priceValue = parseFloat(searchParams.get("price") || "34.99");
  const packageType = searchParams.get("type") || "High-Quality";
  
  // Format selected package from URL params
  const currencyCode = getCurrencySymbol() === "€" ? "EUR" : "USD";
  const selectedPackage = `${qty} Views / ${formatPrice(priceValue)} ${currencyCode}`;

  // High-Quality Views packages
  const highQualityPrices = [4.99, 8.99, 19.99, 34.99, 59.99, 119.99, 189.99];
  const highQualityQuantities = [500, "1K", "2.5K", "5K", "10K", "25K", "50K"];
  
  // Premium Views packages
  const premiumPrices = [6.49, 11.99, 26.99, 47.99, 74.99, 159.99, 279.99];
  const premiumQuantities = [500, "1K", "2.5K", "5K", "10K", "25K", "50K"];

  // Use the appropriate package list based on packageType
  const packagePrices = packageType === "Premium" ? premiumPrices : highQualityPrices;
  const packageQuantities = packageType === "Premium" ? premiumQuantities : highQualityQuantities;
  
  const packages = packageQuantities.map((qty, idx) => {
    if (qty === "100,000+") return "100,000+ Custom";
    return `${qty} Views / ${formatPrice(packagePrices[idx])} ${currencyCode}`;
  });
  
  packages.push("100,000+ Custom");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPackageOpen(false);
      }
    };

    if (isPackageOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isPackageOpen]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      // Navigate to posts selection page (if exists) or final checkout
      router.push(`/tiktok/views/checkout/posts?username=${encodeURIComponent(username)}&qty=${qty}&price=${priceValue}&type=${encodeURIComponent(packageType)}`);
    }
  };

  return (
    <>
      <Header />
      <main className="checkout-page">
        <div className="checkout-container">
          {/* Selection Indicator */}
          <div className="checkout-indicator">
            <div className="checkout-indicator-dot"></div>
            <span className="checkout-indicator-text">SELECTION</span>
          </div>

          {/* Title and Subtitle */}
          <h1 className="checkout-title">TikTok Views Checkout</h1>
          <p className="checkout-subtitle">Start by entering your video link.</p>

          {/* Features List Card */}
          <div className="checkout-card checkout-features-card">
            <div className="checkout-features">
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faThumbsUp} className="checkout-feature-icon" />
                <span>Internationally acclaimed services & top ratings.</span>
              </div>
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faCoffee} className="checkout-feature-icon" />
                <span>24/7 support team ready to help.</span>
              </div>
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faClock} className="checkout-feature-icon" />
                <span>10+ years in the marketing business.</span>
              </div>
              <div className="checkout-feature-item">
                <FontAwesomeIcon icon={faShieldCheck} className="checkout-feature-icon" />
                <span>PCI DSS compliant payment system using 256-bit encryption.</span>
              </div>
            </div>
          </div>

          {/* Form Section Card */}
          <div className="checkout-card checkout-form-card">
            <form className="checkout-form" onSubmit={handleContinue}>
              <div className="checkout-form-group">
                <label className="checkout-label">TikTok video link</label>
                <input
                  type="text"
                  className="checkout-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your TikTok video URL"
                />
              </div>

              <div className="checkout-form-group">
                <label className="checkout-label">Product package</label>
                <div className="checkout-dropdown-wrapper" ref={dropdownRef}>
                  <button
                    type="button"
                    className="checkout-dropdown"
                    onClick={() => setIsPackageOpen(!isPackageOpen)}
                  >
                    <span>{selectedPackage}</span>
                    <FontAwesomeIcon icon={faAngleDown} className="checkout-dropdown-icon" />
                  </button>
                  {isPackageOpen && (
                    <div className="checkout-dropdown-menu">
                      {packages.map((pkg, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className="checkout-dropdown-item"
                          onClick={() => {
                            setIsPackageOpen(false);
                          }}
                        >
                          {pkg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Disclaimer */}
              <p className="checkout-legal">
                By continuing, you agree to our{" "}
                <a href="/terms" className="checkout-link">terms of service</a> and{" "}
                <a href="/privacy" className="checkout-link">privacy policy</a>.
              </p>

              {/* Continue Button */}
              <button type="submit" className="checkout-continue-btn">
                Continue
              </button>

              {/* Security Assurance */}
              <div className="checkout-security">
                <div className="checkout-security-item">
                  <FontAwesomeIcon icon={faShieldHalved} className="checkout-security-icon" />
                  <span>100% Safe Delivery</span>
                </div>
                <div className="checkout-security-item">
                  <FontAwesomeIcon icon={faLock} className="checkout-security-icon" />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </form>
          </div>

          {/* Payment Methods Card */}
          <div className="checkout-card checkout-payment-card">
            <div className="checkout-payment">
              <span className="checkout-payment-label">Pay securely with</span>
              <div className="checkout-payment-icons">
                {/* iCH Logo */}
                <div className="checkout-payment-icon-wrapper">
                  <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="60" height="40" rx="6" fill="#0066CC"/>
                    <circle cx="12" cy="12" r="3" fill="#FFA500"/>
                    <text x="30" y="26" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle" letterSpacing="1px">iCH</text>
                  </svg>
                </div>
                {/* Mastercard Logo */}
                <div className="checkout-payment-icon-wrapper">
                  <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="60" height="40" rx="6" fill="#1A1F71"/>
                    <circle cx="20" cy="20" r="9" fill="#EB001B"/>
                    <circle cx="40" cy="20" r="9" fill="#F79E1B"/>
                    <circle cx="30" cy="20" r="8.5" fill="#FF5F00"/>
                  </svg>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

